import React, {type ReactNode} from 'react';
import Page404 from "#/components/pages/Page404.tsx";
import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "#/components/ui/card.tsx";
import {Spinner} from "#/components/ui/spinner.tsx";
import {Button} from "#/components/ui/button.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "#/components/ui/avatar.tsx";
import {cn} from "#/lib/utils.ts";

type HeaderProp = {
    avatar?: string | null;
    title?: string | null | ReactNode;
    description?: string | ReactNode | null;
    actionView?: ReactNode;
}


function Page({
                  header,
                  isLoading,
                  isFetching,
                  loading,
                  showBack,
                  parentClasses,
                  fixed = false,
                  clearPadding = false,
                  contentScroll = false,
                  className,
                  ...props
              }: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
    header?: HeaderProp
    parentClasses?: Parameters<typeof cn>[0]
    isLoading?: boolean
    isFetching?: boolean
    showBack?: boolean
    fixed?: boolean
    contentScroll?: boolean
    clearPadding?: boolean
    loading?: {
        title?: string
        description?: string
    }
}) {
    if (isLoading)
        return <main className={"h-full w-full flex flex-col p-4 gap-4 lg:px-6 items-center justify-center"}>

            <Card className="mx-auto max-w-xl shadow-sm h-fit w-12/12 md:w-5/12">
                <CardHeader>
                    {loading?.title &&
                        <CardTitle
                            className={"flex flex-col-reverse items-center gap-4 md:gap-0 md:justify-between md:flex-row"}>
                            {loading?.title}
                            <div className={"text-xl"}><Spinner className={"size-6 md:size-4 text-warning"}/></div>
                        </CardTitle>}
                    {loading?.description &&
                        <CardDescription className={"text-center md:text-left"}>
                            {loading.description}
                        </CardDescription>
                    }
                </CardHeader>
                {showBack &&
                    <CardFooter className={"flex justify-end"}>
                        <Button onClick={() => window.history.back()}>Back</Button>
                    </CardFooter>
                }
            </Card>
        </main>;
    return (
        <main className={cn(
            "min-h-dvh w-full flex flex-col p-4 gap-4",
            fixed ? "h-dvh overflow-y-hidden" : "",
            clearPadding ? "px-0 py-0" : "lg:px-6",
            contentScroll ? "overflow-y-auto py-0 lg:px-0" : "",
            parentClasses
        )}>
            {header && (
                <section className="py-2 flex gap-2 items-center">
                    {header?.avatar &&
                        <Avatar className={"h-8 w-8 rounded-lg grayscale"}>
                            <AvatarImage src={header.avatar} className={"object-cover aspect-square border"}/>
                            <AvatarFallback>{(header?.title as any)?.substring(0, 1).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    }
                    <div className="space-y-1 w-full">
                        <h1 className="text-2xl font-semibold tracking-tight">{header.title}</h1>
                        <p className="text-sm text-muted-foreground">
                            {header.description}
                        </p>
                    </div>
                    <div>
                        {header.actionView}
                    </div>
                    <span className="absolute top-4 inset-e-4 flex size-2">
                    {
                        isFetching ?
                            <><span
                                className="absolute inline-flex h-full w-full animate-ping bg-warning/70"></span>
                                <span className="relative inline-flex size-2 bg-warning"></span>
                            </>
                            :
                            <>
                                <span
                                    className="absolute inline-flex h-full w-full animate-ping bg-success/70"></span>
                                <span className="relative inline-flex size-2 bg-success"></span>
                            </>
                    }
                    </span>
                </section>
            )}

            {
                props.children ?
                    <section className={cn("h-full",
                        clearPadding ? "px-0 py-0" : "",
                        className)}>
                        {props.children}
                    </section> :
                    <Page404 message={"No Content Found for this page"}/>
            }
        </main>
    );
}

export default Page;