// noinspection HtmlRequiredTitleElement

import {
    HeadContent,
    Scripts,
    createRootRouteWithContext,
} from '@tanstack/react-router'
import {TanStackRouterDevtoolsPanel} from '@tanstack/react-router-devtools'
import {TanStackDevtools} from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools.tsx'

import {getLocale} from '#/paraglide/runtime'

import appCss from '../styles.css?url'

import type {QueryClient} from '@tanstack/react-query'
import {TooltipProvider} from "@suiteonix/ui";
import {Toaster} from "@suiteonix/ui";
import {Page404} from "@suiteonix/components";
import type {ReactNode} from "react";
import {EntityBootstrap} from "#/lib/EntityBootstrap.tsx";

interface MyRouterContext {
    queryClient: QueryClient
}

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

export const Route = createRootRouteWithContext<MyRouterContext>()({
    beforeLoad: async () => {
        // Other redirect strategies are possible; see
        // https://github.com/TanStack/router/tree/main/examples/react/i18n-paraglide#offline-redirect
        if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('lang', getLocale())
        }
    },

    head: () => ({
        meta: [
            {
                charSet: 'utf-8',
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            {
                title: 'Suiteonix',
            },
            {
                name: "description",
                content: ""
            },
            {
                name: "twitter:title",
                content: ""
            },
            {
                name: "twitter:description",
                content: ""
            },
            {
                name: "og:title",
                content: ""
            },
            {
                name: "og:description",
                content: ""
            }
        ],
        links: [
            {
                rel: 'stylesheet',
                href: appCss,
            },
        ],
    }),
    notFoundComponent: () => (
        <Page404 message="The route you requested does not exist or is no longer available."/>
    ),
    shellComponent: RootDocument,
})

function RootDocument({children}: { children: ReactNode }) {
    return (
        <html lang={getLocale()} suppressHydrationWarning>
        <head>
            <script dangerouslySetInnerHTML={{__html: THEME_INIT_SCRIPT}}/>
            <HeadContent/>
        </head>
        <body className="font-sans antialiased wrap-anywhere">
        <div className={"fixed top-0 right-0 left-0 bottom-0 bg-background/90 backdrop-blur-xl -z-1"}></div>
        <TooltipProvider>
            <EntityBootstrap/>
            {children}
        </TooltipProvider>
        <Toaster/>
        <TanStackDevtools
            config={{
                position: 'bottom-right',
            }}
            plugins={[
                {
                    name: 'Tanstack Router',
                    render: <TanStackRouterDevtoolsPanel/>,
                },
                TanStackQueryDevtools,
            ]}
        />
        <Scripts/>
        </body>
        </html>
    )
}
