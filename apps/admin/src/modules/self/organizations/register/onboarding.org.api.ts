import {type Organization_RegisterModel, type OrganizationModel} from "#/modules/organization/models/models.ts";
import {BACKEND} from "#/lib/fetch.ts";

export class OnboardingOrgApi {

    register({user, data, avatar, logo, logoDark, coverImage, coverImageDark}: {
        user: Organization_RegisterModel.OrgUser,
        data: Organization_RegisterModel.Register,
        avatar?: File,
        logo?: File,
        logoDark?: File,
        coverImage?: File,
        coverImageDark?: File
    }) {

        const formData = new FormData();
        formData.append("user", JSON.stringify(user));
        formData.append("data", JSON.stringify(data));
        avatar && formData.append("avatar", avatar);
        logo && formData.append("logo", logo);
        logoDark && formData.append("logoDark", logoDark);
        coverImage && formData.append("coverImage", coverImage);
        coverImageDark && formData.append("coverImageDark", coverImageDark);

        return BACKEND.authFetch<OrganizationModel.Organization>(`/organizations/register`, {
            method: "POST",
            contentType: "omit",
            body: formData,
        })
    }
}

const orgOnboardingApi = new OnboardingOrgApi();

export default orgOnboardingApi;