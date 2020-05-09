import React, { useState, useEffect, Fragment } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Headers from '../../utils/components/header'
import InfiniteScroll from 'react-infinite-scroll-component'
import Galeria from '../../utils/components/galeria'
import MaskedInput from 'react-text-mask'
import Categoria from '../../utils/components/categoria'



import api from '../../services/api'



import utils from '../../utils'
import './styles.css'






export default function EditarMeuPerfil() {
    const history = useHistory()
    const token = localStorage.getItem('token')

    if (!token) {
        history.push('/conta/login')
    }

    let entrega = ''
    let endereco = {}
    let perfilImagem = ''


    let nomeAux = ''
    let categoriaAux = ''

    const [telefoneAux, setTelefoneAux] = useState('')
    const [descricaoAux, setDescricaoAux] = useState('')

    const [perfilFoto, setPerfilFoto] = useState(null)
    const [fotosG, setFotosG] = useState(null)

    const [meusDados, setMeusDados] = useState([])
    const [nome, setNome] = useState('')
    const [descricao, setDescricao] = useState('')
    const [delivery, setDelivery] = useState(true)
    const [telefone, setTelefone] = useState('')
    const [categoria, setCategoria] = useState('')

    const [uf, setUf] = useState('')
    const [cidade, setCidade] = useState('')
    const [bairro, setBairro] = useState('')
    const [rua, setRua] = useState('')
    const [numero, setNumero] = useState('')
    const [complemento, setComplemento] = useState('')

    const [senhaAtual, setSenhaAtual] = useState('')
    const [novaSenha, setNovaSenha] = useState('')
    const [novaSenha2, setNovaSenha2] = useState('')

    if (meusDados.myPerfilImage) {
        perfilImagem = meusDados.myPerfilImage.imagem
        endereco = meusDados.myEndereco

        nomeAux = meusDados.nome
        categoriaAux = meusDados.categoria

    }




    useEffect(() => {
        api.get('/perfil/meu_perfil', {
            headers: {
                Authorization: token
            }
        })
            .then(async function (response) {
                setMeusDados(response.data)
                setNome(response.data.nome)
                setTelefone(meusDados.telefone)
                setTelefoneAux(response.data.telefone)
                setDescricaoAux(response.data.myPerfil.descricao)
                setDelivery(response.data.delivery)
                setUf(response.data.myEndereco.uf)
                setCidade(response.data.myEndereco.cidade)
                setBairro(response.data.myEndereco.bairro)
                setRua(response.data.myEndereco.rua)
                setNumero(response.data.myEndereco.numero)
                setComplemento(response.data.myEndereco.complemento)
                console.log('Dentro da promisse', meusDados)

            })
            .catch(function (error) {
                console.log(error)
            })


    }, [token])

    async function handleMudarFotoPerfil(e) {
        e.preventDefault()

        console.log(perfilFoto)
        if (!perfilFoto) {
            alert('Escolha uma imagem antes de enviar')
            return
        } else {
            let parts = perfilFoto.name.split('.')
            if (parts[1] === 'jpg' || parts[1] === 'png') {
                const data = new FormData()
                data.append('file', perfilFoto)
                //alterar imagem
                const response = await api.post('perfil/editar_perfil_image', {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: token,
                    },
                    data

                })
                console.log(response)
                window.location.reload(false);
            } else {
                alert('Escolha somente imagens com extensão.png ou .jpg por favor')
                console.log(parts[1])
                return
            }
        }
    }

    function alterarCategoria(categoria) {
        categoriaAux = categoria
    }
    function alterarNome(nome) {
        nomeAux = nome
    }


    async function handleAlterarDados() {
        setDescricao(descricaoAux)
        if (categoria === '') {
            setCategoria(categoriaAux)
        }
        if (categoria === 'Categoria') {
            alert('Escolha uma categoria')
            return
        }
        if (telefone === undefined) {
            if (telefoneAux !== '') {
                setTelefone(telefoneAux)
            } else {
                setTelefone(meusDados.telefone)
            }
            if (delivery === null || delivery === undefined) {
                setDelivery(meusDados.myPerfil.delivery)
            }
            alert('Para confirmar clique novamente no botão "Alterar Dados"')
            return
        }


        const dadosE = {
            nome,
            descricao,
            categoria,
            telefone,
            delivery,
            uf,
            cidade,
            bairro,
            rua,
            numero,
            complemento
        }
        if (dadosE.descricao === undefined || dadosE.descricao === '') {
            dadosE.descricao = meusDados.myPerfil.descricao
        }

        try {
            const response = api.post('/perfil/editar', dadosE, {
                headers: {
                    Authorization: token
                },
                dadosE
            })
            console.log(dadosE)
            window.location.reload(false)
        } catch (error) {
            console.log(error)
            alert('Não foi possível alterar dados, por favor tente novamente')
        }

    }

    async function handleTrocarSenha() {
        if (senhaAtual === '' && novaSenha === '' && novaSenha2 === '') {
            alert('Digite sua senha atual, a nova senha e a confirme para trocar')
            return
        }
        if (senhaAtual === '') {
            alert('Digite sua senha atual antes de prosseguir')
            return
        }
        if (novaSenha !== novaSenha2) {
            alert('As senhas não conferem')
            return
        }
        if (senhaAtual !== '' && novaSenha === novaSenha2 && novaSenha !== '') {
            try {
                const response = await api.post('/trocar_senha', { senhaAtual, novaSenha, email: meusDados.email }, {
                    headers: {
                        Authorization: token
                    },
                    senhaAtual, novaSenha, email: meusDados.email
                })
                alert('Senha trocada com sucesso')
                return
            } catch (error) {
                console.log(error)
                alert('A senha atual inserida está incorreta')
                return
            }
        }
        alert('Por favor, digite uma senha válida')

    }

    async function handleAdicionarFotosG() {
        if (fotosG === null) {
            alert('Selecione ao menos uma foto')
            return
        } else {
            console.log(fotosG)
            const data = new FormData()
            for (let counter = 0; counter < fotosG.length; counter++) {
                console.log(fotosG[`${counter}`])
                // verificar se são imagens
                let parts = fotosG[`${counter}`].name.split('.')
                if (parts[1] !== 'jpg' && parts[1] !== 'png') {
                    alert('Insira somente imagens com extensão .png ou .jpg')
                    return
                }

                data.append('file', fotosG[`${counter}`])
            }

            // enviar
            const response = await api.post('/perfil/adicionar_fotos', data, {
                headers: {
                    Authorization: token,
                },
            })

    

            console.log(response.statusText)
            history.push('/conta/perfil')

        }
    }


    return (
        <div>
            <Headers tipo="logado"></Headers>
            <br />

            <div id="editarPerfilContainer" className="container text-center">
                <div className="row">
                    <div className="col-sm-4 well">
                        <div className="well">
                            <p><Link to='/conta/perfil/editar'><a>Alterar imagem de perfil</a></Link>
                            </p>
                            <form onSubmit={(e) => { handleMudarFotoPerfil(e) }} enctype="multipart/form-data">
                                <div id='alterarFotoPerfil' class="form-group">
                                    <input type="file" class="form-control form-control-sm" onChange={(e) => { setPerfilFoto(e.target.files[0]) }} id="exampleFormControlFile1" />
                                    <button id="botaoPerfilFoto" class="btn btn-primary mb-2">Enviar Foto</button>
                                </div>
                            </form>

                            <img src={`data:image${meusDados.apelido}/jpeg;base64,${perfilImagem}`} className="img.fluid" height="auto" width="100%" alt="Avatar" />
                        </div>

                        <div class="alert alert-success fade in">
                            <a href="#" class="close" data-dismiss="alert" aria-label="close">×</a>
                            <p><strong>Vai adicionar uma foto?</strong></p>
                            Para um melhor resultado na sua foto de perfil e na sua galeria, escolha imagens HD (1280 x 720) ou full HD (1920 x 1080).
                        </div>

                        <div className="well">
                            <p><a style={{ textDecoration: 'none' }}>Faz Entrega?</a></p>




                            {[0].map(elemento => {
                                if (meusDados.myPerfil) {
                                    if (`${meusDados.myPerfil.delivery}` === 'true') {
                                        return (
                                            <div>
                                                <div class="form-check form-check-inline">
                                                    <input class="form-check-input" type="radio" onClick={(e) => { setDelivery(e.target.value) }} name="inlineRadioOptions" id="inlineRadio1" value={true} checked />
                                                    <label style={{ marginLeft: '5px' }} class="form-check-label" for="inlineRadio1"> Sim</label>
                                                </div>
                                                <div class="form-check form-check-inline">
                                                    <input class="form-check-input" type="radio" onClick={(e) => { setDelivery(e.target.value) }} name="inlineRadioOptions" id="inlineRadio2" value={false} />
                                                    <label style={{ marginLeft: '5px' }} class="form-check-label" for="inlineRadio2"> Não</label>
                                                </div>
                                            </div>

                                        )
                                    } else if (`${meusDados.myPerfil.delivery}` === 'false') {
                                        return (
                                            <div>
                                                <div class="form-check form-check-inline">
                                                    <input class="form-check-input" type="radio" onClick={(e) => { setDelivery(e.target.value) }} name="inlineRadioOptions" id="inlineRadio1" value={true} />
                                                    <label style={{ marginLeft: '5px' }} class="form-check-label" for="inlineRadio1"> Sim</label>
                                                </div>
                                                <div class="form-check form-check-inline">
                                                    <input class="form-check-input" type="radio" onClick={(e) => { setDelivery(e.target.value) }} name="inlineRadioOptions" id="inlineRadio2" value={false} checked />
                                                    <label style={{ marginLeft: '5px' }} class="form-check-label" for="inlineRadio2"> Não</label>
                                                </div>
                                            </div>

                                        )
                                    } else {
                                        return (
                                            <div>
                                                <div class="form-check form-check-inline">
                                                    <input class="form-check-input" type="radio" onClick={(e) => { setDelivery(e.target.value) }} name="inlineRadioOptions" id="inlineRadio1" value={true} />
                                                    <label style={{ marginLeft: '5px' }} class="form-check-label" for="inlineRadio1"> Sim</label>
                                                </div>
                                                <div class="form-check form-check-inline">
                                                    <input class="form-check-input" type="radio" onClick={(e) => { setDelivery(e.target.value) }} name="inlineRadioOptions" id="inlineRadio2" value={false} />
                                                    <label style={{ marginLeft: '5px' }} class="form-check-label" for="inlineRadio2"> Não</label>
                                                </div>
                                            </div>

                                        )
                                    }
                                } else {
                                    return ('')
                                }
                            })}




                        </div>

                        <div className="well">
                            <p><a style={{ textDecoration: 'none' }}>Alterar Telefone</a></p>
                            <form class="form-inline">
                                <div class="form-group">
                                    <p>{meusDados.telefone}</p>
                                    <input type="tel" class='form-control' maxlength="15" placeholder={`(XX) XXXXX-XXXX`} value={telefoneAux} onChange={(e) => { setTelefoneAux(e.target.value) }} name="telefone" pattern="\([0-9]{2}\) [0-9]{4,6}-[0-9]{3,4}$" />
                                </div>
                            </form>
                        </div>

                        <div className="well">
                            <p><a style={{ textDecoration: 'none' }}>Endereço</a></p>
                            <p>{`UF, Cidade, Bairro, Rua, Numero, Complemento`}</p>

                            <form class="form-inline">
                                <div class="form-group">
                                    <input maxLength='2' style={{ width: '45px' }} onChange={(e) => {
                                        endereco.uf = e.target.value.toUpperCase()
                                        setUf(e.target.value.toUpperCase())
                                    }} value={endereco.uf} class="form-control" id="uf" placeholder="UF" name="uf" />
                                </div>
                                <div class="form-group">
                                    <input class="form-control" onChange={(e) => {
                                        endereco.cidade = e.target.value.toLowerCase()
                                        setCidade(e.target.value.toLowerCase())
                                    }} value={utils.firstLetterUpper(endereco.cidade)} id="cidade" placeholder="Cidade" name='cidade' />
                                </div>
                                <div class="form-group">
                                    <input style={{ marginRight: '10px', marginTop: '5px' }} class="form-control" onChange={(e) => {
                                        endereco.bairro = e.target.value
                                        setBairro(e.target.value)
                                    }} value={endereco.bairro} id="bairo" placeholder="Bairro" name='bairro' />
                                </div>
                                <div class="form-group">
                                    <input style={{ marginTop: '5px' }} class="form-control" onChange={(e) => {
                                        endereco.rua = e.target.value
                                        setRua(e.target.value)
                                    }} value={endereco.rua} id="rua" placeholder="Rua" name='rua' />
                                </div>
                                <div class="form-group">
                                    <input type='number' style={{ width: '80px', marginRight: '10px', marginTop: '5px' }} class="form-control" onChange={(e) => {
                                        endereco.numero = e.target.value
                                        setNumero(e.target.value)
                                    }} value={endereco.numero} id="numero" placeholder="Numero" name='numero' />
                                </div>
                                <div class="form-group">
                                    <input style={{ width: '100%', marginTop: '5px' }} class="form-control" onChange={(e) => {
                                        endereco.complemento = e.target.value
                                        setComplemento(e.target.value)
                                    }} value={endereco.complemento} id="complemento" placeholder="Complemento" name='complemento' />
                                </div>
                            </form>

                        </div>



                    </div>
                    <div className="col-sm-7" style={{ marginLeft: '10px', backgroundColor: 'white' }}>
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="panel">
                                    <form className='form-inline'>
                                        <div class="form-group">
                                            <label htmlFor="nome">Nome do Estabelecimento</label>
                                            <input style={{ width: '100%' }} value={nome} onChange={(e) => {
                                                setNome(e.target.value)
                                            }} class="form-control" id="nome" placeholder="Nome" name="nome" />
                                        </div>
                                        <div class="form-group">
                                            <label htmlFor="categoriaEditar">{`Categoria atual: ${categoriaAux}`}</label>
                                            <Categoria id="categoriaEditar" aoMudar={setCategoria}></Categoria>
                                        </div>
                                    </form>
                                    <div class="form-group">
                                        <label htmlFor="descricaoEditar">{`Descrição`}</label>
                                        <textarea class="form-control" rows="3" style={{ width: '100%' }} value={descricaoAux} onChange={(e) => { setDescricaoAux(e.target.value) }} class="form-control" id="descricaoEditar" placeholder="Descrição do Estabelecimento" name="descricao" />
                                    </div>
                                    <button id="botaoPerfilDados" onClick={handleAlterarDados} class="btn btn-primary mb-2">Alterar Dados</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-7" style={{ marginLeft: '10px', marginTop: '20px', backgroundColor: 'white' }}>
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="panel">
                                    <form className='form-inline'>
                                        <h4>Alterar Senha</h4>

                                        <div class="form-group">
                                            <label htmlFor="senhaAtual">Senha atual</label>
                                            <input type='password' style={{ width: '100%' }} value={senhaAtual} onChange={(e) => {
                                                setSenhaAtual(e.target.value)
                                            }} class="form-control" id="senhaAtual" />
                                        </div>
                                        <div class="form-group">
                                            <label htmlFor="novaSenha">Nova Senha</label>
                                            <input type='password' style={{ width: '100%', marginLeft: '5px' }} value={novaSenha} onChange={(e) => {
                                                setNovaSenha(e.target.value)
                                            }} class="form-control" id="novaSenha" />
                                        </div>
                                        <div class="form-group">
                                            <label htmlFor="novaSenha2">Confirmar Nova Senha</label>
                                            <input type='password' style={{ width: '100%', marginLeft: '5px' }} value={novaSenha2} onChange={(e) => {
                                                setNovaSenha2(e.target.value)
                                            }} class="form-control" id="novaSenha2" />
                                        </div>

                                    </form>
                                    <button style={{ marginTop: '5px' }} id="botaoTrocarSenha" onClick={handleTrocarSenha} class="btn btn-primary mb-2">Trocar Senha</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-7" style={{ marginLeft: '10px', marginTop: '20px', backgroundColor: 'white' }}>
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="panel">
                                    <form className='form-inline' enctype="multipart/form-data">
                                        <h4>Adicionar fotos à sua galeria de imagens</h4>

                                        <div id='alterarFotoPerfil' class="form-group">
                                            <input type="file" class="form-control form-control-sm" onChange={(e) => { setFotosG(e.target.files) }} id="exampleFormControlFile1" multiple />
                                        </div>
                                    </form>
                                    <button style={{ marginTop: '5px' }} id="botaoAdicionarDados" onClick={handleAdicionarFotosG} class="btn btn-primary mb-2">Enviar Fotos</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>







        </div>
    )
}