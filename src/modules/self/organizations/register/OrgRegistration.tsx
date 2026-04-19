import {Outlet} from "@tanstack/react-router";
import Page from "#/components/Page.tsx";

const OrgRegistration = () => {
    // base registration logic and form handling / submission
    return (
        <Page>
            <Outlet/>
        </Page>
    );
};

export default OrgRegistration;