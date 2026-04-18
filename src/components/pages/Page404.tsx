import {Card, CardContent, CardTitle} from "#/components/ui/card.tsx";

function Page404(props:{message:string}) {
    return (
        <Card>
            <CardTitle title="404: Not Found"/>
            <CardContent>{props.message || `Page Not Found`}</CardContent>
        </Card>
    );
}

export default Page404;