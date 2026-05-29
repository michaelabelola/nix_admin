import {useEffect, useMemo, useRef, useState} from "react"
import {FileText, MessageSquarePlus, MoreHorizontal, Paperclip, Pencil, Send, Trash2, Users} from "lucide-react"
import {toast} from "sonner"

import {Page} from "@suiteonix/components"
import {ChatMessageModel, ChatModel, ChatProfileModel, ChatRequest} from "@suiteonix/server"
import {useAuthenticatedUser} from "@suiteonix/server"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    Avatar,
    AvatarFallback,
    Badge,
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    Input,
    ScrollArea,
    Separator,
    Textarea,
} from "@suiteonix/ui"
import {cn} from "#/lib/utils.ts"

type ChatMessage = ChatMessageModel.ChatMessage

const CHAT_PAGE_SIZE = 24

function responseStatus(error: unknown) {
    return (error as {_internal?: {status?: number}} | null)?._internal?.status
}

function formatDateTime(value?: string | Date | null) {
    if (!value) return "No activity"
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "No activity"

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(date)
}

function formatFileSize(value?: number | null) {
    if (!value) return "0 KB"
    if (value < 1024 * 1024) return `${Math.max(1, Math.round(value / 1024))} KB`
    return `${(value / 1024 / 1024).toFixed(1)} MB`
}

function messageCreatedAt(message: ChatMessage) {
    return message.audit?.createdDate ? new Date(message.audit.createdDate).getTime() : 0
}

function canEditMessage(message: ChatMessage, senderID?: string | null) {
    if (!senderID || message.senderID !== senderID || message.deleted) return false
    const createdAt = messageCreatedAt(message)
    if (!createdAt) return false
    return Date.now() - createdAt < 5 * 60 * 1000
}

function mergeMessages(current: ChatMessage[], next: ChatMessage[]) {
    const messages = new Map<string, ChatMessage>()
    current.forEach((message) => messages.set(message.id, message))
    next.forEach((message) => messages.set(message.id, message))
    return Array.from(messages.values()).sort((a, b) => messageCreatedAt(a) - messageCreatedAt(b))
}

