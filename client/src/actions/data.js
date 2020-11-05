import {
  SERVER_DATALOAD_SUCCESS,
  SERVER_DATALOAD_FAILED,
  CLIENT_DATALOAD_SUCCESS,
  CLIENT_DATALOAD_FAILED,
  DEXIE_MIGRATION_SUCCESS,
  DEXIE_MIGRATION_FAILED,
  DATA_INSERTED_ONLINE,
  DATA_INSERTED_OFFLINE,
  DATA_INSERTED_FAILED
} from "./types";
import axios from "axios";
import { setAlert } from "./alert";
//import dexie from "../dexie";
import { dexie }  from "../dexie";
//var isEqual = require("lodash.isequal");



//Load entire Data from MongoDB and migrate to Local Database Dexie
export const loadServerData = ()  => async dispatch => {
  //TODO: ServiceWorker einschalten
  try {
    var res = await axios.get("api/zips");
    var allServerData = res.data;

    dispatch({
        type: SERVER_DATALOAD_SUCCESS,
        payload: allServerData
    });
} catch (err) {
    //dispatch({ type: DATALOAD_FAILED });
    //try load data until it succeds
    dispatch({
        type: SERVER_DATALOAD_FAILED,
        payload: {
            msg: err.response.statusText,
            status: err.response.status
        }
    });
}
//migrate to dexie DB
//TODO: SW, wenn online dann zum Server hochladen
//TODO: stale data handlen
try {
    await dexie.table("cities").bulkAdd(allServerData);

    dispatch({ type: DEXIE_MIGRATION_SUCCESS });
    dispatch({
        type: CLIENT_DATALOAD_SUCCESS,
        payload: allServerData
    });


} catch (err) {
    //try load data until it succeds
    dispatch({
        type: DEXIE_MIGRATION_FAILED,
        payload: {
            msg: err.response.statusText,
            status: err.response.status
        }
    });
 }
}


export const loadLocalData = ()  => async dispatch => {
    //TODO: ServiceWorker einschalten
    try {


        const res = await dexie.table("cities").toArray();
        console.log(res)
        dispatch({
            type: CLIENT_DATALOAD_SUCCESS,
            payload: res
        });


    } catch (err) {
        //dispatch({ type: DATALOAD_FAILED });
        //try load data until it succeds
        dispatch({
            type: CLIENT_DATALOAD_FAILED,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        });
    }
    }


export const insertData = formData => async dispatch => {
    const {city, zip, pop} = formData;

    try {
        await dexie.cities.add({
            city: city,
            zip: zip,
            pop: pop
        });
        await dexie.newCities.add({
            city: city,
            zip: zip,
            pop: pop
        });
        //if Offline
        dispatch({
            type:   DATA_INSERTED_OFFLINE,
            payload: formData
        });
    }
    catch(err) {
        dispatch({
            type: DATA_INSERTED_FAILED,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        });
    }
    //TODO: wenn Online dann zum Server hochladen
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    try {
        await axios.post("/api/zips", formData, config);

        dispatch({
            type: DATA_INSERTED_ONLINE,
            payload: formData
        });

        dispatch(setAlert("Datensatz hinzugefügt", "success"));
    }
    catch (err) {
        dispatch({
            type: DATA_INSERTED_FAILED,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        });
    }
}
