import {useMutation} from "@tanstack/react-query";
import {useResponseFieldErrorHandler} from "#/lib/request.types.tsx";
import type {LoginModel} from "#/modules/auth/signin/Model.ts";
import {loginApi} from "#/modules/auth/signin/api.tsx";

export namespace SignInHook {

    export function useSignIn(successHandler?: (res: LoginModel.LoginResponse) => void) {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useMutation({
                mutationFn: (dto: LoginModel.EmailAndPassword) =>
                    loginApi.emailPasswordLogin({errHandler, body: dto}),
                onSuccess: successHandler,
                // onError: (_: ResponseError) => toast.error('Failed to create customer'),
                networkMode: 'online'
            }),
            errHandler,
        }

    }
}
