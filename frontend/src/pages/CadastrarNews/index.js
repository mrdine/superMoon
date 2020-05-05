import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Headers from '../../utils/components/header'


import api from '../../services/api'

import utils from '../../utils'
import './styles.css'

import assetsUtils from '../../assets/assetsUtils'

export default function CadastrarNews() {
    const history = useHistory()
    const email = localStorage.getItem('email')
    const token = localStorage.getItem('token')
    if (!token) {
        history.push('/login')
    }

    const [titulo, setTitulo] = useState('')
    const [conteudo, setConteudo] = useState('')

    async function handleNovaNews() {
        const data = {
            titulo,
            conteudo
        }
        try {
            api.post('perfil/news', data, {
                headers: {
                    Authorization: token
                },
                data
            }).then(
                history.push('/perfil')

            )
        } catch (error) {
            alert('Não foi possível adicionar a notícia, por favor tente novamente')
            return
        }
        



    }


    return (
        <div>
            <Headers tipo="logado"></Headers>
            <br />

            <div class="container-fluid text-center">
                <div class="row content">
                    <div id="side1" class="col-sm-2 ">

                    </div>
                    <div id="formCNews" class="col-sm-7 panel text-center">
                        <h4>Adicionar Nova Notícia</h4>
                        <form>
                            <div class="form-group">
                                <label for="titleCN">Título</label>
                                <input value={titulo} onChange={(e) => {setTitulo(e.target.value)}} type="text" class="form-control" id="titleCN" />
                            </div>
                            <div class="form-group">
                                <label for="conteudoCN">Conteúdo</label>
                                <textarea value={conteudo} onChange={(e) => {setConteudo(e.target.value)}} class="form-control" rows="5" id="conteudoCN"></textarea>
                            </div>
                            <button onClick={handleNovaNews} style={{marginBottom: '20px'}} type="submit" class="btn btn-default">Adicionar</button>
                        </form>
                    </div>
                    <div id="side2" class="col-sm-2 ">

                    </div>
                </div>
            </div>

        </div>
    )
}