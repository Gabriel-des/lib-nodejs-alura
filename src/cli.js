// Importando a função para ler o arquivo
import getFileLinks from "./index.js"
import chalk from "chalk"
import fs from 'fs'
import validList from "./http-validacao.js"

// Capturando os argumentos do terminal
const args = process.argv

/**
 * Mostra uma lista no console
 * @param {boolean} valid Verifica se é necessário validar os links
 * @param {string} fileName Nome do arquivo
 * @param {string} result Url's encontradas
 */
async function showList(valid, fileName, result) {
    if (valid) {
        console.log(
            chalk.yellow('Lista validada'),
            await validList(result))
    } else {
        console.log(
            chalk.yellow('Lista de links'), 
            chalk.black.bgGreen(fileName),
            result)
    }
}

/**
 * Captura o texto através do caminho do arquivo
 * @param {string} args argumentos passados no terminal
 */
async function processText(args) {
    // Caminho do arquivo
    const path = args[2]
    // Verifica se o terceiro parâmetro é igual a --valida
    // Se for guarda true
    // Se não false
    const valid = args[3] === '--valid'

    // Testa para ver se não há erros no caminho passado
    try {
        fs.lstatSync(path)
    } catch(error) {
        // Verifica o código de erro e dispara uma mensagem para o usuário
        if(error.code === 'ENOENT') {
            console.log(chalk.red('Arquivo ou diretório não existente'))
            return
        }
    }

    // Verifica se o caminho é um arquivo
    if (fs.lstatSync(path).isFile()) {
        // Executa a função para ler o arquivo passando como parâmetro o parâmetro que o usuário passa no terminal
        const result = await getFileLinks(path)
        // Captura o nome do arquivo a partir do caminho
        const fileName = path.split('/').pop()
        showList(valid, fileName, result)
        //Verifica se o caminho é um diretório com vários arquivos
    } else if (fs.lstatSync(path).isDirectory()) {
        // Captura todos os arquivos que existem dentro do diretório
        const files = await fs.promises.readdir(path)
        // Loop pelos arquivos
        files.forEach(async fileName => {
            // Executa a função para ler o arquivo passando como parâmetro o diretório original + o nome do arquivo que está no loop
            const list = await getFileLinks(`${path}/${fileName}`)
            showList(valid, fileName, list)
        })
    }
}

processText(args)