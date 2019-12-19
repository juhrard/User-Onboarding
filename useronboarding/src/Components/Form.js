import React, { useState, useEffect } from 'react';
import { withFormik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const MemberForm = ({ values, errors, touched, status }) => {

  const [members, setMembers] = useState([]);
  useEffect(() => {
    console.log("status has changed", status);
    status && setMembers(members => [...members, status]);
    console.log("This is members:", members)
  }, [status]);
  return (
    <div>
      <Form>
        <label htmlFor="name">Name: </label>
          <Field
            id="name"
            type="text"
            name="name"
          /><br/>
        <label htmlFor="email">E-mail: </label>
          <Field
            id="email"
            type="text"
            name="email"
          /><br/>
        <label htmlFor="password">Password: </label>
          <Field
            id="password"
            type="password"
            name="password"
          /><br/>
        <label htmlFor="terms">I accept the Terms of Service</label>
          <Field
            id="terms"
            type="checkbox"
            name="terms"
            checked={values.terms}
          />
          <span className="checkmark"/>
          {touched.terms && errors.terms && (
            <p className="errors">
              {errors.terms}
            </p>
          )}
        <button type="submit">Submit</button>
      </Form>
      {members.map(member => (
        <div className="applications" key={member.id}>
          <h1>Name: {member.name}</h1>
          <h2>E-mail: {member.email}</h2>
        </div>
        ))}
    </div>
  );

};

const FormikMemberForm = withFormik({
  mapPropsToValues({ name, email, password, terms }) {
    return {
      name: name || "",
      email: email || "",
      password: password || "",
      terms: terms || false
    };
  },
  validationSchema: Yup.object().shape({
    terms: Yup.boolean().oneOf([true], "Must Accept Terms of Service")
  }),
  handleSubmit(values, {setStatus, resetForm}) {
    console.log("submitting", values);
    axios
      .post("https://reqres.in/api/users", values)
      .then(response => {
        console.log("success", response);
        setStatus(response.data);
        resetForm();
      })
      .catch(error => {
        console.log(error.response)
      });
  }
})(MemberForm);

export default FormikMemberForm;