import logo from "./logo.svg";
import Table from "./Table";
import dbPull from "./api";
import "./App.css";
import { useState, useEffect } from "react";

const renderLogo = () => {
  return <img src={logo} className="App-logo" alt="logo" />;
};

const App = () => {
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    console.log("fetching from db...");
    dbPull("/table/User", (json, _) => {
      setSuccess(true);
      console.log(json);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {renderLogo()}
        <h1>OpenAcademia</h1>
        {success ? <Table table /> : null}
      </header>
    </div>
  );
};

export default App;
