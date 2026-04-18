import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "#/components/ui/card.tsx";
import type {NotFoundRouteProps} from "@tanstack/router-core";

function Page404(props:{message?:string} & Partial<NotFoundRouteProps>) {
    return (
        <main className="flex min-h-screen items-center justify-center px-4 py-10">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle>404: Not Found</CardTitle>
                    <CardDescription>
                        The page you requested could not be found.
                    </CardDescription>
                </CardHeader>
                <CardContent>{props.message || "Page Not Found"}</CardContent>
                    <CardFooter className="mt-4 text-sm text-muted-foreground">
                        {props.routeId}
                    </CardFooter>
            </Card>
        </main>
    );
}

export default Page404;
