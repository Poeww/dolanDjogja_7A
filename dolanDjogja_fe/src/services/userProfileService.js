import api from "./api";

export function getMyProfile() {
    return api.get("/me");
}

export function updateMyProfile(data) {
    return api.put("/me", data);
}
