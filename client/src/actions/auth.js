import axios from "axios";
import { setAlert } from "./alert";
import jwt_decode from "jwt-decode";
import {
    REGISTER_SUCCESS,
    REGISTER_FAILED,
    USER_LOADED,
    USER_ID_SAVED,
    USER_LOADED_FAILED,
    LOGIN_SUCCESS,
    LOGIN_FAILED,
    LOGOUT,
    CHECK_OUT
} from "./types";


//Load User
export const loadUser = () =>  async dispatch => {
  const token = localStorage.getItem("token");
    try {
      //const res = await axios.get("/api/auth");
      const res = await fetch("http://localhost:5555/api/auth", {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers:  {
          "Content-Type" : "application/json",
          "X-Auth-Token" :  `${token}` 
        },
        credentials: "omit"
      });

      const user = await res.json();
      dispatch({
        type: USER_LOADED,
        payload: user
      });
    }

    catch(err) {
      console.error(err);
      dispatch({
        type: USER_LOADED_FAILED
      });
    }     
}

export const loadUserOffline = () =>  async dispatch => {
  //aktueller Token, wir wissen nicht ob es der Token ist der vom Server ausgestellt wurde
  const token = localStorage.getItem("token"); 
  //UserID vom Token der direkt nach dem Login vom Server herausgegeben wurde
  const userID = localStorage.getItem("UserID");

    try {
      const decoded = await jwt_decode(token);
      const user = decoded.user;
      const currentUserID = user.id;
      //Wenn die UserIds nicht gleich sind bedeutet das, der Token wurde kompromitiert bzw. ausgetauscht
      if(userID === currentUserID) {
        dispatch({
          type: USER_LOADED,
          payload: user
        });
      }
    }
    catch(err) {
      
      dispatch({
        type: USER_LOADED_FAILED
      });

      dispatch({
        type: LOGOUT
      });
      console.error(err);
    }     
    

    

}
    
     

//Register User
export const register = ({ name, email, password}) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  }

  const body = JSON.stringify({ name, email, password });

  try {
    var res = await axios.post("/api/users", body, config);
    var token = res.data;
  }
  catch(err) {

    const errors = err.response.data.errors;  //array of errors

    if(errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }
    console.error(err);
    dispatch({
      type: REGISTER_FAILED
    });
  }

  dispatch({
    type: REGISTER_SUCCESS,
    payload: token
  });
  dispatch(setAlert("Sie sind jetzt registriert !", "success"));
}

/*
const res = await dexie.users.get("email", async () => {
  const resultArray = await dexie.users.where("email").equals(email).toArray();
  return resultArray[0];
});
*/

//Login User
export const login = ( email, password ) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  }

  const formData = JSON.stringify({ email, password });

  try {
    //var res = await axios.post("/api/auth", body, config);
    const res = await fetch("http://localhost:5555/api/auth", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers:  {
        "Content-Type": "application/json",
      },
      credentials: "omit",
      body: `${formData}`
      });
    
    var token = await res.json();
    //var token = res.data;
    
    dispatch({
      type: LOGIN_SUCCESS,
      payload: token
    });

    dispatch(loadUser());
  }
  catch (err) {
    console.log(err)
    const errors = err.response.data.errors;  //array of errors

    if(errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: LOGIN_FAILED
    });
  }
  try {
    
    console.log(token)
    const decoded = await jwt_decode(token.token);
    const id = decoded.user.id;

    dispatch({
      type: USER_ID_SAVED,
      payload: id
    });
  } 
  catch (err) {
    console.error(err);
  }
  
};

//Logout
export const logout = () => async (dispatch) => {
  dispatch({ type: CHECK_OUT});
  dispatch({ type: LOGOUT});
};



  
/*
export const loadAllUsers = () => async dispatch => {
  try {
    const usersTable = await dexie.table("users").toArray();
    if(usersTable.length === 0) {
      var res = await axios.get("api/users");
      var allUsers = res.data;
      await dexie.users.bulkAdd(allUsers);
      dispatch({
        type: ALL_USER_LOADED_SUCCESS,
        payload: allUsers
      });
    }
    else {
      dispatch({
        type: ALL_USER_LOADED_SUCCESS,
        payload: usersTable
      });
    }
  }
  catch(err) {
    console.error(err);
    dispatch({
      type: ALL_USER_LOADED_FAILED
    });
  }
}
------------------------------------------------------------------------------
    
    var currentUser = await dexie.currentUser.get("email", async () => {
      try {
        const resultArray = await dexie.users.where("email").equals(email).toArray();
      }catch(err) {
        console.error(err);
      }
      return resultArray[0];
      });
      */

/*
const addUserToDexie = async (user) => {
  try {
    await dexie.currentUser.add(user);
  }
  catch(err) {
    console.error(err);
  }
}
*/
/*
const userInDexie = async (id) => {
  try {
    const user =  await dexie.currentUser.get(id);
    console.log(user)
    if(user)
      return true;
    else
      return false;
  }
  catch(err) {
    console.error(err);
  }
}
*/
/*const getCurrentUser = async (id) => {
  try {
    const user =  await dexie.currentUser.get(id);
    return user;
  }
  catch(err) {
    console.error(err);
  }
}
*/