import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Inicial from './pages/Inicial'
import Cadastro from './pages/Cadastro'
import Login from './pages/Login'
import Busca from './pages/Busca'
import MeuPerfil from './pages/MeuPerfil'

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/login" component={Login}></Route>
                <Route path="/cadastro" component={Cadastro}></Route>

                <Route path="/" component={Busca}></Route>

                <Route path="/meu_perfil" component={Busca}></Route>


            </Switch>
        </BrowserRouter>
    )
}