import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Headers from '../../utils/components/header'
import InfiniteScroll from 'react-infinite-scroll-component'

import api from '../../services/api'

import utils from '../../utils'
import './styles.css'

export default function MeuPerfil() {
  const [meusDados, setMeusDados] = useState({})
  const [myNews, setMyNews] = useState([])


  const token = localStorage.getItem('token')
  const email = localStorage.getItem('email')

  const history = useHistory()

  let imagePerfil = ''
  let entrega = <span className="label label-danger">Não</span>
  let endereco = {}
  let nome = ''
  let descricao = ''
  let categoria = ''



  // tem que ser dentro do if para ser feito após carregar os dados
  if (meusDados.myPerfilImage) {
    // imagem de perfil
    imagePerfil = meusDados.myPerfilImage.imagem
    // se faz entrega
    if (meusDados.myPerfil.delivery) {
      entrega = <span className="label label-success">Sim</span>
    }

    endereco = meusDados.myEndereco
    if (endereco.complemento === null) {
      endereco.complemento = ''
    }

    nome = meusDados.nome
    descricao = meusDados.descricao
    categoria = meusDados.categoria

  }

  if (!token) {
    history.push('/')
  }

  useEffect(() => {

    api.get('/perfil/meu_perfil', {
      headers: {
        Authorization: token
      }
    })
      .then(function (response) {
        setMeusDados(response.data)
        console.log(meusDados)
      })
      .catch(function (error) {
        console.log(error)
      })

    api.get('/perfil/my_news', {
      headers: {
        Authorization: token
      },
      params: {
        email
      }
    })
      .then(function (response) {
        setMyNews(response.data)
      })
      .catch(function (error) {
        console.log(error);
      })


  }, [token])

  async function handleDeleteNews(id) {
    try {
      await api.delete(`perfil/deletar_news/${id}`, {
        headers: {
          Authorization: token
        }
      })

      setMyNews(myNews.filter(theNew => theNew.id !== id))
    } catch (error) {
      console.log(error)
      alert('Erro ao deletar caso, tente novamente')
    }
  }

  console.log('Dados', meusDados)
  console.log('News', myNews)



  return (
    <div>
      <Headers tipo="logado"></Headers>
      <br />

      <div id="corpoMeuPerfil" className="container text-center">
        <div className="row">
          <div className="col-sm-3 well">
            <div className="well">
              <p><a href="#">Editar Perfil</a></p>
              <img src={`data:image${meusDados.apelido}/jpeg;base64,${imagePerfil}`} className="img.fluid" height="auto" width="100%" alt="Avatar" />
            </div>
            <div className="well">
              <p><a href="#">Faz Entrega?</a></p>
              <p>
                {entrega}
              </p>
            </div>
            <div className="well">
              <p><a >Categoria</a></p>
              <p>
                {categoria}
              </p>
            </div>
            <div className="well">
              <p><a href="#">Endereço</a></p>
              <p>{`${endereco.uf}, ${endereco.cidade}, ${endereco.bairro}, ${endereco.rua}, ${endereco.numero}. ${endereco.complemento}`}</p>
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

            <div id="news">

              <InfiniteScroll dataLength={myNews.length} //This is important field to render the next data
                next={() => { return }}
                hasMore={false}
                loader={<h4>Carregando</h4>}
                endMessage={
                  ''
                }>

                {myNews.map((theNew) => {

                  //2020-05-03T01:56:14.605Z
                  let dia = theNew.data.substring(8,10)
                  let mes = theNew.data.substring(5,7)
                  let ano = theNew.data.substring(0,4)


                  return (
                    <div key={theNew.id} className="row">
                      <div className="col-sm-12">
                        <div id="newsPerfil" className="well">

                          <div className="row">
                            <div className="col-sm-11">
                  <p className="pull-left">{`${dia}/${mes}/${ano}`}</p>
                            </div>
                            <div className="col-sm-1">
                              <p className="pull-right"><span onClick={() => {handleDeleteNews(theNew.id)}} className="glyphicon glyphicon-trash"></span></p>
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