import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiLogIn } from 'react-icons/fi'

import api from '../../services/api'

import Headers from '../../utils/components/header'

// basta importar o css que já se aplica
import './styles.css'

//import logoImg from '../../assets/logo.svg'
import logo from '../../assets/logo.png'


export default function Inicial() {
    // devo trocar o uf para minusculo depois
    const [uf, setUF] = useState('')
    const [cidade, setCidade] = useState('')

    function firstLetterUpper(text, separator = ' ') {
        if(text === '') {
            return ''
        } 
        try {
            return text
            .split(separator)
            .map(function(word) { 
                if(word === 'de' || word === 'da' || word === 'do' || word === 'das' || word === 'dos') {
                   return word.toLowerCase()
                }
                return word[0].toUpperCase() + word.slice(1).toLowerCase()
            })
            .join(separator)
        } catch (error) {
            
        }
        
    }

    function maisculas(value) {
        return value.toUpperCase()
    }
    // fazer uma função dessa global
    function tirareEspacos(value) {
        let cidade = value.toLowerCase()

    }
    async function handleBusca(e) {
        e.preventDefault()
    }

    return (
        // jsx aqui
        <div>
            <Headers tipo='inicial'></Headers>
            <img className='logo' src={logo} alt='supermoon'></img>

            <aside className='busca'>
                <form onSubmit={handleBusca}>
                    <h1>Procure estabelecimentos perto de você!</h1>
                    <input className='ufInput'
                        placeholder="UF"
                        value={maisculas(uf)}
                        maxLength='2'
                        onChange={e => setUF(e.target.value.toLowerCase())}></input>
                    <input className='cidadeInput'
                        placeholder="Cidade"
                        value={firstLetterUpper(cidade)}
                        onChange={e => setCidade(e.target.value.toLowerCase())}></input>

                    <button className="button" type="submit">Buscar</button>
                </form>
            </aside>

        </div>

    )
}
