import { api } from "./env";

export const getClientByCpf = async (cpf, servicePath) => {

    try {
        let response = await api.get(servicePath, { params: { cpf } })
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