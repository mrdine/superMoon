import React, { useState, component } from 'react'
import ReactDom from 'react-dom'
import { useHistory } from 'react-router-dom'

//https://github.com/rcaferati/react-awesome-slider/
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';


import semImagens from '../../../assets/semImagens.png'

import './styles.css'
import api from '../../../services/api';

const Galeria = props => {

    // meuperfil ou visitante
    const tipo = props.tipo
    //cada foto é um {id, imagem, perfil}
    let fotos = props.fotos

    const token = localStorage.getItem('token')

    const history = useHistory()

    let fotosSemOPrimeiro = []
    if (fotos.length > 1) {
        fotosSemOPrimeiro = fotos.filter((elemento, index) => {
            return index !== 0
        })
    }

    let lixeira1 = ''
    let lixeira2 = ''
    let arrayAux = [0]
    if (tipo === 'meuperfil') {
        
        
    }
    const handleDelete = async (id) => {
        // deletar imagem
        try {
            await api.delete(`perfil/deletar_foto/${id}`, {
              headers: {
                Authorization: token
              }
            })
      
            fotos = fotos.filter(foto => foto.id !== id)
            window.location.reload(false);

          } catch (error) {
            console.log(error)
            alert('Erro ao deletar imagem, tente novamente')
          }
    }

    // galeria
    if (fotos.length === 0) {
        return (
            <img src={semImagens} alt="Sem imagens" width="100%" />
        )
    } else {
        return (
            <div id="myCarousel" style={{ width: '100%' }} class="carousel slide" data-ride="carousel">

                <ol class="carousel-indicators">
                    {fotos.map((foto, index) => {
                        if(index === 0) {
                            return(
                                <li key={index} data-target="#myCarousel" data-slide-to="0" class="active"></li>
                                
                            )
                        }
                        return (
                            <li key={index} data-target="#myCarousel" data-slide-to={`${index}`} ></li>
                        )
                    })}
                </ol>

                <div class="carousel-inner" >
                    <div class="item active">
                        {arrayAux.map(() => {
                            if(tipo=='meuperfil') {
                                return(<p id="lixeira" className="pull-center"><span onClick={() => { handleDelete(fotos[0].id) }} className="glyphicon glyphicon-trash"></span></p>)
                            }
                            return('')
                        })}
                        <img src={`data:image${fotos[0].id}/jpeg;base64,${fotos[0].imagem}`}  style={{ width: '100%' }} />
                    </div>

                    {fotosSemOPrimeiro.map((foto, index) => {
                        return(
                            <div class="item">
                                {arrayAux.map(() => {
                            if(tipo=='meuperfil') {
                                return(<p id="lixeira" className="pull-center"><span onClick={() => { handleDelete(foto.id) }} className="glyphicon glyphicon-trash"></span></p>)
                            }
                            return('')
                        })}
                                <img src={`data:image${foto.id}/jpeg;base64,${foto.imagem}`}  style={{ width: '100%' }} />
                            </div>
                        )
                    })}

                </div>

                <a class="left carousel-control" href="#myCarousel" data-slide="prev">
                    <span class="glyphicon glyphicon-chevron-left"></span>
                    <span class="sr-only">Previous</span>
                </a>
                <a class="right carousel-control" href="#myCarousel" data-slide="next">
                    <span class="glyphicon glyphicon-chevron-right"></span>
                    <span class="sr-only">Next</span>
                </a>
            </div>
        )
    }



}



export default Galeria


/*

<div id="myCarousel" style={{ width: '100%' }} class="carousel slide" data-ride="carousel">

                <ol class="carousel-indicators">
                    <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
                    <li data-target="#myCarousel" data-slide-to="1"></li>
                    <li data-target="#myCarousel" data-slide-to="2"></li>
                    <li data-target="#myCarousel" data-slide-to="3"></li>
                </ol>

                <div class="carousel-inner" >
                    <div class="item active">
                        <img src={logo} alt="Los Angeles" style={{ width: '100%' }} />
                    </div>

                    <div class="item">
                        <img src={`data:image${meusDados.apelido}/jpeg;base64,${imagePerfil}`} alt="Chicago" style={{ width: '100%' }} />
                    </div>

                    <div class="item">
                        <img src={sem} alt="New york" style={{ width: '100%' }} />
                    </div>

                    <div class="item">
                        <img src={fhd} alt="New york" style={{ width: '100%' }} />
                    </div>
                </div>

                <a class="left carousel-control" href="#myCarousel" data-slide="prev">
                    <span class="glyphicon glyphicon-chevron-left"></span>
                    <span class="sr-only">Previous</span>
                </a>
                <a class="right carousel-control" href="#myCarousel" data-slide="next">
                    <span class="glyphicon glyphicon-chevron-right"></span>
                    <span class="sr-only">Next</span>
                </a>
            </div>


*/