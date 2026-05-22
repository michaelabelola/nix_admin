import {useMutation} from "@tanstack/react-query";
import {AuthProfileModel} from "../auth-profile/Models.ts";
import {type LoginModel} from "./Model.ts";
import {useResponseFieldErrorHandler} from "../utils";
import {loginApi} from "./api.tsx";
import type {ResponseDto} from "../models";

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

    export function useResendVerificationEmail(successHandler?: (res: unknown) => void) {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useMutation({
                mutationFn: (dto: LoginModel.ResendVerificationRequest) =>
                    loginApi.resendVerificationEmail({errHandler, body: dto}),
                onSuccess: successHandler,
                networkMode: 'online'
            }),
            errHandler,
        }
    }

    export function useVerifyEmail(successHandler?: (res: ResponseDto<AuthProfileModel.AuthProfile>) => void) {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useMutation({
                mutationFn: (dto: LoginModel.VerifyEmailRequest) =>
                    loginApi.verifyEmail({
                        errHandler, body: dto,
                    }),
                onSuccess: successHandler,
                networkMode: 'online'
            }),
            errHandler,
        }
    }
}
