import {createRouter as createTanStackRouter} from '@tanstack/react-router'
import {routeTree} from './routeTree.gen.ts'
import {setupRouterSsrQueryIntegration} from '@tanstack/react-router-ssr-query'
import {
    getContext,
} from './integrations/tanstack-query/root-provider.tsx'
import {Page404} from "@suiteonix/components";

export function getRouter() {
    const context = getContext()

    const router = createTanStackRouter({
        routeTree,
        context,
        scrollRestoration: true,
        defaultPreload: 'intent',
        defaultPreloadStaleTime: 0,
        defaultNotFoundComponent: (props) => <Page404 {...props}/>
    })

    setupRouterSsrQueryIntegration({router, queryClient: context.queryClient})

    return router
}

declare module '@tanstack/react-router' {
    interface Register {
        // @ts-ignore
        router: ReturnType<typeof getRouter>
    }
}
