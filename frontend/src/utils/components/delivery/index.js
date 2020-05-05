import React, { useState, useEffect, Fragment } from 'react'
import { Link, useHistory } from 'react-router-dom'


import api from '../../../services/api'





export default function Delivery() {
    const [faz, setFaz] = useState(Boolean)
    const [span, setSpan] = useState(<span/>)
    const token = localStorage.getItem('token')
    
    api.get('/perfil/meu_perfil', {
        headers: {
          Authorization: token
        }
      })
        .then(async function (response) {
          setFaz(response.data.myPerfil.delivery)
          if(response.data.myPerfil.delivery === true) {
              alert('as')
              setSpan(<span className="label label-success">Sim</span>)
          } else if(response.data.myPerfil.delivery === false) {
              setSpan(<span className="label label-danger">Não</span>)
          } else {setSpan(span)}
        })
        .catch(function (error) {
          console.log(error)
        })


    


    return(span)
}
