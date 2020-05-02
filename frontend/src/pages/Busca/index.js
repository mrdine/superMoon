import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiPower, FiTrash2 } from 'react-icons/fi'
import Headers from '../../utils/components/header'
import Categoria from '../../utils/components/categoria'

import api from '../../services/api'

import utils from '../../utils'
import './styles.css'
import lua from '../../assets/solua.png'
import fileConverter from '../../utils/fileConverter'

export default function Busca() {
    const [estabelecimentos, setEstabelecimentos] = useState([])

    let ufL = localStorage.getItem('uf')
    let cidadeL = localStorage.getItem('cidade')


    let token = localStorage.getItem('token')
    let header = 'inicial'
    if (token) {
        header = 'logado'
    }

    const history = useHistory()

    const [uf, setUf] = useState('')
    const [cidade, setcidade] = useState('')
    const [nome, setNome] = useState('')
    const [categoria, setCategoria] = useState('')



    useEffect(() => {
        if (ufL !== null) {
            setUf(ufL.toUpperCase())

        }
        if (cidadeL !== null) {
            setcidade(cidadeL)

        }
        // Tentativa de fazer ele carregar automaticamente ao abrir a pagina
        /*
        if(ufL || cidadeL) {
            async function primeiroCarregamento() {
                try {
                    const response = await api.post('buscar/estabelecimentos_pertos', { ufL, cidadeL})
                    setEstabelecimentos(response.data)
                    console.log(estabelecimentos)
        
                } catch (error) {
                    console.log(error)
                }
            }
            primeiroCarregamento()
        }
        */

    }, [ufL, cidadeL])

    

    async function handleBusca(e) {
        e.preventDefault()
        if(categoria === categoria) {
            setCategoria(undefined)
        }

        localStorage.setItem('uf', uf)
        localStorage.setItem('cidade', cidade)
        localStorage.setItem('categoria', categoria)
        localStorage.setItem('nome', nome)
        try {
            const response = await api.post('buscar/estabelecimentos_pertos', { uf, cidade, categoria, nome })
            setEstabelecimentos(response.data)
            console.log(estabelecimentos)

        } catch (error) {
            console.log(error)
        }



    }
    // converter image para 480x270
    const teste = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]


    return (
        <div>

            <Headers tipo={header}></Headers>
            <br />

            <div id="corpo">
                <div id="propaganda">

                </div>
                <div className="container" id="camposBusca">
                    <p id="pBusca">Busque estabelecimentos na sua cidade por nome ou categoria</p>
                    <form onSubmit={handleBusca} className="form-inline">
                        <div className="form-group">
                            <input className="form-control" type="text" onChange={e => setUf(e.target.value.toUpperCase())} value={uf} maxLength="2" id="ufBusca" placeholder="UF" />
                        </div>
                        <div className="form-group">
                            <input className="form-control" type="text" onChange={e => setcidade(e.target.value.toLowerCase())} value={utils.firstLetterUpper(cidade)} id="cidadeBusca" placeholder="Cidade" />
                        </div>
                        <div className="form-group">
                            <input className="form-control" type="text" onChange={e => setNome(e.target.value)} value={nome} id="nomeBusca" placeholder="Nome" />
                        </div>
                        <div className="form-group">
                            <div className="form-Control">
                                <Categoria id="catBusca" aoMudar={setCategoria} ></Categoria>
                            </div>
                        </div>
                        <button type='submit' className='btn btn-default' id='buttonBusca' type='submit'>Buscar</button>

                    </form>
                </div>
                <div className='container' id='firstContainer'>
                    <div className='row'>

                        {estabelecimentos.map(estabelecimento => (
                            <div key={estabelecimento.apelido} className='col-sm-4'>
                                <div className='panel panel-primary'>
                                    <div className="panel-heading text-center">{estabelecimento.nome}</div>
                                    <div className="panel-body"><img className="objetoImage" src={lua} className="img-responsive" style={{ width: '100%' }} /></div>
                                </div>
                            </div>
                        ))}



                    </div>
                </div>
                <br />

            </div>





        </div>

    )




}
// Um desse dentro de 'row' equivale a um estabelecimento
/*
<div className='col-sm-4'>
                            <div className='panel panel-primary'>
                                <div className="panel-heading">Nome</div>
                                <div className="panel-body"><img src="https://placehold.it/150x80?text=IMAGE" className="img-responsive" style={{ width: '100%' }} /></div>
                            </div>
                        </div>
*/