import React from 'react';

import { useFormik } from 'formik';



export default function Sign(props) {

  // Notice that we have to initialize ALL of fields with values. These

  // could come from props, but since we don't want to prefill this form,

  // we just use an empty string. If you don't do this, React will yell

  // at you.

  const formik = useFormik({

    initialValues: {

      firstName: '',

      lastName: '',

      email: '',

      password:'',

    },

    onSubmit: values => {

      alert(JSON.stringify(values, null, 2));

    },

  });
  const co={
    borderRadius: "5px",
    backgroundColor: "#f2f2f2",
    padding: "20px"
  }
  return (

    <div style={co}>
            <form onSubmit={formik.handleSubmit}>

            <label htmlFor="firstName">First Name</label>

            <input

            id="firstName"

            name="firstName"

            type="text"

            onChange={formik.handleChange}

            value={formik.values.firstName}

            />

            <label htmlFor="lastName">Last Name</label>

            <input

            id="lastName"

            name="lastName"

            type="text"

            onChange={formik.handleChange}

            value={formik.values.lastName}

            />

            <label htmlFor="email">Email Address</label>

            <input

            id="email"

            name="email"

            type="email"

            onChange={formik.handleChange}

            value={formik.values.email}

            />

            <label htmlFor="password">Email Address</label>

            <input

            id="password"

            name="password"

            type="password"

            onChange={formik.handleChange}

            value={formik.values.password}

            />

            <button type="submit">Submit</button>

            </form>
    </div>

            );

};