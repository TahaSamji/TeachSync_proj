import axios from "axios"
import { store } from "../store/index";
import { NotificationManager } from "react-notifications";

const httpService = async (config = {}) => {
    try {
        let { baseURL, endpoint, base, reqBody, jwt, successNotif, description } = { ...defaultConfig, ...config };
        if (endpoint === undefined || base === undefined) throw new Error("Endpoint not given");
        if (!endpoint[2]) jwt = `Bearer ${store.getState().user.token}`;
        const res = await axios({
            method: endpoint[1],
            url: `${base}/${endpoint[0]}`,
            baseURL,
            data: reqBody,
            headers: { Authorization: jwt },
        })
        const { data: { responseCode, responseDescription, data }, status } = res;
        description = description || responseDescription;
        if (status === 200) {
            if (responseCode === "00") {
                if (successNotif) NotificationManager.success(description, "SUCCESS")
                return data || true;
            }
            else NotificationManager.warning(responseDescription, "ERROR")
        } else if (status === 400) NotificationManager.error(data.join("\n"));
        else NotificationManager.error(description);
        return false;
    } catch (e) {
        console.error(e);
        NotificationManager.error("Please contact system administrators", "ERROR");
        return false
    }
}

export default httpService

const defaultConfig = {
    baseURL: "http://localhost:5600/",
    endpoint: undefined,
    base: undefined,
    reqBody: {},
    jwt: undefined,
    successNotif: false,
    description: undefined
}

const methods = {
    post: "POST",
    get: "GET"
}

// endpoint url, method name, unauthorized
export const endpoints = {
    auth: {
        base: "auth",
        signUp: ["signUp", methods.post, true],
        login: ["login", methods.post, true],
        updateProfile: ["updateProfile", methods.post],
        forgetPassword: ["forgetPassword", methods.post],
        changePassword: ["changePassword", methods.post]
    },
    appointments: {
        base: "appointments",
        search: ["search", methods.post],
        getAll: ["getAll", methods.get],
        create: ["create", methods.post],
        update: ["update", methods.post],
    }
}

/*
    async () => {
        const res = await httpService({
        endpoint: endpoints.auth.login,
        base: endpoints.auth.base,
        reqBody: { erp: 25252, password: "password" },
        successNotif: true
        })
        console.log(res)
    }}
*/