import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"

import type {PageSlice, Paged} from "@suiteonix/models"
import {Page_EMPTY, PageSlice_EMPTY} from "@suiteonix/models"
import {useResponseFieldErrorHandler} from "../utils"
import chatApi from "./api.ts"
import type {ChatMemberModel, ChatMessageModel, ChatModel, ChatProfileModel} from "./model.ts"

type SuccessHandler<T> = (data: T) => void

const ChatQueryKeys = {
    root: ["chats"] as const,
    profile: () => [...ChatQueryKeys.root, "profile", "me"] as const,
    list: (query?: ChatModel.Query) => [...ChatQueryKeys.root, "list", query] as const,
    detail: (chatId: ChatModel.ChatID) => [...ChatQueryKeys.root, "detail", chatId] as const,
    membersRoot: (chatId: ChatModel.ChatID) => [...ChatQueryKeys.detail(chatId), "members"] as const,
    members: (chatId: ChatModel.ChatID, query?: ChatMemberModel.Query) =>
        [...ChatQueryKeys.membersRoot(chatId), "list", query] as const,
    messagesRoot: (chatId: ChatModel.ChatID) => [...ChatQueryKeys.detail(chatId), "messages"] as const,
    messages: (chatId: ChatModel.ChatID, query?: ChatMessageModel.Query) =>
        [...ChatQueryKeys.messagesRoot(chatId), "slice", query] as const,
}

export namespace ChatRequest {
    export const useQueryChats = (query?: ChatModel.Query) => {
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useQuery({
                queryKey: ChatQueryKeys.list(query),
                queryFn: () => chatApi.list(query, {errHandler}),
                initialData: Page_EMPTY as Paged<ChatModel.Chat>,
            }),
            errHandler,
        }
    }

    export const useGetChat = (chatId?: ChatModel.ChatID) => {
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useQuery({
                queryKey: ChatQueryKeys.detail(chatId || ""),
                queryFn: () => chatApi.get(chatId!, {errHandler}),
                enabled: !!chatId,
            }),
            errHandler,
        }
    }

    export const useGetMyProfile = () => {
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useQuery({
                queryKey: ChatQueryKeys.profile(),
                queryFn: () => chatApi.getMyProfile({errHandler}),
                retry: false,
            }),
            errHandler,
        }
    }

    export const useChatMembers = (
        chatId?: ChatModel.ChatID,
        query?: ChatMemberModel.Query,
    ) => {
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useQuery({
                queryKey: ChatQueryKeys.members(chatId || "", query),
                queryFn: () => chatApi.listMembers(chatId!, query, {errHandler}),
                enabled: !!chatId,
                initialData: Page_EMPTY as Paged<ChatMemberModel.ChatMember>,
            }),
            errHandler,
        }
    }

    export const useChatMessages = (
        chatId?: ChatModel.ChatID,
        query?: ChatMessageModel.Query,
    ) => {
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useQuery({
                queryKey: ChatQueryKeys.messages(chatId || "", query),
                queryFn: () => chatApi.sliceMessages(chatId!, query, {errHandler}),
                enabled: !!chatId,
                initialData: PageSlice_EMPTY as PageSlice<ChatMessageModel.ChatMessage>,
            }),
            errHandler,
        }
    }

    export function useInitiateChat(successHandler?: SuccessHandler<ChatModel.Detailed>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (body: ChatModel.Initiate) => chatApi.initiate(body, {errHandler}),
                onSuccess: async (data) => {
                    await queryClient.invalidateQueries({queryKey: ChatQueryKeys.root})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useCreateMyProfile(successHandler?: SuccessHandler<ChatProfileModel.ChatProfile>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: (body: ChatProfileModel.Create) => chatApi.createMyProfile(body, {errHandler}),
                onSuccess: async (data) => {
                    await queryClient.invalidateQueries({queryKey: ChatQueryKeys.profile()})
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useSendMessage(successHandler?: SuccessHandler<ChatMessageModel.ChatMessage>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({
                    chatId,
                    body,
                }: {
                    chatId: ChatModel.ChatID
                    body: ChatMessageModel.Send
                }) => chatApi.sendMessage(chatId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await invalidateChatAfterMessage(queryClient, variables.chatId)
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useSendFileMessage(successHandler?: SuccessHandler<ChatMessageModel.ChatMessage>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({
                    chatId,
                    content,
                    file,
                }: {
                    chatId: ChatModel.ChatID
                    content?: string | null
                    file: File
                }) => chatApi.sendFileMessage(chatId, {content, file}, {errHandler}),
                onSuccess: async (data, variables) => {
                    await invalidateChatAfterMessage(queryClient, variables.chatId)
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useUpdateMessage(successHandler?: SuccessHandler<ChatMessageModel.ChatMessage>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({
                    chatId,
                    messageId,
                    body,
                }: {
                    chatId: ChatModel.ChatID
                    messageId: ChatMessageModel.ChatMessageID
                    body: ChatMessageModel.Update
                }) => chatApi.updateMessage(chatId, messageId, body, {errHandler}),
                onSuccess: async (data, variables) => {
                    await invalidateChatAfterMessage(queryClient, variables.chatId)
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }

    export function useDeleteMessage(successHandler?: SuccessHandler<ChatMessageModel.ChatMessage>) {
        const queryClient = useQueryClient()
        const errHandler = useResponseFieldErrorHandler()

        return {
            ...useMutation({
                mutationFn: ({
                    chatId,
                    messageId,
                }: {
                    chatId: ChatModel.ChatID
                    messageId: ChatMessageModel.ChatMessageID
                }) => chatApi.deleteMessage(chatId, messageId, {errHandler}),
                onSuccess: async (data, variables) => {
                    await invalidateChatAfterMessage(queryClient, variables.chatId)
                    successHandler?.(data)
                },
            }),
            errHandler,
        }
    }
}

async function invalidateChatAfterMessage(
    queryClient: ReturnType<typeof useQueryClient>,
    chatId: ChatModel.ChatID,
) {
    await Promise.all([
        queryClient.invalidateQueries({queryKey: ChatQueryKeys.root}),
        queryClient.invalidateQueries({queryKey: ChatQueryKeys.detail(chatId)}),
        queryClient.invalidateQueries({queryKey: ChatQueryKeys.messagesRoot(chatId)}),
    ])
}

export {ChatQueryKeys}
