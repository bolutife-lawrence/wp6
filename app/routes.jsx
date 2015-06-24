import React from "react"

import { DefaultRoute, Route } from "react-router"

import App from "./components/app"
import HomePage from "./components/pages/home"
import LoginPage from "./components/pages/login"
import LogoutPage from "./components/pages/logout"
import AboutPage from "./components/pages/about"
import BooksPage from "./components/pages/books"
import SignUpPage from "./components/pages/signup"

import requireAuth from "./auth"

let routes = (
  <Route handler={App} path="/">
    <DefaultRoute name="home" handler={HomePage} />
    <Route name="login" handler={LoginPage} />
    <Route name="logout" handler={LogoutPage} />
    <Route name="about" handler={AboutPage} />
    <Route name="books" handler={requireAuth(BooksPage)} />
    <Route name="signup" handler={SignUpPage} />
  </Route>
)

export default routes
