import {Navigate} from '@tanstack/react-router'

import {useAuthenticatedUser} from '#/lib/authenticated-user.store'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '#/components/ui/card'

import {BusinessAdminPage} from './BusinessAdminPage'
import {UserAdminPage} from './UserAdminPage'

export function AdminPage() {
    const {user, isHydrated} = useAuthenticatedUser()

    if (!isHydrated) {
        return (
            <main className="page-wrap px-4 py-10">
                <Card className="mx-auto max-w-xl shadow-sm">
                    <CardHeader>
                        <CardTitle>Loading admin workspace</CardTitle>
                        <CardDescription>
                            Resolving your authenticated session before selecting the correct admin view.
                        </CardDescription>
                    </CardHeader>
                    <CardContent/>
                </Card>
            </main>
        )
    }

    if (!user?.accessToken) {
        return <Navigate to="/login" search={{
            email: ""
        }}/>
    }

    if (user.orgID) {
        return <BusinessAdminPage orgID={user.orgID}/>
    }

    return <UserAdminPage/>
}
