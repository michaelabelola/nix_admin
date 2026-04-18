import React from 'react';
import Page404 from "#/components/pages/Page404.tsx";

function Page(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>) {
    return (
        <main className={"h-full w-full flex flex-col items-center justify-center"}>
            {props.children || <Page404 message={"No Content Found for this page"}/>}
        </main>
    );
}

export default Page;