import React from "react";
import firebase from "./Firebase";
import "./App.css";
import Routes from "./routes/Routes";

const App = () => {
  console.log(firebase);
  return (
    <div className="App">
      <Routes />
    </div>
  );
};

export default App;
