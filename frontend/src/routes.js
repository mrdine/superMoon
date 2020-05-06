import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Inicial from './pages/Inicial'
import Cadastro from './pages/Cadastro'
import Login from './pages/Login'
import Busca from './pages/Busca'
import MyPerfil from './pages/MeuPerfil'
import EditarMeuPerfil from './pages/EditarPerfil'
import CadastrarNews from './pages/CadastrarNews'
import VisitarPerfil from './pages/VisitarPerfil'



export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route  exact path="/conta/login" component={Login}></Route>
                <Route  exact path="/conta/cadastro" component={Cadastro}></Route>
                <Route  exact path="/conta/perfil" component={MyPerfil}></Route>
                <Route  exact path='/conta/perfil/editar' component={EditarMeuPerfil}></Route>
                <Route  exact path='/conta/perfil/cadastrarNews' component={CadastrarNews}></Route>
                
                <Route  exact path='/:apelido' component={VisitarPerfil}></Route>


                <Route exact path="/" component={Busca}></Route>


            </Switch>
        </BrowserRouter>
    )
}