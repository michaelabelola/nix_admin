import type {AuditSection, NixFile, NixID, PageRequest} from "@suiteonix/models"
import {NixRole} from "@suiteonix/models"

export namespace ChatModel {
    export type ChatID = string

    export enum ChatPurpose {
        CASUAL = "CASUAL",
        BUSINESS = "BUSINESS",
        PRIVATE = "PRIVATE",
    }

    export type Chat = {
        id: ChatID
        title: string | null
        description: string | null
        purpose: ChatPurpose | null
        lastMessageAt: string | null
        participantCount: number | null
        unreadCount: number | null
        entityID: NixID
    }

    export type Detailed = Chat & {
        members: ChatMemberModel.ChatMember[]
        audit?: AuditSection | null
    }

    export type Initiate = {
        targetId: NixID
        purpose?: ChatPurpose | null
        title?: string | null
        description?: string | null
    }

    export type Query = PageRequest & Partial<{
        query: string
        id: ChatID
        purpose: ChatPurpose
        participantID: NixID
    }>
}

export namespace ChatProfileModel {
    export type ChatProfileID = string

    export enum Status {
        ACTIVE = "ACTIVE",
        INACTIVE = "INACTIVE",
        SUSPENDED = "SUSPENDED",
        DELETED = "DELETED",
    }

    export type ChatProfile = {
        id: ChatProfileID
        name: string | null
        description: string | null
        status: Status | null
        role: NixRole | null
        proxyID: NixID
        isActive: boolean | null
        lastActiveAt: string | null
        lastReadAt: string | null
        entityID: NixID
        audit?: AuditSection | null
    }

    export type Create = {
        name: string
        description?: string | null
        status?: Status | null
    }
}

export namespace ChatMemberModel {
    export type ChatMemberID = string

    export enum Role {
        ADMIN = "ADMIN",
        MEMBER = "MEMBER",
        GUEST = "GUEST",
    }

    export type ChatMember = {
        id: ChatMemberID
        chatId: ChatModel.ChatID
        profileId: ChatProfileModel.ChatProfileID
        name: string | null
        description: string | null
        status: ChatProfileModel.Status | null
        role: Role | null
        proxyID: NixID
        isActive: boolean | null
        lastActiveAt: string | null
        lastReadAt: string | null
        entityID: NixID
        audit?: AuditSection | null
    }

    export type Query = PageRequest & Partial<{
        query: string
        status: ChatProfileModel.Status
        role: Role
        proxyID: NixID
    }>
}

export namespace ChatMessageModel {
    export type ChatMessageID = string

    export enum MessageType {
        TEXT = "TEXT",
        IMAGE = "IMAGE",
        FILE = "FILE",
        SYSTEM = "SYSTEM",
    }

    export enum MessageStatus {
        SENT = "SENT",
        DELIVERED = "DELIVERED",
        READ = "READ",
        FAILED = "FAILED",
        DELETED = "DELETED",
    }

    export type ChatMessage = {
        id: ChatMessageID
        chatId: ChatModel.ChatID
        senderID: NixID
        content: string | null
        messageType: MessageType | null
        status: MessageStatus | null
        file: NixFile.NixFile | null
        fileName: string | null
        fileContentType: string | null
        fileSize: number | null
        edited: boolean | null
        editedAt: string | null
        deleted: boolean | null
        deletedAt: string | null
        entityID: NixID
        audit?: AuditSection | null
    }

    export type Send = {
        content: string
        messageType?: MessageType | null
    }

    export type Update = {
        content: string
    }

    export type Query = PageRequest
}
