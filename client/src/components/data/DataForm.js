import React, { useState, Fragment } from "react";
import { useDispatch } from "react-redux";
import { CREATE_CITY_MUTATION } from "../../graphql/queries";
import { useMutation } from "@apollo/client";


const DataForm = ({ insertData, edit }) => {
  const [formData, setFormData] = useState({
    city: "",
    pop: "",
  });

  const { city,  pop } = formData;

  
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData)
  }
    

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formData) 
      return;
    
      createCity();
    setFormData({ city: "", pop: "" });
    
  };

  const [createCity, { error }] = useMutation(CREATE_CITY_MUTATION, {
    variables: formData,
    update(_, result) {
      console.log(result)
    },
    onError(err){
      console.log(err)
    }
  });
  
  return (
    <Fragment>
      <tr>
        <th className="data-input2">
          <form className="form ">
            <input
              className="form-control"
              type="text"
              name="city"
              placeholder="Stadt"
              value={city}
              onChange={(e) => onChange(e)}
              required
            ></input>
          </form>
        </th>
        <th className="data-input2">
          <form className="form ">
            <input
              className="form-control"
              type="number"
              name="pop"
              placeholder="Bevölkerung"
              value={pop}
              onChange={(e) => onChange(e)}
              required
            ></input>
              </form>
        </th>

        <th>
          <form className="form " onSubmit={(e) => onSubmit(e)}>
            <input type="submit" className="btn btn-primary" value="Submit" />
          </form>
        </th>
       </tr>
    </Fragment>
  );
};



export default DataForm;
