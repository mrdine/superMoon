import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

import api from '../../services/api'
import Headers from '../../utils/components/header'

// basta importar o css que já se aplica
import './styles.css'

//import logoImg from '../../assets/logo.svg'
import rocket from '../../assets/rocket.png'

import utils from '../../utils'

export default function Login() {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const history = useHistory()

    async function handleLogin(e) {
        e.preventDefault()

        if (!email || !senha) {
            alert('Digite email e senha')
            return
        }


        try {
            const response = await api.post('login', { email, senha })
        
        
            localStorage.setItem('email', email)
            localStorage.setItem('token', response.data.token)

            history.push('/meu_perfil')
        } catch (error) {
            alert('Email ou senha incorretos')
        }
        

    }

    return (
        // jsx aqui
        <div >

            <Headers tipo='vazio'></Headers>
            <img className='rocket' src={rocket} alt='supermoon'></img>

            <aside className='loginContainer'>
                <form onSubmit={handleLogin}>
                    <input className='emailInput'
                        placeholder="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}></input>
                    <input type='password' className='senhaInput'
                        placeholder="senha"
                        value={senha}
                        onChange={e => setSenha(e.target.value)}></input>

                    <button className="button" type="submit">Entrar</button>
                </form>
                <h1>Não tem uma conta? <Link className='linkCadastro' to='/cadastro'>Cadastre-se</Link></h1>

            </aside>
        </div>

    )
}