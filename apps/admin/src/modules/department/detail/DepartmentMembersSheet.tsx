import {useMemo, useState, type FormEvent} from "react"
import {Shield, Trash2, UserPlus} from "lucide-react"
import {toast} from "sonner"

import {Alert, AlertDescription, AlertTitle} from "@suiteonix/ui"
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
} from "@suiteonix/ui"
import {Badge} from "@suiteonix/ui"
import {Button} from "@suiteonix/ui"
import {Input} from "@suiteonix/ui"
import {Label} from "@suiteonix/ui"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@suiteonix/ui"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@suiteonix/ui"
import {Skeleton} from "@suiteonix/ui"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@suiteonix/ui"
import {DepartmentModel, DepartmentRequest, DeptMemberModel} from "@suiteonix/server"
import UserCell from "#/modules/user/components/UserCell.tsx"

export function DepartmentMembersSheet({
    open,
    onOpenChange,
    department,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    department?: DepartmentModel.Department | DepartmentModel.Detailed | null
}) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-4xl">
                <SheetHeader>
                    <SheetTitle>Department Members</SheetTitle>
                    <SheetDescription>
                        {department?.name ? `${department.name} members and department roles.` : "Manage department members and roles."}
                    </SheetDescription>
                </SheetHeader>

                <div className="px-4 pb-4">
                    <DepartmentMembersPanel department={department}/>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export function DepartmentMembersPanel({
    department,
}: {
    department?: DepartmentModel.Department | DepartmentModel.Detailed | null
}) {
    const [userId, setUserId] = useState("")
    const [role, setRole] = useState<DeptMemberModel.Role>(DeptMemberModel.Role.MEMBER)
    const membersQuery = useMemo<DeptMemberModel.Query>(
        () => ({
            page: 0,
            size: 50,
            sort: [{field: "audit.createdDate", direction: "DESC"}],
        }),
        [],
    )
    const members = DepartmentRequest.useQueryDepartmentMembers(department?.id, membersQuery)
    const addMember = DepartmentRequest.useAddDepartmentMember(() => {
        toast.success("Department member added.")
        setUserId("")
        setRole(DeptMemberModel.Role.MEMBER)
    })
    const updateRole = DepartmentRequest.useUpdateDepartmentMemberRole(() => {
        toast.success("Department member role updated.")
    })
    const removeMember = DepartmentRequest.useRemoveDepartmentMember(() => {
        toast.success("Department member removed.")
    })

    async function submitMember(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!department?.id) return
        const nextUserId = userId.trim()
        if (!nextUserId) return

        await addMember.mutateAsync({
            departmentId: department.id,
            body: {
                userId: nextUserId,
                role,
            },
        })
    }

    async function changeRole(member: DeptMemberModel.DeptMember, nextRole: DeptMemberModel.Role) {
        if (!department?.id || member.role === nextRole) return
        await updateRole.mutateAsync({
            departmentId: department.id,
            memberId: member.id,
            body: {role: nextRole},
        })
    }

    async function deleteMember(memberId: DeptMemberModel.DeptMemberID) {
        if (!department?.id) return
        await removeMember.mutateAsync({
            departmentId: department.id,
            memberId,
        })
    }

    return (
        <div className="grid gap-6">
                    <form className="grid gap-3 rounded-md p-4" onSubmit={(event) => void submitMember(event)}>
                        <div className="grid gap-3 md:grid-cols-[1fr_180px_auto] md:items-end">
                            <div className="grid gap-2">
                                <Label htmlFor="department-member-user-id">User ID</Label>
                                <Input
                                    id="department-member-user-id"
                                    value={userId}
                                    placeholder="Paste user ID"
                                    onChange={(event) => setUserId(event.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="department-member-role">Role</Label>
                                <Select
                                    value={role}
                                    onValueChange={(value) => setRole(value as DeptMemberModel.Role)}
                                >
                                    <SelectTrigger id="department-member-role" className="w-full">
                                        <SelectValue placeholder="Select role"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(DeptMemberModel.Role).map((item) => (
                                            <SelectItem key={item} value={item}>
                                                {item}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" disabled={!userId.trim() || addMember.isPending}>
                                <UserPlus className="size-4"/>
                                Add member
                            </Button>
                        </div>

                        {addMember.error?.message ? (
                            <Alert variant="destructive">
                                <AlertTitle>Unable to add member</AlertTitle>
                                <AlertDescription>{addMember.error.message}</AlertDescription>
                            </Alert>
                        ) : null}
                    </form>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Member ID</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {members.isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            <Skeleton className="h-10 w-full"/>
                                        </TableCell>
                                    </TableRow>
                                ) : null}

                                {!members.isLoading && members.data.content.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                            No department members found.
                                        </TableCell>
                                    </TableRow>
                                ) : null}

                                {members.data.content.map((member) => (
                                    <TableRow key={member.id}>
                                        <TableCell>
                                            <UserCell.CellWithPopover id={member.userId}/>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={member.role === DeptMemberModel.Role.HEAD ? "default" : "outline"}>
                                                    <Shield className="size-3"/>
                                                    {member.role || "MEMBER"}
                                                </Badge>
                                                <Select
                                                    value={member.role ?? DeptMemberModel.Role.MEMBER}
                                                    disabled={updateRole.isPending}
                                                    onValueChange={(value) =>
                                                        void changeRole(member, value as DeptMemberModel.Role)
                                                    }
                                                >
                                                    <SelectTrigger className="h-8 w-36">
                                                        <SelectValue placeholder="Role"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.values(DeptMemberModel.Role).map((item) => (
                                                            <SelectItem key={item} value={item}>
                                                                {item}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-muted-foreground">
                                            {member.id}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon-sm">
                                                        <Trash2 className="size-4"/>
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent size="sm">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Remove member?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This removes the user from the department.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel disabled={removeMember.isPending}>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            variant="destructive"
                                                            disabled={removeMember.isPending}
                                                            onClick={() => void deleteMember(member.id)}
                                                        >
                                                            Remove
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {members.error?.message || updateRole.error?.message || removeMember.error?.message ? (
                        <Alert variant="destructive">
                            <AlertTitle>Unable to update members</AlertTitle>
                            <AlertDescription>
                                {members.error?.message || updateRole.error?.message || removeMember.error?.message}
                            </AlertDescription>
                        </Alert>
                    ) : null}
        </div>
    )
}
