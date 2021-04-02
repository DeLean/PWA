import React, { Fragment, useState } from 'react'
import { connect } from "react-redux";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { Link, Redirect } from "react-router-dom";
import { setAlert } from "../../actions/alert";
import { register } from "../../actions/auth";
import PropTypes from 'prop-types';
import Loader from "../Loader";

const Register = () => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name:"",
    email:"",
    password: "",
    confirmPassword: ""
  });

  const {name, email, password, confirmPassword} = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value});
  }

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, result){
      console.log(result)
      setAlert("Account erstellt", "success");
    },
    onError(err){
      console.log(err.graphQLErrors[0].extensions.exception.errors)
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
     
    },
    variables: formData
  });

  const onSubmit = async e => {
    try {
      e.preventDefault();
      if(password !== confirmPassword){
        setAlert("Passwörter stimmen nicht überein", "danger");
        return;
      }
      if(!formData)
        return;
      else{
        await addUser();
        return <Redirect to="/data" />;
      }
    }
    catch (err) {
      throw new Error(err);
    }
  }
   


  return loading ? ( <Loader/> ) : (
    <Fragment>
     <section className="container-home">

      <h1 className="large text-info">Registrierung</h1>
      <p className="lead"><i className="fas fa-user"></i> Erstellen Sie ihr Konto</p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input 
            type="text"
            placeholder="Name"
            name="name"
            value= {name}
            onChange={e => onChange(e)}

          />
        </div>
        <div className="form-group">
          <input 
            type="email"
            placeholder="Email Adresse"
            name="email"
            value={email}
            onChange={e =>onChange(e)}

          />
        </div>
        <div className="form-group">
          <input 
            type="password"
            placeholder="Passwort"
            name="password"
            value={password}
            onChange={e => onChange(e)}

          />
        </div>
        <div className="form-group">
          <input 
            type="password"
            placeholder="Passwort bestätigen"
            name="confirmPassword"
            value={confirmPassword}
            onChange={e => onChange(e)}

          />
        </div>
        <input type="submit" className="btn btn-primary" value="Registrieren" />
      </form>
      <p className="my-1">
        Bereits registriert ?  <Link to="/login">Anmelden</Link>
      </p>
    </section>
  </Fragment>

  );
}

const REGISTER_USER = gql`
  mutation register(
    $name: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        name: $name
        email: $email
        password: $password
        confirmPassword: $confirmPassword 
      }
    ){
      id email name token
    }
  }
`;




export default Register;