export function ChatPage() {
    const {user} = useAuthenticatedUser()
    const senderID = user?.userID
    const [selectedChatId, setSelectedChatId] = useState<ChatModel.ChatID | null>(null)
    const [messagePage, setMessagePage] = useState(0)
    const [loadedMessages, setLoadedMessages] = useState<ChatMessage[]>([])
    const [draft, setDraft] = useState("")
    const [fileCaption, setFileCaption] = useState("")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [editingMessageId, setEditingMessageId] = useState<ChatMessageModel.ChatMessageID | null>(null)
    const [editingContent, setEditingContent] = useState("")
    const [newTargetId, setNewTargetId] = useState("")
    const [newChatTitle, setNewChatTitle] = useState("")
    const [profileName, setProfileName] = useState("")
    const [profileDescription, setProfileDescription] = useState("")
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const profileQuery = ChatRequest.useGetMyProfile()
    const chatsQuery = ChatRequest.useQueryChats({
        page: 0,
        size: 30,
        sort: [{field: "lastMessageAt", direction: "DESC"}],
    })
    const membersQuery = ChatRequest.useChatMembers(selectedChatId || undefined, {page: 0, size: 30})
    const messagesQuery = ChatRequest.useChatMessages(selectedChatId || undefined, {
        page: messagePage,
        size: CHAT_PAGE_SIZE,
    })
    const createProfile = ChatRequest.useCreateMyProfile((profile) => {
        setProfileName("")
        setProfileDescription("")
        toast.success(`${profile.name || "Chat profile"} created.`)
    })
    const initiateChat = ChatRequest.useInitiateChat((chat) => {
        setSelectedChatId(chat.id)
        setNewTargetId("")
        setNewChatTitle("")
        toast.success("Chat started.")
    })
    const sendMessage = ChatRequest.useSendMessage(() => {
        setDraft("")
        setMessagePage(0)
        setLoadedMessages([])
    })
    const sendFile = ChatRequest.useSendFileMessage(() => {
        setSelectedFile(null)
        setFileCaption("")
        setMessagePage(0)
        setLoadedMessages([])
        if (fileInputRef.current) fileInputRef.current.value = ""
    })
    const updateMessage = ChatRequest.useUpdateMessage(() => {
        setEditingMessageId(null)
        setEditingContent("")
        setMessagePage(0)
        setLoadedMessages([])
    })
    const deleteMessage = ChatRequest.useDeleteMessage(() => {
        setMessagePage(0)
        setLoadedMessages([])
    })

    const chats = chatsQuery.data?.content ?? []
    const chatProfile = profileQuery.data ?? null
    const profileMissing = responseStatus(profileQuery.error) === 404
    const activeChat = useMemo(
        () => chats.find((chat) => chat.id === selectedChatId) ?? null,
        [chats, selectedChatId],
    )
    const sortedMessages = useMemo(
        () => [...loadedMessages].sort((a, b) => messageCreatedAt(a) - messageCreatedAt(b)),
        [loadedMessages],
    )

    useEffect(() => {
        if (!selectedChatId && chats.length > 0) setSelectedChatId(chats[0].id)
    }, [chats, selectedChatId])

    useEffect(() => {
        setMessagePage(0)
        setLoadedMessages([])
        setEditingMessageId(null)
        setEditingContent("")
    }, [selectedChatId])

    useEffect(() => {
        const content = messagesQuery.data?.content ?? []
        setLoadedMessages((current) => (messagePage === 0 ? mergeMessages([], content) : mergeMessages(current, content)))
    }, [messagesQuery.data, messagePage])

    const handleStartChat = () => {
        if (!chatProfile) {
            toast.error("Create your chat profile before starting a chat.")
            return
        }
        if (!newTargetId.trim()) {
            toast.error("Target NixID is required.")
            return
        }
        initiateChat.mutate({
            targetId: newTargetId.trim(),
            title: newChatTitle.trim() || null,
            purpose: ChatModel.ChatPurpose.BUSINESS,
        })
    }

    const handleCreateProfile = () => {
        if (!profileName.trim()) {
            toast.error("Profile name is required.")
            return
        }
        createProfile.mutate({
            name: profileName.trim(),
            description: profileDescription.trim() || null,
            status: ChatProfileModel.Status.ACTIVE,
        })
    }

    const handleSendText = () => {
        if (!selectedChatId || !draft.trim()) return
        sendMessage.mutate({
            chatId: selectedChatId,
            body: {
                content: draft.trim(),
                messageType: ChatMessageModel.MessageType.TEXT,
            },
        })
    }

    const handleSendFile = () => {
        if (!selectedChatId || !selectedFile) return
        sendFile.mutate({
            chatId: selectedChatId,
            file: selectedFile,
            content: fileCaption.trim() || null,
        })
    }

    const handleUpdateMessage = (message: ChatMessage) => {
        if (!selectedChatId || !editingContent.trim()) return
        updateMessage.mutate({
            chatId: selectedChatId,
            messageId: message.id,
            body: {content: editingContent.trim()},
        })
    }

    return (
        <Page
            fixed
            clearPadding
            header={{
                paddingX:"px-4",
                title: "Chats",
                description: "Active conversations, members, messages, and file exchanges.",
                actionView: (
                    <Badge variant="secondary">
                        {chats.length} active
                    </Badge>
                ),
            }}
            isFetching={profileQuery.isFetching || chatsQuery.isFetching || messagesQuery.isFetching}
            className="min-h-0"
        >
            <div className="grid h-[calc(100dvh-5.5rem)] min-h-0 grid-cols-1 border-t bg-background/95 lg:grid-cols-[18rem_minmax(0,1fr)_20rem]">
                <aside className="min-h-0 border-r">
                    <div className="flex h-14 items-center justify-between border-b px-4">
                        <div className="text-sm font-medium">Active chats</div>
                        <Badge variant="outline">{chats.length}</Badge>
                    </div>
                    <ScrollArea className="h-[calc(100%-3.5rem)]">
                        <div className="grid gap-1 p-2">
                            {chats.map((chat) => (
                                <button
                                    key={chat.id}
                                    type="button"
                                    onClick={() => setSelectedChatId(chat.id)}
                                    className={cn(
                                        "grid w-full gap-1 rounded-md border px-3 py-2 text-left transition-colors hover:bg-muted",
                                        selectedChatId === chat.id ? "border-primary bg-primary/10" : "bg-background",
                                    )}
                                >
                                    <div className="flex min-w-0 items-center justify-between gap-2">
                                        <span className="truncate text-sm font-medium">
                                            {chat.title || `Chat ${chat.id}`}
                                        </span>
                                        <Badge variant="outline">{chat.purpose || "CHAT"}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                                        <span>{chat.participantCount ?? 0} members</span>
                                        <span>{formatDateTime(chat.lastMessageAt)}</span>
                                    </div>
                                </button>
                            ))}
                            {chats.length === 0 ? (
                                <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                                    No chats found.
                                </div>
                            ) : null}
                        </div>
                    </ScrollArea>
                </aside>

                <section className="flex min-h-0 flex-col">
                    <div className="flex h-14 items-center justify-between border-b px-4">
                        <div className="min-w-0">
                            <div className="truncate text-sm font-semibold">
                                {activeChat?.title || "Select a chat"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {activeChat ? `${activeChat.participantCount ?? 0} members` : "No chat selected"}
                            </div>
                        </div>
                        {activeChat ? <Badge variant="secondary">{activeChat.purpose}</Badge> : null}
                    </div>

                    <ScrollArea className="min-h-0 flex-1">
                        <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 p-4">
                            {messagesQuery.data?.hasNext ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mx-auto"
                                    onClick={() => setMessagePage((page) => page + 1)}
                                >
                                    Load older
                                </Button>
                            ) : null}

                            {sortedMessages.map((message) => (
                                <MessageBubble
                                    key={message.id}
                                    message={message}
                                    isOwn={message.senderID === senderID}
                                    canEdit={canEditMessage(message, senderID)}
                                    editing={editingMessageId === message.id}
                                    editingContent={editingContent}
                                    onEditStart={() => {
                                        setEditingMessageId(message.id)
                                        setEditingContent(message.content || "")
                                    }}
                                    onEditCancel={() => {
                                        setEditingMessageId(null)
                                        setEditingContent("")
                                    }}
                                    onEditingContentChange={setEditingContent}
                                    onEditSave={() => handleUpdateMessage(message)}
                                    onDelete={() => {
                                        if (!selectedChatId) return
                                        deleteMessage.mutate({chatId: selectedChatId, messageId: message.id})
                                    }}
                                />
                            ))}

                            {activeChat && sortedMessages.length === 0 ? (
                                <div className="mx-auto mt-20 grid max-w-sm place-items-center gap-3 text-center text-sm text-muted-foreground">
                                    <MessageSquarePlus className="size-8"/>
                                    <span>No messages yet.</span>
                                </div>
                            ) : null}
                        </div>
                    </ScrollArea>

                    <div className="border-t bg-background p-3">
                        <div className="mx-auto grid max-w-4xl gap-2">
                            <Textarea
                                value={draft}
                                onChange={(event) => setDraft(event.target.value)}
                                disabled={!selectedChatId || sendMessage.isPending}
                                className="min-h-20 resize-none"
                                placeholder="Message"
                            />
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex min-w-0 flex-wrap items-center gap-2">
                                    <input
                                        ref={fileInputRef}
                                        id="chat-file"
                                        type="file"
                                        className="hidden"
                                        onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                                    />
                                    <Button variant="outline" size="sm" asChild disabled={!selectedChatId}>
                                        <label htmlFor="chat-file" className="cursor-pointer">
                                            <Paperclip className="size-4"/>
                                            File
                                        </label>
                                    </Button>
                                    {selectedFile ? (
                                        <>
                                            <Input
                                                value={fileCaption}
                                                onChange={(event) => setFileCaption(event.target.value)}
                                                placeholder="File caption"
                                                className="h-9 w-56"
                                            />
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                disabled={sendFile.isPending}
                                                onClick={handleSendFile}
                                            >
                                                <FileText className="size-4"/>
                                                Send file
                                            </Button>
                                            <span className="max-w-52 truncate text-xs text-muted-foreground">
                                                {selectedFile.name}
                                            </span>
                                        </>
                                    ) : null}
                                </div>
                                <Button disabled={!selectedChatId || !draft.trim() || sendMessage.isPending} onClick={handleSendText}>
                                    <Send className="size-4"/>
                                    Send
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                <aside className="min-h-0 border-l">
                    <div className="flex h-14 items-center gap-2 border-b px-4">
                        <Users className="size-4"/>
                        <span className="text-sm font-medium">Members</span>
                    </div>
                    <ScrollArea className="h-[calc(100%-3.5rem)]">
                        <div className="grid gap-4 p-4">
                            {chatProfile ? (
                                <div className="grid gap-3 rounded-md border p-3">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <Avatar className="size-9 rounded-md">
                                            <AvatarFallback>{(chatProfile.name || "?").slice(0, 1).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <div className="truncate text-sm font-medium">{chatProfile.name}</div>
                                            <div className="truncate text-xs text-muted-foreground">{chatProfile.proxyID}</div>
                                        </div>
                                        <Badge variant="outline">{chatProfile.status || "ACTIVE"}</Badge>
                                    </div>
                                    {chatProfile.description ? (
                                        <p className="text-xs leading-5 text-muted-foreground">{chatProfile.description}</p>
                                    ) : null}
                                </div>
                            ) : profileMissing ? (
                                <div className="grid gap-2 rounded-md border p-3">
                                    <div className="text-sm font-medium">Create chat profile</div>
                                    <Input
                                        value={profileName}
                                        onChange={(event) => setProfileName(event.target.value)}
                                        placeholder="Display name"
                                    />
                                    <Textarea
                                        value={profileDescription}
                                        onChange={(event) => setProfileDescription(event.target.value)}
                                        placeholder="Description"
                                        className="min-h-20 resize-none"
                                    />
                                    <Button disabled={!profileName.trim() || createProfile.isPending} onClick={handleCreateProfile}>
                                        Create profile
                                    </Button>
                                </div>
                            ) : profileQuery.isError ? (
                                <div className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
                                    Chat profile unavailable.
                                </div>
                            ) : null}

                            <div className="grid gap-2 rounded-md border p-3">
                                <div className="text-sm font-medium">New chat</div>
                                <Input
                                    value={newTargetId}
                                    onChange={(event) => setNewTargetId(event.target.value)}
                                    placeholder="Target participant NixID"
                                />
                                <Input
                                    value={newChatTitle}
                                    onChange={(event) => setNewChatTitle(event.target.value)}
                                    placeholder="Title"
                                />
                                <Button disabled={!chatProfile || !newTargetId.trim() || initiateChat.isPending} onClick={handleStartChat}>
                                    <MessageSquarePlus className="size-4"/>
                                    Start
                                </Button>
                            </div>

                            <Separator/>

                            <div className="grid gap-2">
                                {(membersQuery.data?.content ?? []).map((member) => (
                                    <div key={member.id} className="flex min-w-0 items-center gap-3 rounded-md border p-2">
                                        <Avatar className="size-8 rounded-md">
                                            <AvatarFallback>{(member.name || "?").slice(0, 1).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <div className="truncate text-sm font-medium">{member.name || member.proxyID}</div>
                                            <div className="truncate text-xs text-muted-foreground">{member.proxyID}</div>
                                        </div>
                                        <Badge variant="outline">{member.role || "MEMBER"}</Badge>
                                    </div>
                                ))}
                                {selectedChatId && membersQuery.data?.content.length === 0 ? (
                                    <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                                        No members found.
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </ScrollArea>
                </aside>
            </div>
        </Page>
    )
}

function MessageBubble({
    message,
    isOwn,
    canEdit,
    editing,
    editingContent,
    onEditStart,
    onEditCancel,
    onEditingContentChange,
    onEditSave,
    onDelete,
}: {
    message: ChatMessage
    isOwn: boolean
    canEdit: boolean
    editing: boolean
    editingContent: string
    onEditStart: () => void
    onEditCancel: () => void
    onEditingContentChange: (value: string) => void
    onEditSave: () => void
    onDelete: () => void
}) {
    return (
        <div className={cn("flex w-full", isOwn ? "justify-end" : "justify-start")}>
            <div
                className={cn(
                    "group grid max-w-[min(38rem,88%)] gap-2 rounded-md border px-3 py-2 shadow-sm",
                    isOwn ? "bg-primary text-primary-foreground" : "bg-card",
                    message.deleted ? "border-dashed opacity-70" : "",
                )}
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 text-xs opacity-80">
                        <span className="font-medium">{isOwn ? "You" : message.senderID}</span>
                        <span className="mx-1">·</span>
                        <span>{formatDateTime(message.audit?.createdDate)}</span>
                        {message.edited ? <span className="ml-1">(edited)</span> : null}
                    </div>
                    {isOwn && !message.deleted ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant={isOwn ? "secondary" : "ghost"} size="icon" className="size-7 shrink-0">
                                    <MoreHorizontal className="size-4"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem disabled={!canEdit} onClick={onEditStart}>
                                    <Pencil className="size-4"/>
                                    Edit
                                </DropdownMenuItem>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem
                                            variant="destructive"
                                            onSelect={(event) => event.preventDefault()}
                                        >
                                            <Trash2 className="size-4"/>
                                            Delete
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete message?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This removes the message content and keeps the audit record.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : null}
                </div>

                {editing ? (
                    <div className="grid gap-2">
                        <Textarea
                            value={editingContent}
                            onChange={(event) => onEditingContentChange(event.target.value)}
                            className="min-h-20 bg-background text-foreground"
                        />
                        <div className="flex justify-end gap-2">
                            <Button variant="secondary" size="sm" onClick={onEditCancel}>Cancel</Button>
                            <Button size="sm" onClick={onEditSave}>Save</Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="whitespace-pre-wrap break-words text-sm leading-6">
                            {message.deleted ? "Message deleted" : message.content}
                        </p>
                        {message.file && !message.deleted ? (
                            <a
                                href={message.file}
                                target="_blank"
                                rel="noreferrer"
                                className={cn(
                                    "flex items-center gap-2 rounded-md border px-3 py-2 text-sm underline-offset-4 hover:underline",
                                    isOwn ? "border-primary-foreground/30" : "border-border",
                                )}
                            >
                                <FileText className="size-4"/>
                                <span className="min-w-0 flex-1 truncate">{message.fileName || "Attachment"}</span>
                                <span className="text-xs opacity-75">{formatFileSize(message.fileSize)}</span>
                            </a>
                        ) : null}
                    </>
                )}
            </div>
        </div>
    )
}
