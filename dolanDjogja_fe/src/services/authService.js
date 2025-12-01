import API from "./api";

export const login = async (data) => {
    const res = await API.post("/login", data);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    return res.data;
};

export const register = async (data) => {
    return await API.post("/register", data);
};

export const logout = async () => {
    const res = await API.post("/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return res.data;
};

export const getUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};