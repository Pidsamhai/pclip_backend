/* tslint:disable */
/* eslint-disable */

/** ############################################ */
/** !! Generate file don't edit by your self. !! */
/** ############################################ */

import { Controller, ValidateParam, FieldErrors, ValidateError, TsoaRoute } from '@tsoa/runtime';
import { GetSecretController } from './../controller/gethub.controller';
import { expressAuthentication } from './../auth/authentication';

const models: TsoaRoute.Models = {
    "DefaultResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
};

export function RegisterRoutes(app: any) {
        app.get('/github/:user/repos',
            function (request: any, response: any, next: any) {
            const args = {
                    user: {"in":"path","name":"user","required":true,"dataType":"string"},
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new GetSecretController();


            const promise = controller.getUserRepos.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
        app.get('/github/repos',
            authenticateMiddleware([{"gh_token":[]}]),
            function (request: any, response: any, next: any) {
            const args = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
                    notFoundResponse: {"in":"res","name":"404","required":true,"ref":"DefaultResponse"},
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new GetSecretController();


            const promise = controller.getPrivateUserRepos.apply(controller, validatedArgs as any);
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