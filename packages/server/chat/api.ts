import type {PageSlice, Paged} from "@suiteonix/models"
import {Backend, type RequestHelperInit} from "../utils"
import type {ChatMemberModel, ChatMessageModel, ChatModel, ChatProfileModel} from "./model.ts"

class ChatApi {
    list(params?: ChatModel.Query, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<Paged<ChatModel.Chat>>("/chats", {
            query: params,
            ...init,
        })
    }

    get(chatId: ChatModel.ChatID, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ChatModel.Detailed>(`/chats/${chatId}`, init)
    }

    initiate(body: ChatModel.Initiate, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ChatModel.Detailed>("/chats/initiate", {
            method: "POST",
            body,
            ...init,
        })
    }

    getMyProfile(init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ChatProfileModel.ChatProfile>("/chats/profile/me", init)
    }

    createMyProfile(body: ChatProfileModel.Create, init?: Partial<RequestHelperInit>) {
        return Backend.authRequest<ChatProfileModel.ChatProfile>("/chats/profile/me", {
            method: "POST",
            body,
            ...init,
        })
    }

    listMembers(
        chatId: ChatModel.ChatID,
        params?: ChatMemberModel.Query,
        init?: Partial<RequestHelperInit>,
    ) {
        return Backend.authRequest<Paged<ChatMemberModel.ChatMember>>(`/chats/${chatId}/members`, {
            query: params,
            ...init,
        })
    }

    sliceMessages(
        chatId: ChatModel.ChatID,
        params?: ChatMessageModel.Query,
        init?: Partial<RequestHelperInit>,
    ) {
        return Backend.authRequest<PageSlice<ChatMessageModel.ChatMessage>>(
            `/chats/${chatId}/messages/slice`,
            {
                query: params,
                ...init,
            },
        )
    }

    sendMessage(
        chatId: ChatModel.ChatID,
        body: ChatMessageModel.Send,
        init?: Partial<RequestHelperInit>,
    ) {
        return Backend.authRequest<ChatMessageModel.ChatMessage>(`/chats/${chatId}/messages`, {
            method: "POST",
            body,
            ...init,
        })
    }

    sendFileMessage(
        chatId: ChatModel.ChatID,
        body: {content?: string | null; file: File},
        init?: Partial<RequestHelperInit>,
    ) {
        const formData = new FormData()
        if (body.content) formData.append("content", body.content)
        formData.append("file", body.file)

        return Backend.authRequest<ChatMessageModel.ChatMessage>(`/chats/${chatId}/messages/file`, {
            method: "POST",
            body: formData,
            contentType: "omit",
            ...init,
        })
    }

    updateMessage(
        chatId: ChatModel.ChatID,
        messageId: ChatMessageModel.ChatMessageID,
        body: ChatMessageModel.Update,
        init?: Partial<RequestHelperInit>,
    ) {
        return Backend.authRequest<ChatMessageModel.ChatMessage>(
            `/chats/${chatId}/messages/${messageId}`,
            {
                method: "PATCH",
                body,
                ...init,
            },
        )
    }

    deleteMessage(
        chatId: ChatModel.ChatID,
        messageId: ChatMessageModel.ChatMessageID,
        init?: Partial<RequestHelperInit>,
    ) {
        return Backend.authRequest<ChatMessageModel.ChatMessage>(
            `/chats/${chatId}/messages/${messageId}`,
            {
                method: "DELETE",
                ...init,
            },
        )
    }
}

const chatApi = new ChatApi()
export default chatApi
