import {useState} from "react"
import {Link} from "@tanstack/react-router"
import {ArrowLeft, LockKeyhole, Mail, ShieldCheck} from "lucide-react"
import {toast} from "sonner"

import {Alert, AlertDescription, AlertTitle} from "@suiteonix/ui"
import {Badge} from "@suiteonix/ui"
import {Button} from "@suiteonix/ui"
import {Input} from "@suiteonix/ui"
import {Label} from "@suiteonix/ui"

export function CustomerLoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return (
        <main className="min-h-dvh bg-background">
            <section className="grid min-h-dvh lg:grid-cols-[0.92fr_1.08fr]">
                <div
                    className="relative hidden min-h-dvh overflow-hidden bg-cover bg-center text-white lg:block"
                    style={{backgroundImage: "url('/customer/portal-hero.png')"}}
                >
                    <div className="absolute inset-0 bg-black/68"/>
                    <div className="relative z-10 flex h-full flex-col justify-between p-10">
                        <Link to="/customer" className="flex w-fit items-center gap-3">
                            <img src="/logo192.png" alt="Suiteonix" className="size-9 rounded-md"/>
                            <span className="text-sm font-semibold uppercase tracking-[0.16em]">Suiteonix Customer</span>
                        </Link>
                        <div className="max-w-xl pb-6">
                            <Badge className="mb-5 bg-white/15 text-white hover:bg-white/15">Customer access</Badge>
                            <h1 className="text-5xl font-semibold leading-tight">Return to your customer portal.</h1>
                            <p className="mt-5 text-base leading-8 text-white/78">
                                Sign in to manage profile details, service updates, and customer account records from one secure workspace.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex min-h-dvh flex-col px-4 py-6 sm:px-8 lg:px-12">
                    <header className="flex items-center justify-between">
                        <Button asChild variant="ghost" className="px-0">
                            <Link to="/">
                                <ArrowLeft className="size-4"/>
                                Customer home
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                            <Link to="/register">Register</Link>
                        </Button>
                    </header>

                    <div className="mx-auto grid w-full max-w-md flex-1 content-center py-10">
                        <Badge variant="outline" className="mb-5 w-fit">Customer Login</Badge>
                        <h1 className="text-3xl font-semibold tracking-tight">Access your account</h1>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                            Enter the email and password used during customer registration.
                        </p>

                        <form
                            className="mt-8 grid gap-5"
                            onSubmit={(event) => {
                                event.preventDefault()
                                toast.info("Customer login backend endpoint is not available yet.")
                            }}
                        >
                            <Alert className="rounded-none">
                                <ShieldCheck className="size-4"/>
                                <AlertTitle>Endpoint pending</AlertTitle>
                                <AlertDescription>
                                    The backend customer login endpoint will be connected here when it is created.
                                </AlertDescription>
                            </Alert>

                            <LoginFeature icon={Mail} title="Email access"/>

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
                    </div>
                </div>
            </section>
        </main>
    )
}

function LoginFeature({icon: Icon, title}: { icon: typeof LockKeyhole; title: string }) {
    return (
        <div className="flex items-center gap-3 border bg-muted/35 p-3">
            <span className="grid size-9 place-items-center bg-background text-primary">
                <Icon className="size-4"/>
            </span>
            <span className="text-sm font-medium">{title}</span>
        </div>
    )
}
