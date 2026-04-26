import {Outlet} from "@tanstack/react-router"

import Page from "#/components/Page.tsx"

import {CustomerCreateProvider} from "./customer-create.context.tsx"

export function CustomerCreatePage() {
    return (
        <CustomerCreateProvider>
            <Page
                header={{
                    title: "Create Customer",
                    description: "Complete each step using its own URL. All customer data is submitted to the backend once from the final review step.",
                }}
            >
                <Outlet/>
            </Page>
        </CustomerCreateProvider>
    )
}
