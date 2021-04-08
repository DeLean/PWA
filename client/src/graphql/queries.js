import gql from "graphql-tag";


export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      email
      token
    }
  }
`;

export const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

export const REGISTER_USER = gql`
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

export const FETCH_CITIES_QUERY = gql`
query GetAllCities {
    getAllCities {
     city 
     pop
     id
    }
  }
`;


export const CREATE_CITY_MUTATION = gql`
  mutation CreateCity($city: String!, $pop: String!){
    createCity(city: $city, pop: $pop){
      city
      pop
      id
      createdAt
    }
  }
`;