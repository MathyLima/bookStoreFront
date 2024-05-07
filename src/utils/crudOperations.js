import { api } from "./env";

export const getPaginateItems = async (page, servicePath) => {
    try {
        let response = await api.get(servicePath, { params: { page } });
        if (/^2[0-9]{2}/.test( response.status.toString())) {
            return  response.data
        } else {
            throw new Error("Erro, por favor tente novamente, código http: " + response.status + "-" + response.statusText)
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const getItemById = async (id, servicePath) => {

    try {
        let response = await api.get(`${servicePath}/${id}`)
        if (/^2[0-9]{2}/.test( response.status.toString())) {
            return  response.data
        } else {
            throw new Error("Erro, por favor tente novamente, código http: " + response.status + "-" + response.statusText)
        }
    } catch (error) {
        console.error(error)
        throw new Error(error)
    }
}

export const getItemByName = async (nome, page, servicePath) => {

    try {
        let response = await api.get(servicePath, { params: { page, nome} })
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

export const createItem = async (data, servicePath) => {

    console.log("ENVIO: ", data)
    try {
        let response = await api.post(servicePath, data);
        if (/^2[0-9]{2}/.test( response.status.toString())) {
            return response.data
        } else {
            throw new Error("Erro, por favor tente novamente, código http: " + response.status + "-" + response.statusText)
        }
    } catch (error) {
        // console.error(error)
        throw new Error(error)
    }
}

export const editItem = async (id, data, servicePath) => {

    console.log("EDIÇÃO: ", data)

    try {
        let response = await api.put(`${servicePath}/${id}`, data);
        if (/^2[0-9]{2}/.test( response.status.toString())) {
            return response.data
        } else {
            console.log(response)
            throw new Error("Erro, por favor tente novamente, código http: " + response.status + "-" + response.statusText)
        }
    } catch (error) {
        console.error(error)
        throw new Error(error)
    }
}


export const deleteItem = async (id, servicePath) => {

    try {
        let response = await api.delete(`${servicePath}/${id}`)
        if (/^2[0-9]{2}/.test( response.status.toString())) {
            return response.data
        } else {
            throw new Error("Erro, por favor tente novamente, código http: " + response.status + "-" + response.statusText)
        }
    } catch (error) {
        // console.error(error)
        throw new Error(error)
    }
}


export const getEmployeeOrClientByCpf = async (cpf, servicePath) => {

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