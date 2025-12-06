import api from "./api";

export function getAllUsers() {
    return api.get("/users");
}

export function getUserById(id) {
    return api.get(`/users/${id}`);
}

export function createUser(data) {
    return api.post("/users", data);
}

export function updateUser(id, data) {
    return api.put(`/users/${id}`, data);
}

export function deleteUser(id) {
    return api.delete(`/users/${id}`);
}
