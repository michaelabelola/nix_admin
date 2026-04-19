import React, {type ReactNode} from 'react';
import Page404 from "#/components/pages/Page404.tsx";

type HeaderProp = {
    title?: string;
    description?: string;
    actionView?: ReactNode;
}


function Page({header, ...props}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
    header?: HeaderProp
}) {
    return (
        <main className={"h-full w-full flex flex-col p-4 gap-4 lg:px-6"}>
            {header && (
                <section className="py-2 flex gap-2">
                    <div className="space-y-1 w-full">
                        <h1 className="text-2xl font-semibold tracking-tight">{header.title}</h1>
                        <p className="text-sm text-muted-foreground">
                            {header.description}
                        </p>
                    </div>
                    <div>
                        {header.actionView}
                    </div>
                </section>
            )}

            {
                props.children ?
                    <section className={"py-2"}>
                        {props.children}
                    </section> :
                    <Page404 message={"No Content Found for this page"}/>
            }
        </main>
    );
}

export default Page;