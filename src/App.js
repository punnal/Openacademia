import logo from "./logo.svg";
import Table from "./Table";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import dbPull from "./api";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const Logo = () => {
  return <img src={logo} className="App-logo" alt="logo" />;
};

const Heading = () => {
  return <h1 className="App-header">OpenAcademia</h1>;
};

const FilterBar = (props) => {
  return (
    <ButtonGroup onClick={(e) => props.setFilter(e.target.innerText)}>
      {categories.map((cat) => (
        <Button variant="secondary">{cat}</Button>
      ))}
    </ButtonGroup>
  );
};

const categories = [
  "All",
  "Mathematics",
  "Physics",
  "Computer Science",
  "Chemistry",
  "Biology",
  "Economics",
  "Other",
];

const NavBar = () => {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home"></Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/aboutus">About Us</Nav.Link>
        </Nav>
      </Navbar>
    </>
  );
};
const App = () => {
  const [success, setSuccess] = useState(false);
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    dbPull("/table/Paper", (json, _) => {
      setRows(json);
      setSuccess(true);
      console.log(json);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Logo />
        <Heading />
      </header>
      <Router>
        <NavBar />
        <Switch>
          <Route exact path="/">
            <FilterBar setFilter={setFilter} />
            {success && (
              <Table className="App-header" rows={rows} filter={filter} />
            )}
          </Route>
          <Route path="/aboutus">
            <div className="about-section">
              <h1>About OpenAcademia</h1>
              <p>
                Openacademia is a new system that would encourage authors to
                archive their research papers. It would not only give
                researchers full access to the papers online but also allow them
                to download them and make use of it while being offline. Users
                can also post a detailed review or respond to some other user’s
                review.
              </p>
            </div>
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
