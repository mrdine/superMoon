import React, { Component } from 'react';
import { Link, useHistory } from 'react-router-dom'
import { FiLogIn } from 'react-icons/fi'
import ReactDom from 'react-dom';

import lua from '../../../assets/solua.png'

import './styles.css'


const Headers = props => {

  const handleSair = () =>{
    localStorage.removeItem('token')
    localStorage.removeItem('email')
  }


  const tipo = props.tipo

  if (tipo === 'inicial') {
    return (
      <header className='cabecalho'>
        <Link className='img-link' to='/'>
          <img src={lua} alt="Início"></img>
        </Link>
        <aside>
          <nav className='menu'>
            <ul>
              <li>
                <Link className='login-link' to='/login'>
                  <p className='botao'>Entrar</p>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

      </header>
    );
  } else
    if (tipo === 'vazio') {
      return (
        <header className='cabecalho'>
          <Link className='img-link' to='/'>
          <img src={lua} alt="Início"></img>
        </Link>
        </header>
      );
    } else
      if (tipo === 'logado') {
        return (
          <header className='cabecalho'>
        <Link className='img-link' to='/'>
          <img src={lua} alt="Início"></img>
        </Link>
        <aside>
          <nav className='menu'>
            
            <ul>
              <li>
                <Link className='link' to='/perfil'>
                  <p>Meu Perfil</p>
                </Link>
              </li>
              <li>
                <Link onClick={handleSair} className='link' to='/login'>
                  <p>Sair</p>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

      </header>
        );
      }

}


export default Headers



