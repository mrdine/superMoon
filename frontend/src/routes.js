import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Inicial from './pages/Inicial'
import Cadastro from './pages/Cadastro'
import Login from './pages/Login'
import Busca from './pages/Busca'
import MyPerfil from './pages/MeuPerfil'
import EditarMeuPerfil from './pages/EditarPerfil'
import CadastrarNews from './pages/CadastrarNews'
import Teste from './pages/Teste'


export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route  exact path="/login" component={Login}></Route>
                <Route  exact path="/cadastro" component={Cadastro}></Route>
                <Route  exact path="/perfil" component={MyPerfil}></Route>
                <Route  exact path='/perfil/editar' component={EditarMeuPerfil}></Route>
                <Route  exact path='/perfil/cadastrarNews' component={CadastrarNews}></Route>

                <Route  exact path="/teste" component={Teste}></Route>

                <Route exact path="/" component={Busca}></Route>


            </Switch>
        </BrowserRouter>
    )
}