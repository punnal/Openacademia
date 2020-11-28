import logo from "./logo.svg";
import Table from "./Table";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Nav from "react-bootstrap/Nav";
import dbPull from "./dbPull";
import dbPush from "./dbPush";
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

const SignUp = (props) => {
  return (
    <Form inline>
      <FormControl type="text" placeholder="Email" className="mr-sm-2" />
      <FormControl type="password" placeholder="Password" className="mr-sm-2" />
      <Button variant="outline-info" onClick={() => dbPush("/signup")}>
        Sign Up
      </Button>
      <Button onClick={() => props.set.signUp(false)} variant="dark">
        Back
      </Button>
    </Form>
  );
};
const SignIn = (props) => {
  return (
    <Form inline>
      <FormControl type="text" placeholder="Email" className="mr-sm-2" />
      <FormControl type="password" placeholder="Password" className="mr-sm-2" />
      <Button variant="outline-info">Sign Up</Button>
      <Button onClick={() => props.set.signIn(false)} variant="dark">
        Back
      </Button>
    </Form>
  );
};
const SignInSignUp = (props) => {
  return (
    <>
      <Nav.Link onClick={() => props.set.signIn(true)} className="mr-sm-2">
        Sign In
      </Nav.Link>
      <Nav.Link onClick={() => props.set.signUp(true)} className="mr-sm-2">
        Sign Up
      </Nav.Link>
    </>
  );
};

const NavBar = (props) => {
  const [signUp, setSignUp] = useState(false);
  const [signIn, setSignIn] = useState(false);
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/"></Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/aboutus">About Us</Nav.Link>
        </Nav>
        <Nav>
          {props.loggedIn ? (
            <Navbar.Text>Signed in as: {props.username}</Navbar.Text>
          ) : signUp ? (
            <SignUp set={{ signUp: setSignUp }} />
          ) : signIn ? (
            <SignIn set={{ signIn: setSignIn }} />
          ) : (
            <SignInSignUp set={{ signUp: setSignUp, signIn: setSignIn }} />
          )}
        </Nav>
      </Navbar>
    </>
  );
};

const SearchBar = () => {
  return (
    <Nav className="p-2 d-flex justify-content-center">
      <Form inline>
        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
        <Button variant="outline-info">Search</Button>
      </Form>
    </Nav>
  );
};
const App = () => {
  const [success, setSuccess] = useState(false);
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    dbPush("/query", { query: "select * from Paper" }, (json, _) => {
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
        <SearchBar />
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
