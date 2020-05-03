import React, { useState,component } from 'react'
import ReactDom from 'react-dom'

//https://github.com/rcaferati/react-awesome-slider/
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';


import semImagens from '../../../assets/semImagens.png' 

import './styles.css'
import api from '../../../services/api';

const Galeria = props => {

    // meuperfil ou visitante
    const tipo = props.tipo
    const email = props.email
    //cada foto é um {id, imagem, perfil}
    const fotos = props.fotos


    let fotosSemOPrimeiro = []
    if (fotos.length > 1) {
        fotosSemOPrimeiro = fotos.filter((elemento, index) => {
            return index !== 0
        })
    }

    let lixeira = ''
    if (tipo === 'meuperfil') {
        lixeira = <p className="pull-right"><span onClick={() => { handleDelete() }} className="glyphicon glyphicon-trash"></span></p>
    }
    const handleDelete = () => {
        // deletar imagem
    }

    // galeria
    if (fotos.length === 0) {
        return (
            <img src={semImagens} alt="Sem imagens" width="100%"/>
        )
    } else {
        return(
            <AwesomeSlider>
                {fotos.map((foto, index) => {
                    return(
                        <div key={index} data-src={`data:image${index}/jpeg;base64,${foto.imagem}`}/>
                    )
                })}
            </AwesomeSlider>
        )
    }



}



export default Galeria