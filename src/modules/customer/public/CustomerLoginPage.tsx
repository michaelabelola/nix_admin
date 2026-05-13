import {useState} from "react"
import {Link} from "@tanstack/react-router"
import {ArrowLeft, LockKeyhole, Mail, ShieldCheck} from "lucide-react"
import {toast} from "sonner"

import {Alert, AlertDescription, AlertTitle} from "#/components/ui/alert.tsx"
import {Badge} from "#/components/ui/badge.tsx"
import {Button} from "#/components/ui/button.tsx"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "#/components/ui/card.tsx"
import {Input} from "#/components/ui/input.tsx"
import {Label} from "#/components/ui/label.tsx"

export function CustomerLoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return (
        <main className="min-h-screen bg-muted/30">
            <section className="mx-auto grid min-h-screen max-w-7xl gap-10 px-4 py-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                <div className="grid gap-6">
                    <Button asChild variant="ghost" className="w-fit">
                        <Link to="/customer">
                            <ArrowLeft className="size-4"/>
                            Customer home
                        </Link>
                    </Button>

                    <Badge variant="outline" className="w-fit">Customer Login</Badge>
                    <div className="grid gap-4">
                        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                            Access your customer portal.
                        </h1>
                        <p className="max-w-xl text-base leading-8 text-muted-foreground">
                            Customer login will connect to the dedicated backend endpoint once it is available. The page is ready for the API integration layer.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                        <Feature icon={Mail} title="Email access"/>
                        <Feature icon={LockKeyhole} title="Password sign in"/>
                        <Feature icon={ShieldCheck} title="Verified accounts"/>
                    </div>
                </div>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Customer login</CardTitle>
                        <CardDescription>
                            Enter the email and password used during customer registration.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            className="grid gap-5"
                            onSubmit={(event) => {
                                event.preventDefault()
                                toast.info("Customer login backend endpoint is not available yet.")
                            }}
                        >
                            <Alert>
                                <ShieldCheck className="size-4"/>
                                <AlertTitle>Endpoint pending</AlertTitle>
                                <AlertDescription>
                                    The backend customer login endpoint will be connected here when it is created.
                                </AlertDescription>
                            </Alert>

                            <div className="grid gap-2">
                                <Label htmlFor="customer-email">Email</Label>
                                <Input
                                    id="customer-email"
                                    type="email"
                                    value={email}
                                    placeholder="you@example.com"
                                    onChange={(event) => setEmail(event.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="customer-password">Password</Label>
                                <Input
                                    id="customer-password"
                                    type="password"
                                    value={password}
                                    placeholder="Enter your password"
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                            </div>

                            <Button type="submit" disabled={!email.trim() || !password}>
                                Login
                            </Button>

                            <div className="text-center text-sm text-muted-foreground">
                                Need an account?{" "}
                                <Link to="/customer/register" className="font-medium text-primary hover:underline">
                                    Register as a customer
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </section>
        </main>
    )
}

function Feature({icon: Icon, title}: { icon: typeof Mail; title: string }) {
    return (
        <div className="flex items-center gap-3 rounded-md border bg-background p-3">
            <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="size-4"/>
            </span>
            <span className="text-sm font-medium">{title}</span>
        </div>
    )
}
