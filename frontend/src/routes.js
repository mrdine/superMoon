import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Inicial from './pages/Inicial'
import Cadastro from './pages/Cadastro'
import Login from './pages/Login'
import Busca from './pages/Busca'
import MyPerfil from './pages/MeuPerfil'
import Teste from './pages/Teste'

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/login" component={Login}></Route>
                <Route path="/cadastro" component={Cadastro}></Route>
                <Route path="/perfil" component={MyPerfil}></Route>

                <Route path="/teste" component={Teste}></Route>

                <Route path="/" component={Busca}></Route>


            </Switch>
        </BrowserRouter>
    )
}