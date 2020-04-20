import React from 'react';
import { createGlobalStyle, ThemeProvider } from "styled-components";
import variables from "./variables";
import ErrorMessageTokenStyled from "./style/ErrorMessageTokenStyled.style";
import SpaceLog from './components/Spacelog/Spacelog';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Home from './Home/Home';

function App() {
  const GlobalStyle = createGlobalStyle`
    body {
      background-color: ${props => props.theme.backgroundColor};
    }
  `;

  function ErrorMessage({ errorTitle, errorContent, redirectLink, errorAdvice }) {
    return (
      <ErrorMessageTokenStyled>
        <h2>{errorTitle}</h2>
        <p>
          {errorContent} <Link to={`${redirectLink}`}>{errorAdvice}</Link>
        </p>
      </ErrorMessageTokenStyled>
    );
  }

  function availableToken(Component, propsFromRoute) {
    return sessionStorage.UserToken ? (
      <Component {...propsFromRoute} />
    ) : (
        <ErrorMessage
          errorTitle="You need to be connected."
          errorContent="To access to this page, please"
          redirectLink="/login"
          errorAdvice="use your account."
        />
      );
  }

  function unavailableToken(Component, propsFromRoute) {
    return !sessionStorage.UserToken ? (
      <Component {...propsFromRoute} />
    ) : (
        <ErrorMessage
          errorTitle="You are already connected."
          errorContent="You need to log out if you want to do"
          redirectLink="/feed"
          errorAdvice="something else."
        />
      );
  }

  return (
    <React.Fragment>
      <BrowserRouter>
        <ThemeProvider theme={{ ...variables }}>
          <GlobalStyle></GlobalStyle>
          <Route exact path="/home" render={() => availableToken(Home)} />
          <Route exact path={["/login", "/signup"]} render={routerProps => unavailableToken(SpaceLog, routerProps)} />
        </ThemeProvider>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
