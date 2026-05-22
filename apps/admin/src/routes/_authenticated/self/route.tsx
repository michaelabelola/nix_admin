import {createFileRoute} from '@tanstack/react-router'
import {UserAdminPage} from "#/modules/self/UserAdminPage.tsx";

export const Route = createFileRoute('/_authenticated/self')({
    component: UserAdminPage,
})

// export function SelfAdminPage() {
//     return <UserAdminPage/>
// }
