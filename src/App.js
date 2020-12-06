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
import Cookie from "js-cookie";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
  Redirect,
} from "react-router-dom";

const Logo = () => {
  return <img src={logo} className="App-logo" alt="logo" />;
};

const Heading = () => {
  return <h1 className="App-header">OpenAcademia</h1>;
};

const FilterBar = (props) => {
  return (
    <ButtonGroup onClick={(e) => props.onClick(e.target.innerText)}>
      {categories.map((cat, id) => (
        <Button key={id} variant="secondary">
          {cat}
        </Button>
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
                    if (json.success) {
                      setSignIn(false);
                      Cookie.set("userid", json.userid);
                      Cookie.set("name", json.name);
                      Cookie.set("email", json.name);
                      props.setUsername(json.name);
                      props.setEmail(json.email);
                      props.setLogin(true);
                    } else {
                      console.error("sign in failed");
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

const DateBar = (props) => {
  const [order, setOrder] = useState("Order");
  const [start, setStart] = useState("0000-01-01");
  const [end, setEnd] = useState("9999-12-31");
  return (
    <Nav className="p-2 d-flex justify-content-center">
      <Form inline>
        <FormControl
          type="text"
          placeholder="Start Date"
          onChange={(e) => setStart(e.target.value)}
          className="mr-sm-2"
          value={start}
        />
        <FormControl
          type="text"
          placeholder="End Date"
          onChange={(e) => setEnd(e.target.value)}
          className="mr-sm-2"
          value={end}
        />
        <DropdownButton
          className="p-2"
          onSelect={(_, e) => setOrder(e.target.innerText)}
          title={order}
        >
          <Dropdown.Item>Assending</Dropdown.Item>
          <Dropdown.Item>Decending</Dropdown.Item>
        </DropdownButton>
        <Button
          variant="outline-info"
          onClick={() => {
            if (start === "") {
              setStart("0000-01-01");
            }
            if (end === "") {
              setEnd("9999-12-31");
            }
            props.onFilter(start, end, order);
          }}
        >
          Filter
        </Button>
      </Form>
    </Nav>
  );
};

const HomePage = (props) => {
  const [success, setSuccess] = useState(false);
  const [rows, setRows] = useState([]);
  const [cols, setCols] = useState([]);
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
    <>
      <SearchBar
        onSearch={(title, text) =>
          executeQuery(
            `SELECT ${attrs} FROM ${table} WHERE UPPER(${title})=UPPER("${text}")`,
            (json) => setRows(json.rows)
          )
        }
      />
      <DateBar
        onFilter={(start, end, order) => {
          if (order === "Order") {
            executeQuery(
              `SELECT ${attrs} FROM ${table} WHERE date BETWEEN "${start}" AND "${end}"`,
              (json) => setRows(json.rows)
            );
          } else {
            if (order === "Assending") {
              executeQuery(
                `SELECT ${attrs} FROM ${table} WHERE date BETWEEN "${start}" AND "${end}" ORDER BY date ASC`,
                (json) => setRows(json.rows)
              );
            } else if (order === "Decending") {
              executeQuery(
                `SELECT ${attrs} FROM ${table} WHERE date BETWEEN "${start}" AND "${end}" ORDER BY date DESC`,
                (json) => setRows(json.rows)
              );
            }
          }
        }}
      />
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
          onRowClick={(row) => props.onRowClick(rows[row][0])}
        />
      )}
    </>
  );
};

const TableQuery = (props) => {
  const query = props.query;
  const [success, setSuccess] = useState(false);
  const [rows, setRows] = useState([]);
  const [cols, setCols] = useState([]);
  useEffect(() => {
    executeQuery(query, (json) => {
      setRows(json.rows);
      setCols(json.columns);
      setSuccess(true);
      console.log(json.columns);
    });
  }, []);
  return (
    <>
      {success && (
        <Table
          className="App-header"
          cols={cols}
          rows={rows}
          onRowClick={(row) => props.onRowClick(row)}
        />
      )}
    </>
  );
};

const ProfilePage = (props) => {
  console.log("Email: ", props.email);
  return (
    <>
      <h1 className="text-muted"> {props.name}'s Papers </h1>
      <TableQuery
        onRowClick={(row) => props.onRowClick(row)}
        query={`SELECT * FROM Paper WHERE UserID = (SELECT UserID FROM User WHERE Email = '${props.email}')`}
      />
    </>
  );
};
const executeQuery = (query, callback) => {
  dbPush("/query", { query: query }, (json) => callback(json));
};

const Reply = (props) => {
  return (
    <div>
      <p className="text-muted">
        {props.reply[5]}:{props.reply[2]} --> {props.reply[1]}
      </p>
    </div>
  );
};

const CommentBox = (props) => {
  const [reply, setReply] = useState("");
  const paperid = props.paperid;
  const parentid = props.parent;
  const userid = props.userid;
  return (
    <>
      <Form inline>
        <FormControl
          type="text"
          placeholder="Comment"
          onChange={(e) => setReply(e.target.value)}
          className="mr-sm-2"
          value={reply}
        />
        <ReplyButton
          parent={props.parent}
          onClick={() => sendReply(parentid, reply, userid, parentid)}
        />
      </Form>
    </>
  );
};
const sendReply = (parentID, text, userid, paperid) => {
  dbPush(
    "/reply",
    { reply: text, userId: userid, paperID: paperid, parentID: parentID },
    (json) => console.log("reply posted", json)
  );
};
const ReplyButton = (props) => {
  return (
    <>
      <Button variant="outline-info" onClick={() => props.onClick()}>
        {props.parent}
      </Button>
    </>
  );
};
const ReplyThread = (props) => {
  return (
    <>
      <h2 className="text-muted">Replies</h2>
      {props.replies.map((reply, id) => (
        <>
          <Reply key={id} reply={reply} />
          {props.signedIn ? (
            <CommentBox
              id={Cookie.get("id")}
              parent={reply[0]}
              paperid={props.paperid}
              userid={props.userid}
            />
          ) : null}
        </>
      ))}
    </>
  );
};
const PaperPage = (props) => {
  const [row, setRow] = useState([]);
  const [replies, setReplies] = useState([]);
  useEffect(() => {
    executeQuery(
      `Select * from Paper where PaperID = '${props.id}'`,
      (json) => {
        setRow(json.rows[0]);
        console.log("Paper recv: ", json.rows[0]);
      }
    );
    executeQuery(
      `Select * from Reply where PaperID = '${props.id}'`,
      (json) => {
        setReplies(json.rows);
        console.log("Reply recv: ", json.rows);
      }
    );
  }, []);
  return (
    <>
      <h1 className="text-muted"> {props.id} </h1>
      <ReplyThread
        signedIn={props.signedIn}
        paperid={props.id}
        userid={Cookie.get("userid")}
        replies={replies}
        onReply={(comment) =>
          executeQuery(
            `SELECT ${comment} FROM ${comment} WHERE UPPER(${comment})=UPPER("${comment}")`,
            (json) => setRow(json.rows)
          )
        }
      />
    </>
  );
};
const App = () => {
  const [loggedIn, setLogin] = useState(Cookie.get("userid") ? true : false);
  const [username, setUsername] = useState(Cookie.get("name"));
  const [email, setEmail] = useState(Cookie.get("email"));
  const [rowClicked, onRowClick] = useState();

  useEffect(() => {
    console.log("ROW CLICKED ", rowClicked);
  }, [rowClicked]);

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
          setEmail={setEmail}
        />
        <Switch>
          <Route exact path="/">
            {loggedIn ? (
              <ProfilePage
                onRowClick={onRowClick}
                name={username}
                email={email}
              />
            ) : rowClicked ? (
              <Redirect to={`/paper/${rowClicked}`} />
            ) : (
              <HomePage onRowClick={onRowClick} />
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
          <Route path="/paper">
            <PaperPage id={rowClicked} signedIn={loggedIn} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
