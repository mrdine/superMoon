
function deletarUltimoCaractere(texto) {
    let caracteres = []
    for(let i = 0; i < texto.length - 1; i++) {
        caracteres.push( texto[i] )
    }
    const novoTexto = caracteres.join('')
    return novoTexto
}

function deletarPrimeiroCaractere(texto) {
    let caracteres = []
    for(let i = 1; i < texto.length; i++) {
        caracteres.push( texto[i] )
    }
    const novoTexto = caracteres.join('')
    return novoTexto
}
/*
    Esta função serve para deixar todo o texto minusculo e tirar ' ' no final e no começo do texto se houver
*/
export default function consertarValor(valor, minusculas = true ,callback = undefined) {
    let valorConsertado = valor

    while(valorConsertado[valorConsertado.length - 1] === ' ') {
        valorConsertado = deletarUltimoCaractere(valorConsertado)
    }
    while(valorConsertado[0] === ' ') {
        valorConsertado = deletarPrimeiroCaractere(valorConsertado)
    }

    
    if(minusculas) {
        return valorConsertado.toLowerCase()
    }

    if(callback) {
        callback(valorConsertado)
    }
    
    return valorConsertado
    
}