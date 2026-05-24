import {Outlet} from "@tanstack/react-router"

import {RegistrationPageShell} from "@suiteonix/components"

import {CustomerCreateProvider} from "./customer-create.context.tsx"

export function CustomerCreatePage() {
    return (
        <CustomerCreateProvider>
            <RegistrationPageShell>
                <Outlet/>
            </RegistrationPageShell>
        </CustomerCreateProvider>
    )
}
