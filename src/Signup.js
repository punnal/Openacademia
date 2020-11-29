import React from "react";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";

import { useFormik } from "formik";

export default function Sign(props) {
  // Notice that we have to initialize ALL of fields with values. These

  // could come from props, but since we don't want to prefill this form,

  // we just use an empty string. If you don't do this, React will yell

  // at you.

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },

    onSubmit: (values) => {
      props.onSubmit(values);
    },
  });
  const co = {
    borderRadius: "5px",
    backgroundColor: "#f2f2f2",
    padding: "20px",
  };
  return (
    <Modal.Dialog>
      <Modal.Header>
        <Modal.Title>Sign Up</Modal.Title>
      </Modal.Header>

      <Modal.Body></Modal.Body>

      <Form onSubmit={formik.handleSubmit}>
        <FormControl
          id="name"
          name="name"
          placeholder="Name"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.firstName}
        />
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
          <Button variant="secondary" onClick={() => props.setPressed(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Form>
    </Modal.Dialog>
  );
}

