import {type SignUpModel} from "#/modules/auth/signup/Model.ts";
import {useResponseFieldErrorHandler} from "#/lib/request.types.tsx";
import {useMutation} from "@tanstack/react-query";
import signUpApi from "#/modules/auth/signup/api.ts";

export namespace SignupHook {

    export function useSignUp(successHandler?: (res: SignUpModel.Response) => void) {
        const errHandler = useResponseFieldErrorHandler()
        return {
            ...useMutation({
                mutationFn: ({avatar, ...dto}: SignUpModel.Request & { avatar?: File }) =>
                    signUpApi.signUp({errHandler, body: dto, avatar: avatar}),
                onSuccess: successHandler,
                // onError: (_: ResponseError) => toast.error('Failed to create customer'),
                networkMode: 'online'
            }),
            errHandler,
        }

    }
}
