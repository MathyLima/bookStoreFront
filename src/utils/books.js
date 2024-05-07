import { api } from "./env";

const servicePath = 'livros'

export const getPaginateBooksFilter = async (page, genero, preco_max, preco_min) => {
    try {

        let params = { params: { page } }
        if(genero != undefined && genero != null && genero != "") {
            params.params['genero'] = genero
        }
        if(preco_max != undefined && preco_max != null && preco_max != "") {
            params.params['preco_max'] = preco_max
        }
        if(preco_min != undefined && preco_min != null && preco_min != "") {
            params.params['preco_min'] = preco_min
        }

        console.log(params)

        let response = await api.get(servicePath, params);
        if (/^2[0-9]{2}/.test( response.status.toString())) {
            return  response.data
        } else {
            throw new Error("Erro, por favor tente novamente, código http: " + response.status + "-" + response.statusText)
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const deleteBook = async (id) => {

    try {
        let response = await api.delete(`livros/${id}`)
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
