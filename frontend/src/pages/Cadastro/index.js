import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

import api from '../../services/api'
import Headers from '../../utils/components/header'
import Categoria from '../../utils/components/categoria'

// basta importar o css que já se aplica
import './styles.css'

//import logoImg from '../../assets/logo.svg'
import rocket from '../../assets/rocket.png'

import utils from '../../utils'
import consertarValor from '../../utils/consertarValor'
import MaskedInput from 'react-text-mask'

export default function Cadastro() {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [senha2, setSenha2] = useState('')
    const [apelido, setApelido] = useState('')
    const [telefone, setTelefone] = useState('')
    const [categoria, setCategoria] = useState('')
    const [nome, setNome] = useState('')

    const [uf, setUf] = useState('')
    const [cidade, setCidade] = useState('')
    const [bairro, setBairro] = useState('')
    const [rua, setRua] = useState('')
    const [numero, setNumero] = useState('')
    const [complemento, setComplemento] = useState('')

    const history = useHistory()

    function ajeitarNumero(numero) {
        //(xx) xxxxx-xxxx
        if(numero.length === 16) {
            setTelefone(numero)
        } else if(numero.length === 15) {
            let novoTel = ''
            //(84) 3 5212-233
            novoTel = numero[0] + numero[1] + numero[2] + numero[3] + ' ' + numero[5] + numero[7] + numero[8] + numero[9] + numero[10] + numero[11] + numero[12] + numero[13] + numero[14]
            setTelefone(novoTel)
            console.log(telefone)
        } else {
            setTelefone(numero)
        }
    }

    async function handleCadastro(e) {
        e.preventDefault()

        if(!categoria || categoria === 'Categoria') {
            alert('Escolha uma categoria')
            return
        }
        if(senha !== senha2) {
            alert('As senhas não conferem')
            return
        }
        if(!senha) {
            alert('Escolha uma senha')
            return
        }
        // verificar se os campos obrigatorios estão vazios
        if(!email) {
            alert('Por favor, preencha todos os campos obrigatórios')
            return
        }
        if(!apelido) {
            alert('Por favor, escolha um apelido, ele será uma forma rapida de encontrarem seu estabelecimento')
            return
        }
        if(!telefone) {
            alert('Por favor, preencha todos os campos obrigatórios')
            return
        }
        if(!nome) {
            alert('Por favor, preencha todos os campos obrigatórios')
            return
        }

        if(!uf) {
            alert('Por favor, preencha todos os campos obrigatórios')
            return
        }
        if(!cidade) {
            alert('Por favor, preencha todos os campos obrigatórios')
            return
        }
        if(!bairro) {
            alert('Por favor, preencha todos os campos obrigatórios')
            return
        }
        if(!rua) {
            alert('Por favor, preencha todos os campos obrigatórios')
            return
        }
        if(!numero) {
            alert('Por favor, preencha todos os campos obrigatórios')
            return
        }
        
        try {
            // Verificar se email e apelido já não estão cadastrados
            const response1 = await api.post('buscar/estabelecimentoEmail', {email})
            if(response1.data.est) {
                alert('Uma conta com este email já foi cadastrada')
                return
            }

            const response2 = await api.post('buscar/estabelecimentoApelido', {apelido})
            if(response2.data.est) {
                alert('Uma conta com este apelido já foi cadastrada')
                return
            }

            const data = {
                nome: consertarValor(nome, false),
                apelido: consertarValor(apelido, false),
                email: consertarValor(email, false),
                senha,
                senha2,
                telefone,
                categoria,
                uf,
                cidade: cidade.toLowerCase(),
                bairro,
                rua,
                numero,
                complemento
            }

            const response3 = await api.post('cadastrar_estabelecimento', data)
            if(response3.data.nome === data.nome) {
                history.push('/login')
            } else {
                alert('Erro, tente novamente')
            }
        } catch (error) {
            console.log(error)
            alert('Erro, tente novamente')
            history.push('/cadastro')
        }
        
            
        
    }

    return (
        <div>
            
            <Headers id='header' tipo='vazio'></Headers>
            <br></br>
            <aside className='cadastroContainer'>
            <h1 id='titulo'>Insira os dados do estabelecimento</h1>
            <p>Os campos que contém * são obrigatórios</p>
                <form className='cadastroForm' onSubmit={handleCadastro}>
                    <div className='dadosEst'>
                        <input className='inputEst' value={nome} onChange={e => { setNome(e.target.value)}} id='nome' placeholder='Nome do Estabelecimento*'></input>
                        <MaskedInput className='inputEst' id='apelido' guide={false} value={apelido} onChange={e => setApelido(e.target.value)} placeholder='Apelido Único Para o Seu Estabelecimento*' mask={[/\w/, /\w/,/\w/, /\w/, /\w/, /\w/, /\w/, /\w/, /\w/, /\w/, /\w/,/\w/, /\w/, /\w/, /\w/, /\w/, /\w/, /\w/, /\w/, /\w/, /\w/, /\w/, /\w/]} ></MaskedInput>
                        
                        <input className='inputEst' value={email} onChange={e => { setEmail(e.target.value)}} id='email' placeholder='Email*'></input>
                        <MaskedInput className='inputEst' id='telefone' guide={false} value={telefone} onChange={e => ajeitarNumero(e.target.value)} placeholder='Telefone*' mask={['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/,/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]} ></MaskedInput>
                        <input className='inputEst' value={senha} onChange={e => { setSenha(e.target.value)}} id='senha1' placeholder='Senha*' type='password'></input>
                        <input className='inputEst' value={senha2} onChange={e => { setSenha2(e.target.value)}} id='senha2' placeholder='Confirme a Senha*' type='password'></input>
                        <Categoria id='categoria' aoMudar={setCategoria}></Categoria>

                    </div>
                    <div  className='dadosEnd' >
                        <input className='inputEst' value={uf.toUpperCase()} onChange={e => { setUf(e.target.value.toUpperCase())}} id='uf' placeholder='UF*'  maxLength='2'></input>
                        <input className='inputEst' value={utils.firstLetterUpper(cidade)} onChange={e => { setCidade(e.target.value.toLowerCase())}} id='cidade' placeholder='Cidade*'></input>
                        <input className='inputEst' value={bairro} onChange={e => { setBairro(e.target.value)}} id='bairro' placeholder='Bairro*'></input>
                        <input className='inputEst' value={rua} onChange={e => { setRua(e.target.value)}} id='rua' placeholder='Rua*'></input>
                        <input type='number' className='inputEst' value={numero} onChange={e => { setNumero(e.target.value)}} id='numero' placeholder='Número*'></input>
                        <input className='inputEst' value={complemento} onChange={e => { setComplemento(e.target.value)}} id='complemento' placeholder='Complemento'></input>

                    </div>



                    <button className='button' id='buttonCadastro' type='submit'>Cadastrar-se</button>

                    <h1>Já tem uma conta? <Link className='linkLogin' to='/login'>Logue-se</Link></h1>
                </form>
            </aside>

            <img className='rocket' src={rocket} alt="" />
            <script>

            </script>
        </div>
    )

}