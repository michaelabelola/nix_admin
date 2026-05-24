import {type Organization_RegisterModel} from "../../../organization/models/models.ts";
import {BACKEND} from "../../../utils";

export class OnboardingOrgApi {

    register({user, data, avatar, logo, coverImage}: {
        user: Organization_RegisterModel.OrgUser,
        data: Organization_RegisterModel.Register,
        avatar?: File,
        logo?: File,
        coverImage?: File,
    }) {

        const formData = new FormData();
        formData.append("user", JSON.stringify(user));
        formData.append("data", JSON.stringify(data));
        avatar && formData.append("avatar", avatar);
        logo && formData.append("logo", logo);
        coverImage && formData.append("coverImage", coverImage);

        return BACKEND.authFetch<Organization_RegisterModel.RegistrationResponse>(`/organizations/register`, {
            method: "POST",
            contentType: "omit",
            body: formData,
        })
    }
}

const orgOnboardingApi = new OnboardingOrgApi();

export default orgOnboardingApi;
