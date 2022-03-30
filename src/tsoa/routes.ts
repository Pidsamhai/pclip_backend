/* tslint:disable */
/* eslint-disable */

/** ############################################ */
/** !! Generate file don't edit by your self. !! */
/** ############################################ */

import { Controller, ValidateParam, FieldErrors, ValidateError, TsoaRoute } from '@tsoa/runtime';
import { AuthController } from './../controller/auth.controller';
import { RoomController } from './../controller/room.controller';
import { UpdaterController } from './../controller/updater.controller';
import { expressAuthentication } from './../auth/authentication';

const models: TsoaRoute.Models = {
    "UserIdentity": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "user_id": {"dataType":"string","required":true},
            "identity_data": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"},"required":true},
            "provider": {"dataType":"string","required":true},
            "created_at": {"dataType":"string","required":true},
            "last_sign_in_at": {"dataType":"string","required":true},
            "updated_at": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    "User": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "app_metadata": {"dataType":"nestedObjectLiteral","nestedProperties":{"provider":{"dataType":"string"}},"additionalProperties":{"dataType":"any"},"required":true},
            "user_metadata": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"},"required":true},
            "aud": {"dataType":"string","required":true},
            "confirmation_sent_at": {"dataType":"string"},
            "recovery_sent_at": {"dataType":"string"},
            "invited_at": {"dataType":"string"},
            "action_link": {"dataType":"string"},
            "email": {"dataType":"string"},
            "phone": {"dataType":"string"},
            "created_at": {"dataType":"string","required":true},
            "confirmed_at": {"dataType":"string"},
            "email_confirmed_at": {"dataType":"string"},
            "phone_confirmed_at": {"dataType":"string"},
            "last_sign_in_at": {"dataType":"string"},
            "role": {"dataType":"string"},
            "updated_at": {"dataType":"string"},
            "identities": {"dataType":"array","array":{"dataType":"refObject","ref":"UserIdentity"}},
        },
        "additionalProperties": false,
    },
    "Session": {
        "dataType": "refObject",
        "properties": {
            "provider_token": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "access_token": {"dataType":"string","required":true},
            "expires_in": {"dataType":"double"},
            "expires_at": {"dataType":"double"},
            "refresh_token": {"dataType":"string"},
            "token_type": {"dataType":"string","required":true},
            "user": {"dataType":"union","subSchemas":[{"ref":"User"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": false,
    },
    "UnAuthorized": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"enum","enums":[401],"required":true},
            "message": {"dataType":"enum","enums":["UnAuthorized"],"required":true},
        },
        "additionalProperties": false,
    },
    "Platform": {
        "dataType": "refObject",
        "properties": {
            "signature": {"dataType":"string","required":true},
            "url": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    "Platforms": {
        "dataType": "refObject",
        "properties": {
            "darwin": {"ref":"Platform","required":true},
            "linux": {"ref":"Platform","required":true},
            "win64": {"ref":"Platform","required":true},
        },
        "additionalProperties": false,
    },
    "Updater": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "notes": {"dataType":"string","required":true},
            "pub_date": {"dataType":"string","required":true},
            "platforms": {"ref":"Platforms","required":true},
        },
        "additionalProperties": false,
    },
};

export function RegisterRoutes(app: any) {
        app.post('/api/v1/auth/anonymous',
            authenticateMiddleware([{"SECRET":[]}]),
            function (request: any, response: any, next: any) {
            const args = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new AuthController();


            const promise = controller.createAnonymousAccount.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
        app.post('/api/v1/auth/mockuser',
            authenticateMiddleware([{"SECRET":[]}]),
            function (request: any, response: any, next: any) {
            const args = {
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new AuthController();


            const promise = controller.createMockUser.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
        app.post('/api/v1/room/join',
            authenticateMiddleware([{"SECRET":[]}]),
            function (request: any, response: any, next: any) {
            const args = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
                    params: {"in":"body","name":"params","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"device_name":{"dataType":"string","required":true},"secret":{"dataType":"string","required":true},"invite_id":{"dataType":"string","required":true}}},
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new RoomController();


            const promise = controller.joinRoom.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
        app.post('/api/v1/room/:room_id/invite',
            authenticateMiddleware([{"SECRET":[]}]),
            function (request: any, response: any, next: any) {
            const args = {
                    roomId: {"in":"path","name":"room_id","required":true,"dataType":"string"},
                    params: {"in":"body","name":"params","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"room_secret":{"dataType":"string","required":true}}},
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new RoomController();


            const promise = controller.inviteMember.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
        app.get('/api/v1/updater',
            function (request: any, response: any, next: any) {
            const args = {
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new UpdaterController();


            const promise = controller.getUpdate.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, response: any, next: any) {
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthentication(request, name, secMethod[name])
                                .catch(pushAndRethrow)
                        );
                    }

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthentication(request, name, secMethod[name])
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }


            try {
                request['user'] = await Promise.all(secMethodOrPromises);
                next();
            }
            catch(err) {
                const error = failedAttempts.pop();
                error.status = error.status || 401;
                response.status(error.status).json(error);
            }
        }
    }

    function promiseHandler(controllerObj: any, promise: any, response: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode;
                if (controllerObj instanceof Controller) {
                    const controller = controllerObj as Controller
                    const headers = controller.getHeaders();
                    Object.keys(headers).forEach((name: string) => {
                        response.set(name, headers[name]);
                    });

                    statusCode = controller.getStatus();
                }

                if (data !== null && data !== undefined) {
                    response.status(statusCode || 200).json(data);
                } else {
                    response.status(statusCode || 204).end();
                }
            })
            .catch((error: any) => next(error));
    }

    function getValidatedArgs(args: any, request: any): any[] {
        const errorFields: FieldErrors = {};
        const values = Object.keys(args).map(function(key) {
            const name = args[key].name;
            switch (args[key].in) {
            case 'request':
                return request;
            case 'query':
                return ValidateParam(args[key], request.query[name], models, name, errorFields, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
            case 'path':
                return ValidateParam(args[key], request.params[name], models, name, errorFields, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
            case 'header':
                return ValidateParam(args[key], request.header(name), models, name, errorFields, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
            case 'body':
                return ValidateParam(args[key], request.body, models, name, errorFields, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
            case 'body-prop':
                return ValidateParam(args[key], request.body[name], models, name, errorFields, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
            }
        });

        if (Object.keys(errorFields).length > 0) {
            throw new ValidateError(errorFields, '');
        }
        return values;
    }
}

/** ############################################ */
/** !! Generate file don't edit by your self. !! */
/** ############################################ */