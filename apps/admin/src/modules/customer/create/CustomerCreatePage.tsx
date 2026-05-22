import {Outlet} from "@tanstack/react-router"

import {RegistrationPageShell} from "#/components/registration/RegistrationLayouts.tsx"

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
