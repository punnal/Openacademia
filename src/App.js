import logo from "./logo.svg";
import Modal from "react-bootstrap/Modal";
import { useFormik } from "formik";
import Table from "./Table";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import Nav from "react-bootstrap/Nav";
import Signup from "./Signup";
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
    <ButtonGroup onClick={(e) => props.onClick(e.target.innerText)}>
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
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    onSubmit: (values) => {
      props.set.onSignIn(values);
    },
  });
  return (
    <Modal.Dialog>
      <Modal.Header>
        <Modal.Title>Sign In</Modal.Title>
      </Modal.Header>

      <Modal.Body></Modal.Body>

      <Form onSubmit={formik.handleSubmit}>
        <FormControl
          id="email"
          name="email"
          placeholder="Email"
          type="email"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        <FormControl
          id="password"
          name="password"
          placeholder="Password"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        <Modal.Footer>
          <Button type="submit">Submit</Button>
          <Button variant="secondary" onClick={() => props.set.signIn(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Form>
    </Modal.Dialog>
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
            <Signup
              setPressed={setSignUp}
              onSubmit={(values) =>
                dbPush("/signup", values, (json) => {
                  console.log(json);
                  setSignUp(false);
                  props.setLogin(true);
                  props.setUsername(json.name);
                })
              }
            />
          ) : signIn ? (
            <SignIn
              set={{
                signIn: setSignIn,
                onSignIn: (values) => {
                  dbPush("/signin", values, (json) => {
                    if (json.Success) {
                      setSignIn(false);
                      props.setLogin(true);
                      props.setUsername(json.name);
                    } else {
                    }
                  });
                },
              }}
            />
          ) : (
            <SignInSignUp set={{ signUp: setSignUp, signIn: setSignIn }} />
          )}
        </Nav>
      </Navbar>
    </>
  );
};

const SearchBar = (props) => {
  const [title, setTitle] = useState("Filter");
  const [text, setText] = useState("");
  return (
    <Nav className="p-2 d-flex justify-content-center">
      <Form inline>
        <FormControl
          type="text"
          placeholder="Search"
          onChange={(e) => setText(e.target.value)}
          className="mr-sm-2"
          value={text}
        />
        <DropdownButton
          className="p-2"
          onSelect={(_, e) => setTitle(e.target.innerText)}
          title={title}
        >
          <Dropdown.Item>Author</Dropdown.Item>
          <Dropdown.Item>Title</Dropdown.Item>
          <Dropdown.Item>Conference</Dropdown.Item>
        </DropdownButton>
        <Button
          variant="outline-info"
          onClick={() => props.onSearch(title, text)}
        >
          Search
        </Button>
      </Form>
    </Nav>
  );
};

const onRowClick = (row) => {};

const executeQuery = (query, callback) => {
  dbPush("/query", { query: query }, (json) => callback(json));
};
const App = () => {
  const [success, setSuccess] = useState(false);
  const [rows, setRows] = useState([]);
  const [cols, setCols] = useState([]);
  const [loggedIn, setLogin] = useState(false);
  const [username, setUsername] = useState("");
  const attrs = "*";
  const table = "FullPaper";

  useEffect(() => {
    executeQuery(`SELECT ${attrs} FROM ${table}`, (json) => {
      setRows(json.rows);
      setCols(json.columns);
      setSuccess(true);
      console.log(json.columns);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Logo />
        <Heading />
      </header>
      <Router>
        <NavBar
          loggedIn={loggedIn}
          setLogin={setLogin}
          username={username}
          setUsername={setUsername}
        />
        <SearchBar
          onSearch={(title, text) =>
            executeQuery(
              `SELECT ${attrs} FROM ${table} WHERE UPPER(${title})=UPPER("${text}")`,
              (json) => setRows(json.rows)
            )
          }
        />
        <Switch>
          <Route exact path="/">
            <FilterBar
              onClick={(filter) =>
                executeQuery(
                  `SELECT ${attrs} FROM ${table} ${
                    filter !== "All" ? `WHERE Category = "${filter}"` : ``
                  }`,
                  (json) => setRows(json.rows)
                )
              }
            />
            {success && (
              <Table
                className="App-header"
                cols={cols}
                rows={rows}
                onRowClick={(row) => onRowClick(row)}
              />
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
