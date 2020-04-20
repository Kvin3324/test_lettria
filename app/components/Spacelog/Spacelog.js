import React from "react";
import { Link, Redirect } from "react-router-dom";
import SpaceLogStyled from "../../style/SpacelogStyled.style";

export default function SpaceLog(props) {
  const inputMail = React.createRef(null);
  const inputPassword = React.createRef(null);
  const [state, setState] = React.useState({
    error: false,
    serverMessage: "",
    redirect: false,
    urlToRedirect: ""
  });

  function checkUser() {
    const newState = { ...state };

    if (inputMail.current.value.length === 0 || inputPassword.current.value.length === 0) {
      newState.error = true;
      newState.serverMessage = "You must fill all fields.";

      return setState(newState);
    }

    if (inputMail.current.value !== "" && inputPassword.current.value !== "") {
      if (/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(inputMail.current.value) === false) {
        newState.error = true;
        newState.serverMessage = "Wrong format email"

        return setState(newState);
      }
      if (inputPassword.current.value.length < 6) {

        newState.error = true;
        newState.serverMessage = "Wrong password length.";
        return setState(newState);
      }
    }

    if (props.location.pathname === "/login") {
      return fetch("http://localhost:3000/login", {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        method: "POST",
        body: JSON.stringify({
          mail: inputMail.current.value,
          password: inputPassword.current.value
        })
      })
        .then(response => {
          if (response.status >= 500 && response.status <= 600) {
            return setState({
              error: true,
              serverMessage: "Oops something went wrong with the server. Please try again in a few minutes."
            });
          }
          return response.json();
        })
        .then(dataParsed => {
          if (dataParsed.error) {
            return setState({
              error: true,
              serverMessage: dataParsed.serverMessage
            });
          }

          sessionStorage.setItem("UserToken", dataParsed.token);
          newState.redirect = true;
          return setState(newState);
        })
    }

    return fetch("http://localhost:3000/signup", {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      method: "POST",
      body: JSON.stringify({
        mail: inputMail.current.value,
        password: inputPassword.current.value
      })
    })
      .then(response => {
        if (response.status >= 500 && response.status <= 600) {
          return setState({
            error: true,
            serverMessage: "Oops something went wrong with the server. Please try again in a few minutes."
          });
        }
        return response.json();
      })
      .then(dataParsed => {
        console.log(dataParsed);

        if (dataParsed.error) {
          return setState({
            error: true,
            serverMessage: dataParsed.serverMessage
          });
        }

        sessionStorage.setItem("UserToken", dataParsed.token);
        newState.redirect = true;
        return setState(newState);
      })
  }

  if (state.redirect) return <Redirect to="/home" />;

  return (
    <SpaceLogStyled as="section" className="container form--connection">
      {
        state.error && (
          <div className="form-group bg-danger rounded p-2 ml-1" style={{ width: "90%" }}>
            <p className="text-light">{state.serverMessage}</p>
          </div>
        )
      }
      <div className="form--connection--mail">
        <label htmlFor="mail">Identifiant:</label>
        <input type="text" id="mail" ref={inputMail} />
        <label htmlFor="pass">Mot de passe (6 charactères minimum):</label>
        <input type="password" id="pass" name="password" minLength="6" ref={inputPassword} />
      </div>
      <div className="form--connection--button">
        <button onClick={() => checkUser()}>Valider</button>
      </div>
      <div className="redirection--link">
        {
          props.location.pathname === "/login" ?
            <p>
              Besoin d'un compte ? Ne vous inquiétez pas, <Link to="/signup"> vous pouvez le créer.</Link>
            </p> :
            <p>
              Déjà un compte ? <Link to="/login"> Connectez-vous.</Link>
            </p>
        }
      </div>
    </SpaceLogStyled>
  )
}