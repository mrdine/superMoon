import React, { useState, useEffect, Fragment } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Headers from '../../utils/components/header'
import InfiniteScroll from 'react-infinite-scroll-component'
import Galeria from '../../utils/components/galeria'
import Delivery from '../../utils/components/delivery'
import { useParams } from 'react-router-dom'

import api from '../../services/api'



import utils from '../../utils'
import './styles.css'

export default function VisitarPerfil() {
    const { apelido } = useParams()
    let tipo = 'inicial'
    const token = localStorage.getItem('token')
    if (token) {
        tipo = 'logado'
    }


    // Cópia da página 'meu perfil'
    const [meusDados, setMeusDados] = useState({})
    const [myNews, setMyNews] = useState([])
    const [myFotos, setMyFotos] = useState([])

    let imagePerfil = ''
    let entrega
    let endereco = { uf: '', cidade: '', bairro: '', rua: '', numero: '', complemento: '' }
    let nome = ''
    let descricao = ''
    let categoria = ''
    let telefone = ''
    const [deliveryAux, setDeliveryAux] = useState(false)

    // tem que ser dentro do if para ser feito após carregar os dados
    if (meusDados.myPerfilImage) {
        // imagem de perfil
        imagePerfil = meusDados.myPerfilImage.imagem
        // se faz entrega
        if (meusDados.myPerfil.delivery === true) {
            entrega = <span className="label label-success">Sim</span>
        } else {
            entrega = <span className="label label-danger">Não</span>
        }

        endereco = meusDados.myEndereco
        if (endereco.complemento === null) {
            endereco.complemento = ''
        }

        nome = meusDados.nome
        descricao = meusDados.myPerfil.descricao
        categoria = meusDados.categoria
        telefone = meusDados.telefone
        if (telefone === '') {
            telefone = 'Não inserido'
        }

    }


    useEffect(() => {
        api.get(`/${apelido}`)
            .then(async function (response) {
                setMeusDados(response.data)
                setMyFotos(response.data.myImages)

                console.log('Dentro da promisse', meusDados)
                console.log('Dentro da promisse', myFotos)


            })
            .catch(function (error) {
                console.log(error)
            })

        api.get(`/perfil/news/${apelido}`)
            .then(function (response) {
                setMyNews(response.data)
            })
            .catch(function (error) {
                console.log(error);
            })


    }, [apelido])


    return (
        <div>
            <Headers tipo={tipo}></Headers>
            <br />
            <div id="corpoMeuPerfil" className="container text-center">
        <div className="row">
          <div className="col-sm-3 well">
            <div className="well">
              <img src={`data:image${meusDados.apelido}/jpeg;base64,${imagePerfil}`} className="img.fluid" height="auto" width="100%" alt="Avatar" />
            </div>
            <div className="well">
              <p><a style={{ textDecoration: 'none' }}>Faz Entrega?</a></p>
              <p>
                {[0].map((elemento) => {
                  if (meusDados.myPerfil) {
                    if (`${meusDados.myPerfil.delivery}` === 'true') {
                      return (<span className="label label-success">Sim</span>)
                    } else {
                      return (<span className="label label-danger">Não</span>)
                    }
                  } else {
                    return (<span className="label label-danger">Não</span>)
                  }
                })}
              </p>
            </div>
            <div className="well">
              <p><a style={{ textDecoration: 'none' }}>Categoria</a></p>
              <p>
                {categoria}
              </p>
            </div>
            <div className="well">
              <p><a style={{ textDecoration: 'none' }}>Telefone</a></p>
              <p>{`${telefone}`}</p>
            </div>
            <div className="well">
              <p><a style={{ textDecoration: 'none' }}>Endereço</a></p>
              <p>{`${endereco.uf}, ${utils.firstLetterUpper(endereco.cidade)}, ${endereco.bairro}, ${endereco.rua}, ${endereco.numero}. ${endereco.complemento}`}</p>
            </div>



          </div>
          <div className="col-sm-7">

            <div className="row">
              <div className="col-sm-12">
                <div className="panel panel-default text-left">
                  <div className="panel-body">
                    <h4 id="nome" contenteditable="true">{nome}</h4>
                    <h5 id="descricao" contenteditable="true">{descricao}</h5>
                  </div>
                </div>
              </div>
            </div>

            <div id="galeriaImagens">
              <div className="row" >
                <div className="col-sm-12">



                  <Galeria tipo='visitante' fotos={myFotos}>

                  </Galeria>




                </div>
              </div>
            </div>

            <div id="news">
              <br></br>
              <InfiniteScroll dataLength={myNews.length} //This is important field to render the next data
                next={() => { return }}
                hasMore={false}
                loader={<h4>Carregando</h4>}
                endMessage={
                  ''
                }>

                {myNews.map((theNew) => {

                  //2020-05-03T01:56:14.605Z
                  let dia = theNew.data.substring(8, 10)
                  let mes = theNew.data.substring(5, 7)
                  let ano = theNew.data.substring(0, 4)


                  return (
                    <div key={theNew.id} className="row">
                      <div className="col-sm-12">
                        <div id="newsPerfil" className="well">

                          <div className="row">
                            <div className="col-sm-11">
                              <p className="pull-left">{`${dia}/${mes}/${ano}`}</p>
                            </div>
                            
                          </div>
                          <div className="row">
                            <h4>{theNew.titulo}</h4>
                          </div>

                          <div className="row">
                            <p>{theNew.conteudo}</p>
                          </div>

                        </div>
                      </div>
                    </div>
                  )
                })}
              </InfiniteScroll>



            </div>

          </div>

          <div id="meuAnuncio" className="col-sm-2 well">
            <div className="thumbnail">
              <p>Upcoming Events:</p>
              <img src="paris.jpg" alt="Paris" width="400" height="300"></img>
              <p><strong>Paris</strong></p>
              <p>Fri. 27 November 2015</p>

            </div>

            <div id="anuncioExtra1" className="well">
              <p>ADS</p>
            </div>
            <div id="anuncioExtra2" className="well">
              <p>ADS</p>
            </div>
          </div>
        </div>
      </div>
        </div>
    )
}