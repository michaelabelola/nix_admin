import {Navigate} from '@tanstack/react-router'

import {useAuthenticatedUserStore} from '#/lib/authenticated-user.store'

import {BusinessAdminPage} from './BusinessAdminPage'
import {UserAdminPage} from './UserAdminPage'

export function AdminPage() {
    const user = useAuthenticatedUserStore((state) => state.user)
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
