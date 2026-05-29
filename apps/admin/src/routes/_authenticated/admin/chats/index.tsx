import {createFileRoute} from "@tanstack/react-router"

import {ChatPage} from "#/modules/chat/ChatPage.tsx"

export const Route = createFileRoute("/_authenticated/admin/chats/")({
    component: RouteComponent,
})

function RouteComponent() {
    return <ChatPage/>
}
