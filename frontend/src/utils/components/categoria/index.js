import React from 'react'
import ReactDom from 'react-dom'

import utils from '../../../utils'

import './styles.css'

const Categoria = props => {

    

    const funcaoPassada = props.aoMudar

    let categoriasList = utils.categorias.map((categoria, index) => {
        return (
			<option key={index}>{categoria}</option>
		)
    })
    
    function getSelectedOption(sel) {
        var opt;
        for ( var i = 0, len = sel.options.length; i < len; i++ ) {
            opt = sel.options[i];
            if ( opt.selected === true ) {
                break;
            }
        }
        return opt.value;
    }

    const aoMudar = () => {
        const selectElement = document.getElementById('categoria')
        let categoria = getSelectedOption(selectElement)

        funcaoPassada(categoria)
    }

    return (
        <div>
            <select onChange={() => aoMudar()} id="categoria">{categoriasList}</select>
        </div>
    )
}

export default Categoria

/*
<select id="categoria">
                            <option>Bar e Restaurante</option>
                            <option>Moda e Acessórios</option>
                            <option>Beleza e Estética</option>
                            <option>Saúde</option>
                            <option>Entretenimento</option>
                            <option>Supermercado</option>
                            <option>Conveniência</option>
                            <option>Casa e Construção</option>
                            <option>Automóveis</option>
                            <option>Loja</option>
                            <option>Serviços</option>
                        </select>*/ 