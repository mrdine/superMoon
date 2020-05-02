
module.exports = {

    

    firstLetterUpper(text, separator = ' ') {
        if (text === '') {
            return ''
        }
        try {
            return text
                .split(separator)
                .map(function (word) {
                    if (word === 'de' || word === 'da' || word === 'do' || word === 'das' || word === 'dos') {
                        return word.toLowerCase()
                    }
                    return word[0].toUpperCase() + word.slice(1).toLowerCase()
                })
                .join(separator)
        } catch (error) {

        }

    },

    categorias: ['Categoria', 'Bar e Restaurante',
        'Moda e Acessórios',
        'Beleza e Estética',
        'Saúde',
        'Entretenimento',
        'Supermercado',
        'Conveniência',
        'Casa e Construção',
        'Automóveis',
        'Loja' , 
        'Serviços'],


    backendStatus(response) {
        if(response.status > 302) {
            alert(response)
            return false
        } else {
            return true
        }
    },
}