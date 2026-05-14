import {Outlet} from "@tanstack/react-router";
import {RegistrationPageShell} from "#/components/registration/RegistrationLayouts.tsx";
import {RegistrationProvider} from "#/modules/self/organizations/register/registration.context.tsx";

const OrgRegistration = () => {
    // base registration logic and form handling / submission
    return (
        <RegistrationProvider>
            <RegistrationPageShell>
                <Outlet/>
            </RegistrationPageShell>
        </RegistrationProvider>
    );
};

export default OrgRegistration;
