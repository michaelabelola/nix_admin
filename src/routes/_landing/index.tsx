import {createFileRoute, Navigate} from '@tanstack/react-router'

export const Route = createFileRoute('/_landing/')({component: App})

function App() {
    return <Navigate to="/welcome"/>
}
