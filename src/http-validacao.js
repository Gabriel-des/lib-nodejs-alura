/**
 * Extrai todos os links do array
 * @param {Object[]} arrLinks array de links
 * @returns todos os links em um único array
 */
function extractLinks(arrLinks) {
    return arrLinks.map(objLink => Object.values(objLink).join())
}

/**
 * Testa as urls
 * @param {string[]} urlList Lista de urls
 * @returns uma lista de status code
 */
async function checkStatus(urlList) {
    // Cria a constante que irá receber os valores de status
    const arrStatus = await Promise
        .all(
            // Percorre a lista de url
            urlList.map(async (url) => {
                try {
                    // Tenta acessar a url através do método fetch
                    const response = await fetch(url)
                    // Retorna o status code da requisição
                    return `${response.status} - ${response.statusText}`;
                } catch (error) {
                    // retorna a função que trata erros
                    return manageError(error)
                }
            })
        )

    return arrStatus
}

/**
 * Função para manejar erros
 * @param {Object} error objeto de erro
 * @returns uma string especificando o erro
 */
function manageError(error) {
    // Verifica se o erro é de url não encontrada
    if (error.cause.code === 'ENOTFOUND') {
        return 'link não encontrado'
    } else {
        return 'ocorreu algum erro'
    }
}

export default async function validList(linkList) {
    const links = extractLinks(linkList)

    const status = await checkStatus(links)

    return linkList.map((link, index) => ({
        ...link,
        status: status[index]
    }))
}