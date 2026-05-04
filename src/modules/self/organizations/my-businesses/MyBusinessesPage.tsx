import {useMemo, useState} from "react"
import {toast} from "sonner"

import DataTable from "#/components/data-table/data-table.tsx"
import {loginApi} from "#/modules/auth/signin/api.tsx"
import orgApi from "#/modules/organization/apis/Org.api.ts"
import PermissionRequest from "#/modules/permissions/hooks/request.hook.ts"

import {createMyBusinessesColumns} from "./my-businesses.columns.tsx"
import {ProxyLoginConfirmDialog} from "./ProxyLoginConfirmDialog.tsx"
import type {PendingSignIn, PermissionRow} from "./my-businesses.types.ts"
import {useAuthenticatedUserStore} from "#/lib/authenticated-user.store.ts";
import Page from "#/components/Page.tsx";
import {ButtonGroup} from "#/components/ui/button-group.tsx";
import {Button} from "#/components/ui/button.tsx";
import {Link, useNavigate} from "@tanstack/react-router";

function createPendingSignIn(row: PermissionRow): PendingSignIn {
    return {
        request: {
            userId: row.actions[0],
            orgId: row.entityID,
        },
        businessName: row.__computed?.name || row.__computed?.shortName || "this organization",
    }
}

export function MyBusinessesPage() {
    const {setAuthenticatedUser} = useAuthenticatedUserStore()
    const [pendingSignIn, setPendingSignIn] = useState<PendingSignIn | null>(null)
    const [isSigningIn, setIsSigningIn] = useState(false)
    const navigate = useNavigate()
    const columns = useMemo(
        () =>
            createMyBusinessesColumns({
                onSignInRequest: (row) => setPendingSignIn(createPendingSignIn(row)),
            }),
        [],
    )

    const confirmSignInAs = async () => {
        if (!pendingSignIn || isSigningIn) return

        try {
            setIsSigningIn(true)
            const response = await loginApi.proxyLogin({
                query: pendingSignIn.request,
            })
            setAuthenticatedUser({...response, __options: {isProxy: true}})
            toast.success(`Signed in to ${pendingSignIn.businessName}.`)
            setPendingSignIn(null)
            setTimeout(() => {
                navigate({
                    to: "/admin"
                })
            },1700)
        } catch (error: any) {
            toast.error(error?.message || "Failed to sign in to organization.")
        } finally {
            setIsSigningIn(false)
        }
    }

    return (
        <Page header={{
            title: "My Organizations",
            description: "Review organizations linked to your admin workspace.",
            actionView: <ButtonGroup>
                <Link to={"/self/organizations/register"}>
                    <Button variant={"outline"} size={"sm"}>
                        Register Organization/Business
                    </Button>
                </Link>
            </ButtonGroup>
        }}>
            <DataTable
                columns={columns}
                from="/self/organizations"
                useQuery={PermissionRequest.useQueryProxyLoginAccesses}
                initialRequest={{
                    page: 0,
                    size: 10,
                }}
                searchPlaceholder="Search businesses..."
                emptyMessage="No organizations found."
                useRowQuery={(data) => orgApi.getById(data.entityID)}
            />

            <ProxyLoginConfirmDialog
                pendingSignIn={pendingSignIn}
                isSigningIn={isSigningIn}
                onClose={() => setPendingSignIn(null)}
                onConfirm={() => {
                    void confirmSignInAs()
                }}
            />
        </Page>
    )
}
