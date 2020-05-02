import fs from 'fs'

const publicUtils = {
    myDir: ''
}

const utils = {

    //Convertendo arquivo em binário
    async base64_encode(fileName, path = `${publicUtils.myDir}/temp/imagesUploaded/`) {
        try {
            const bitmap = await fs.readFileSync(`${path}${fileName}`);
            return new Buffer.from(bitmap).toString('base64');
        } catch (error) {
            console.log(error, 'erro ao ler arquivo')
            return false
        }
        
    },

    //Convertendo binario em arquivo
    base64_decode (base64str, fileName, path = `${publicUtils.myDir}/perfis/` ) {
        try {
            const bitmap = new Buffer.from(base64str, 'base64');
            fs.writeFileSync(`${path}${fileName}`, bitmap, 'binary', function (err) {
            if (err) {
                console.log(err, 'Conversao de arquivo com erro');
            }
        });
        } catch (error) {
            console.log(error, 'Erro na conversão do arquivo')
        }
        
    },

}

export default utils