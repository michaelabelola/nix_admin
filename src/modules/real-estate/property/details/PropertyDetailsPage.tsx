import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "#/components/ui/card.tsx";
import {Route} from "#/routes/_authenticated/admin/real-estate/properties/$propertyId.tsx";
import {PropertyApiHook} from "#/modules/real-estate/property/api.hook.ts";
import Page from "#/components/Page.tsx";
import {Button} from "#/components/ui/button.tsx";
import {ButtonGroup} from "#/components/ui/button-group.tsx";

const PropertyDetailsPage = () => {

    const {propertyId} = Route.useParams()

    const {data, isLoading, isFetching} = PropertyApiHook.useGetDetailedProperty(propertyId)


    return (
        <Page isLoading={isLoading} isFetching={isFetching} loading={{
            title: "Loading",
            description: `Fetching property (${propertyId})`,
        }} header={{
            avatar: data?.avatar,
            title: data?.name,
            description: data?.name,
            actionView: <ButtonGroup>
                <Button variant={"outline"} onClick={() => window.history.back()}>Back</Button>
            </ButtonGroup>
        }}>
            <Card className={"min-h-full"}>
                <CardHeader>
                    <CardTitle>Property detail page</CardTitle>
                    <CardDescription>
                        {data?.name}
                        Placeholder page for property {propertyId}.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="min-h-full rounded-lg border border-dashed"/>
                </CardContent>
            </Card>
        </Page>
    );
};

export default PropertyDetailsPage;