import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();
const supabaseUrl = process.env.SUPABASE_API_URL || "";
const supabaseKey = process.env.SUPABASE_SECRET_KEY || "";

export default createClient(supabaseUrl, supabaseKey);
