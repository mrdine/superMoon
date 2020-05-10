

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


    resizeImage: (base64Str, maxWidth = 480, maxHeight = 270) => {
        return new Promise((resolve) => {
          let img = new Image()
          img.src = base64Str
          img.onload = () => {
            let canvas = document.createElement('canvas')
            const MAX_WIDTH = maxWidth
            const MAX_HEIGHT = maxHeight
            let width = img.width
            let height = img.height
      
            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width
                width = MAX_WIDTH
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height
                height = MAX_HEIGHT
              }
            }
            canvas.width = width
            canvas.height = height
            let ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, width, height)
            resolve(canvas.toDataURL())
          }
        })
      }
}