import {Page} from "@suiteonix/components";
import {Button, ButtonGroup} from "@suiteonix/ui";
import {useNavigate} from "@tanstack/react-router";

const ListingDashboard = () => {
    const navigate = useNavigate();
    return <Page header={{
        title: "Listing Dashboard",
        description: "View and manage all your listings in one place. Monitor performance, track metrics, and optimize your listings for maximum visibility and sales.",
        actionView: <ButtonGroup>
            <Button variant={"glass"} onClick={() => navigate({to: "/admin/listings/dashboard"})}>View Listings</Button>
        </ButtonGroup>
    }}>

    </Page>
}

export default ListingDashboard;