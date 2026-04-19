import {Outlet} from "@tanstack/react-router";
import Page from "#/components/Page.tsx";
import {RegistrationProvider} from "#/modules/self/organizations/register/registration.context.tsx";

const OrgRegistration = () => {
    // base registration logic and form handling / submission
    return (
        <RegistrationProvider>
            <Page header={{
                title: "Organization Registration",
                description: "Complete each step to submit a new organization registration request.",
            }}>
                <Outlet/>
            </Page>
        </RegistrationProvider>
    );
};

export default OrgRegistration;
