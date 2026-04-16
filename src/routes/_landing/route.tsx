import {createFileRoute, Outlet} from '@tanstack/react-router'

export const Route = createFileRoute('/_landing')({component: App})

function App() {
    return <Outlet/>
}
