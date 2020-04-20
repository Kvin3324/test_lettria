import React from "react";
import InputListStyled from "../style/InputListStyled.style";

function Home() {
  const [data, setData] = React.useState({
    error: false,
    serverMessage: "",
    savedInputs: [],
    newInput: [],
    arrConcat: []
  });

  React.useEffect(() => {
    fetch("http://localhost:3000/home", {
      method: "GET",
      headers: {
        "Authorization": sessionStorage.getItem("UserToken")
      }
    })
      .then(response => {
        if (response.status >= 500 && response.status <= 600) {
          return setData({
            ...data,
            error: true,
            serverMessage: "Oops something went wrong with the server. Please try again in a few minutes."
          });
        }
        return response.json();
      })
      .then(dataParsed => {
        if (dataParsed.error) {
          return setData({
            ...data,
            error: true,
            serverMessage: dataParsed.serverMessage
          });
        }

        if (dataParsed.newToken) {
          sessionStorage.set("UserToken", dataParsed.newToken)
        }


        return setData({
          ...data,
          savedInputs: dataParsed.inputContent,
          arrConcat: data.savedInputs.concat(dataParsed.inputContent)
        })
      })
  }, [])

  const addInput = () => {
    const newState = { ...data };

    newState.newInput.push("");
    newState.arrConcat = newState.savedInputs.concat(newState.newInput);

    return setData(newState);
  }

  function changeInputValue(e, inputValue) {
    const newState = { ...data };
    const indexInputFromBdd = newState.savedInputs.indexOf(inputValue);
    const indexNewInputs = newState.newInput.indexOf(inputValue);

    if (indexInputFromBdd >= 0) {
      newState.savedInputs[indexInputFromBdd] = e.target.value;
    }

    if (indexNewInputs >= 0) {
      newState.newInput[indexNewInputs] = e.target.value;
    }

    newState.arrConcat = newState.savedInputs.concat(newState.newInput)
    return setData(newState);
  }

  function savedNewInputs() {
    fetch("http://localhost:3000/home", {
      method: "POST",
      headers: {
        "Authorization": sessionStorage.getItem("UserToken"),
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        inputContent: data.newInput
      })
    })
      .then(response => {
        if (response.status >= 500 && response.status <= 600) {
          return setData({
            ...data,
            error: true,
            serverMessage: "Oops something went wrong with the server. Please try again in a few minutes."
          });
        }
        return response.json();
      })
      .then(dataParsed => {
        if (dataParsed.error) {
          return setData({
            ...data,
            error: true,
            serverMessage: dataParsed.serverMessage
          });
        }

        return setData({
          ...data,
          serverMessage: dataParsed.serverMessage,
          savedInputs: dataParsed.inputContent,
          newInput: [],
          arrConcat: data.savedInputs.concat(data.newInput)
        })
      })
  }

  return (
    <React.Fragment>
      <h1 style={{ marginTop: "5%", marginLeft: "6%" }}>Bienvenue sur votre dashboard.</h1>
      {
        data.error && (
          <div className="form-group bg-danger rounded p-2 ml-1" style={{ width: "90%" }}>
            <p className="text-light">{data.serverMessage}</p>
          </div>
        )
      }
      <div className="create--information" style={{ marginTop: "3%", marginLeft: "6%" }}>
        <button className="btn btn-primary" style={{ backgroundColor: "#5FBF73", border: "none" }} onClick={addInput}>Ajouter une information</button>
      </div>
      <InputListStyled className="card--list">
        <ul className="list-group">
          {
            data.savedInputs.length !== 0 &&
            data.arrConcat.map((input, index) => {
              return (
                <li className="list-group-item mb-3" key={index}>
                  <input className="form-control" type="text" defaultValue={data.arrConcat[index]} key={index} onChange={(e) => changeInputValue(e, input)}></input>
                </li>
              )
            })
          }
        </ul>
      </InputListStyled>
      <div className="save--information" style={{ marginTop: "5%", marginLeft: "6%", marginBottom: "4%" }}>
        <button className="btn btn-primary" style={{ backgroundColor: "#5FBF73", border: "none" }} onClick={() => savedNewInputs()}>Savegarder</button>
      </div>
    </React.Fragment>
  );
}

export default Home;
