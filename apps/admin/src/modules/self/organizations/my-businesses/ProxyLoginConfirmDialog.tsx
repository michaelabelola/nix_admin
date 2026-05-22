import {Avatar, AvatarFallback, AvatarImage} from "#/components/ui/avatar.tsx"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "#/components/ui/alert-dialog.tsx"
import {Skeleton} from "#/components/ui/skeleton.tsx"
import {UserRequest} from "#/modules/user/api.hook.tsx"

import type {PendingSignIn} from "./my-businesses.types.ts"
import {useState} from "react";

function getInitials(name?: string) {
    if (!name) return "U"
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
}

export function ProxyLoginConfirmDialog({
                                            pendingSignIn,
                                            isSigningIn,
                                            onConfirm,
                                            onClose,
                                        }: {
    pendingSignIn: PendingSignIn | null
    isSigningIn: boolean
    onConfirm: () => void
    onClose: () => void
}) {
    const userId = pendingSignIn?.request?.userId
    if (!userId)
        return null
    const {data: user, isLoading, error} = UserRequest.useGetUser(userId as any)

    const [displayName] = useState<string | null>(!error ? `${user?.firstname ?? ""} ${user?.lastname ?? ""}`.trim() || userId || "this user" : "")

    return (
        <AlertDialog
            open={pendingSignIn !== null}
            onOpenChange={(open) => {
                if (!open && !isSigningIn) onClose()
            }}
        >
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogTitle>Sign in as organization user?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You are about to switch into <strong>{pendingSignIn?.businessName}</strong>.
                        Your current session will be switched.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="rounded-md border bg-muted/30 p-3">
                    {isLoading ? (
                        <div className="flex items-center gap-3">
                            <Skeleton className="size-12 rounded-xl"/>
                            <div className="grid flex-1 gap-2">
                                <Skeleton className="h-4 w-32"/>
                                <Skeleton className="h-3 w-44"/>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Avatar className="size-12 rounded-xl border">
                                <AvatarImage src={user?.avatar} alt={`${displayName}'s avatar`}
                                             className="object-cover"/>
                                <AvatarFallback className="rounded-xl">
                                    {getInitials(displayName as any)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium">{displayName}</p>
                                <p className="truncate text-xs text-muted-foreground">
                                    User ID: {userId}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isSigningIn}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(event) => {
                            event.preventDefault()
                            onConfirm()
                        }}
                        disabled={isSigningIn}
                    >
                        {isSigningIn ? "Signing in..." : "Continue"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
