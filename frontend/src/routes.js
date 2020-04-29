import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Inicial from './pages/Inicial'
import Cadastro from './pages/Cadastro'


export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Inicial}></Route>
                <Route path="/cadastro" component={Cadastro}></Route>

            </Switch>
        </BrowserRouter>
    )
}