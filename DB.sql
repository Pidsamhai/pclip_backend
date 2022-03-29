CREATE TABLE IF NOT EXISTS public.room (
  id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4 (),
  name varchar NOT NULL,
  iv varchar(16) NOT NULL DEFAULT substr(md5(random()::text), 0, 17),
  owner uuid DEFAULT auth.uid () REFERENCES auth.users (id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.room_message (
  id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4 (),
  message text NOT NULL,
  expired timestamp DEFAULT NULL,
  sender uuid DEFAULT auth.uid () REFERENCES auth.users (id) ON DELETE SET NULL,
  room_id uuid REFERENCES public.room (id) ON DELETE CASCADE NOT NULL,
  create_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.room_member (
  device_name varchar NOT NULL,
  room_id uuid REFERENCES public.room (id) ON DELETE CASCADE NOT NULL,
  member_id uuid REFERENCES auth.users (id) ON DELETE CASCADE NOT NULL,
  create_at timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY (room_id, member_id)
);

CREATE TABLE IF NOT EXISTS public.room_member_invite (
  id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY NOT NULL,
  room_secret_encrypt text NOT NULL,
  invite_id varchar(6) NOT NULL,
  invite_secret_hash text NOT NULL,
  expired timestamptz DEFAULT now() + interval '5 minute' NOT NULL,
  room_id uuid REFERENCES public.room (id) ON DELETE CASCADE NOT NULL
);

-- Handle insert owner room member
CREATE OR REPLACE FUNCTION public.handle_member ()
  RETURNS TRIGGER
  AS $
$
BEGIN
  INSERT INTO public.room_member (room_id, member_id, device_name)
    VALUES (new.id, new.owner, 'Owner');

RETURN new;

END;

$ $
LANGUAGE plpgsql
SECURITY DEFINER;

CREATE TRIGGER on_room_created
  AFTER INSERT ON public.room
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_member ();

CREATE OR REPLACE FUNCTION get_room_auth_user ()
  RETURNS SETOF uuid
  LANGUAGE sql
  SECURITY DEFINER
  SET search_path = public STABLE
  AS $
$
SELECT
  room_id
FROM
  room_member
WHERE
  member_id = auth.uid () $ $;

-- Check auth room owner
CREATE OR REPLACE FUNCTION is_owner (room_id uuid)
  RETURNS boolean
  LANGUAGE sql
  SECURITY DEFINER
  SET search_path = public STABLE
  AS $
$
SELECT
  TRUE
FROM
  room
WHERE
  OWNER = auth.uid () $ $;

CREATE OR REPLACE FUNCTION is_member (room_id uuid)
  RETURNS boolean
  LANGUAGE sql
  SECURITY DEFINER
  SET search_path = public STABLE
  AS $
$
SELECT
  TRUE
FROM
  room_member
WHERE
  member_id = auth.uid ()
  AND room_id = room_id $ $;

-- CREATE POLICY
-- ROOM
CREATE POLICY "Allow member read room" ON room
  FOR SELECT
    USING (id IN (
      SELECT
        get_room_auth_user ()));

CREATE POLICY "Allow user can create room" ON room
  FOR INSERT
    WITH CHECK (
  RIGHT (auth.email (), 25) != '@anon-users.pidsamhai.com' -- Anon Domain
);

CREATE POLICY "Allow member can update room" ON public.room
  FOR UPDATE
    WITH CHECK ((auth.uid () = OWNER));

-- MESSAGE
CREATE POLICY "Allow member can read message" ON room_message
  FOR SELECT
    USING ((is_member (room_id) AND ((expired IS NULL) OR (expired >= now()))));

CREATE POLICY "Allow sender can delete message" ON room_message
  FOR DELETE
    USING ((auth.uid () = sender));

CREATE POLICY "Allow member send message" ON room_message
  FOR INSERT
    WITH CHECK (is_member (room_id));

-- MEMBER
CREATE POLICY "Allow member can read members" ON room_member
  FOR SELECT
    USING (is_member (room_id));

CREATE POLICY "Allow member or owner can delete member" ON public.room_member
  FOR DELETE
    USING (((auth.uid () = member_id) OR is_owner (room_id)));

-- limit Room update
GRANT UPDATE (name) ON room TO authenticated;

-- Enable Real time
ALTER publication supabase_realtime
  ADD TABLE room, room_message, room_member;

-- Force trigger all event
ALTER TABLE room REPLICA IDENTITY
  FULL;

ALTER TABLE room_message REPLICA IDENTITY
  FULL;

ALTER TABLE room_member REPLICA IDENTITY
  FULL;

-- Enable RLS
ALTER TABLE room ENABLE ROW LEVEL SECURITY;

ALTER TABLE room_message ENABLE ROW LEVEL SECURITY;

ALTER TABLE room_member ENABLE ROW LEVEL SECURITY;

ALTER TABLE room_member_invite ENABLE ROW LEVEL SECURITY;

-- Cleaner
-- https://supabase.com/blog/2021/03/05/postgres-as-a-cron-server
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT
  cron.schedule ('message-cleaner', '0 0 * * *',
    -- At 00:00
    $ $ DELETE FROM room_message
    WHERE expired < now();

$ $);

SELECT
  cron.schedule ('room-cleaner',
    -- delete room if no member exist
    '0 0 * * *',
    -- At 00:00
    $ $ DELETE FROM room
    WHERE id IN (
        SELECT
          id
        FROM room
      LEFT JOIN room_member ON id = room_id GROUP BY id
    HAVING
      count(member_id) > 1);

$ $);

-- Unschedule
-- SELECT cron.unschedule(1) FROM cron.job;
-- select cron.unschedule('webhook-every-minute'); -- pass the name of the cron job
