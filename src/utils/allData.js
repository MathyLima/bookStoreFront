import { api } from "./env";

export const allData = async (servicePath) => {

    try {
        let response = await api.get(servicePath)
        if (/^2[0-9]{2}/.test( response.status.toString())) {
            return  response.data
        } else {
            throw ("Erro, por favor tente novamente, código http: " + response.status + "-" + response.statusText)
        }
    } catch (error) {
        // console.error(error)
        throw new Error(error)
    }
}