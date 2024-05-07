import { api } from "./env";

export const getOrdersByClientPaginate = async (cliente, page, servicePath) => {

    try {
        let response = await api.get(servicePath, { params: { page, cliente_id: cliente} })
        
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

export const getOrdersByEmpoyeesPaginate = async (funcionario, page, servicePath) => {

    try {
        let response = await api.get(servicePath, { params: { page, vendedor_id: funcionario} })
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