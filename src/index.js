import fs from "fs";
import chalk from "chalk";

/**
 * Extrai todos os links do arquivo de markdown
 * @param {string} text texto do arquivo
 * @returns um array de objetos com todos os links
 */
function extractMDLinks(text) {
    // Regex para buscar os links no texto
    // ex: [Link](https://exemplo.com)
    // ex2: [Link](http://exemplo.com/sublink#section)
    const regex     = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm
    // Vai procurar por todas as ocorrências no texto e trazer o objeto dentro de um array
    const captures  = [...text.matchAll(regex)]
    // Percorre o array de objetos e constrói um novo objeto de chave => valor
    // Chave = Valor que esta dentro dos colchetes
    // Valor = Valor que esta dentro dos parênteses
    const result = captures.map(capture => ({[capture[1]] : capture[2]}))

    // Retorna o resulta
    return result.length !== 0 ? result : 'Não há links no arquivo!'
}

/**
 * Trata o erro
 * @param {Object} error erro em questão
 * @returns um erro para o usuário
 */
function handleError(error) {
    throw new Error(chalk.red(error.code, 'Não há arquivo no diretório'))
}


// PROMISES COM ASYNC/AWAIT
/**
 * Lê um arquivo de forma assíncrona
 * @param {string} pathFile caminho do arquivo
 * @returns um array com todos os links do arquivo
 */
async function getFileLinks(pathFile) {
    // Tenta executar a função
    try {
        // Seleciona a codificação da mensagem
        const encode = 'utf-8'
        // Espera a resposta do readFile por conta do await e guarda na variável resposta
        const response = await fs.promises.readFile(pathFile, encode)
        // Mostra resposta no console
        return extractMDLinks(response)
        // Captura o erro caso aconteça
    } catch (err) {
        handleError(err)
        // Finaliza o processo
    } finally {
        console.log(chalk.yellow('operação concluída'));
    }

}

// Exportando a função que le o arquivo
export default getFileLinks