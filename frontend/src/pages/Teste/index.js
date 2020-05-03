import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

import api from '../../services/api'
import Headers from '../../utils/components/header'

// basta importar o css que já se aplica
import './styles.css'

//import logoImg from '../../assets/logo.svg'
import rocket from '../../assets/rocket.png'

import utils from '../../utils'

import Galeria from '../../utils/components/galeria'

export default function Teste() {

    const meuarray = []
    return(
        <div>
            <Headers tipo='inicial'></Headers>
            <br/>

            <Galeria tipo='meuperfil' fotos={meuarray}>

            </Galeria>
        </div>
        
    )
}