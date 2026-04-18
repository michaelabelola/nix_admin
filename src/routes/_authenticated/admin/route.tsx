import {createFileRoute, Link, Outlet} from '@tanstack/react-router'
import {useAuthenticatedUser} from "#/lib/authenticated-user.store.ts";
import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "#/components/ui/card.tsx";
import {Spinner} from "#/components/ui/spinner.tsx";
import {Button} from "#/components/ui/button.tsx";
import {IconCancel} from "@tabler/icons-react";

export const Route = createFileRoute('/_authenticated/admin')({
    component: AdminPage,
    head: () => ({
        meta: [
            {
                title: 'Admin | Suiteonix',
            }
        ],
    }),
})

function AdminPage() {

    const {user, isHydrated} = useAuthenticatedUser()

    if (!isHydrated) {
        return (
            <main className="px-4 py-10 min-h-screen flex w-full items-center bg-background/70">
                <Card className="mx-auto max-w-xl shadow-sm h-fit w-12/12 md:w-5/12">
                    <CardHeader>
                        <CardTitle
                            className={"flex flex-col-reverse items-center gap-4 md:gap-0 md:justify-between md:flex-row"}>
                            Loading admin workspace
                            <div className={"text-xl"}><Spinner className={"size-6 md:size-4"}/></div>
                        </CardTitle>
                        <CardDescription className={"text-center md:text-left"}>
                            Resolving your authenticated session.
                        </CardDescription>
                    </CardHeader>
                    {/*<CardContent/>*/}
                </Card>
            </main>
        )
    }

    if (!user?.orgID) {
        return (
            <main className="px-4 py-10 min-h-screen flex w-full items-center bg-background/70">
                <Card className="mx-auto max-w-xl shadow-sm h-fit w-12/12 md:w-5/12">
                    <CardHeader>
                        <CardTitle
                            className={"flex flex-col-reverse items-center gap-4 md:gap-0 md:justify-between md:flex-row"}>
                            You are not signed in to an org
                            <div className={"text-xl"}><IconCancel className={"size-6 md:size-4 text-destructive"}/></div>
                        </CardTitle>
                        <CardDescription className={"text-center md:text-left"}>
                            Try Signing in to an organization first.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Link to={"/self/organizations"}>
                            <Button variant={"default"}>
                                Go to My Businesses
                            </Button>
                        </Link>
                    </CardFooter>
                    {/*<CardContent/>*/}
                </Card>
            </main>
        )
    }
    return <Outlet/>
}
