import {Outlet} from "@tanstack/react-router";
import {RegistrationProvider} from "#/modules/self/organizations/register/registration.context.tsx";
import Page from "#/components/Page.tsx";

const OrgRegistration = () => {
    // base registration logic and form handling / submission
    return (
        <RegistrationProvider>
            <Page fixed={true} clearPadding className={"px-6 py-6"}>
                <div className="flex h-full w-full flex-col px-4">
                    <Outlet/>
                </div>
            </Page>
        </RegistrationProvider>
    );
};

export default OrgRegistration;
