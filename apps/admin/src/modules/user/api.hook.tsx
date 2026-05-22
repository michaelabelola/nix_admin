import {useQuery} from "@tanstack/react-query";
import {type UserModel} from "#/modules/user/Models.ts";
import userAPI from "#/modules/user/Api.ts";

export namespace UserRequest {
    export const useGetUser = (id: UserModel.UserID) => {
        return useQuery<UserModel.User>({
            queryKey: ['user', id],
            queryFn: ({queryKey}) => userAPI.getUserByID(queryKey[1] as any),
            staleTime: 0, // 24 hours
            initialData: undefined
        })
    }

    export const useGetAuthenticatedUser = () => {
        return useQuery<UserModel.DetailedUser>({
            queryKey: ['user', "me"],
            queryFn: () => userAPI.getMe(),
            staleTime: 0, // 24 hours
            initialData: {} as UserModel.DetailedUser,
        })
    }
    export const useGetDetailedUser = (id: UserModel.UserID) => {
        return useQuery<UserModel.DetailedUser>({
            queryKey: ['user', 'detailed', id],
            queryFn: ({queryKey}) => userAPI.getUserDetailed(queryKey[2] as any),
            staleTime: 0, // 24 hours
            initialData: undefined
        })
    }
}