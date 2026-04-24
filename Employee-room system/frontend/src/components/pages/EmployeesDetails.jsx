import React, { useState, useEffect } from 'react';
import axios from 'axios';
const EmployeeDetails = () => {
/********************** */
const [employees,setEmployees]=useState([]);
const [name, setName] = useState("");
  const [address, setAddress] = useState("");
const API = "http://127.0.0.1:8000";


useEffect(()=>{
  axios.get(`${API}/employees`)
  .then(result=>setEmployees(result.data))
  .catch(err=>console.log(err))
},[])




    return (
     <div>
        
      <center>
        
    <h1  className="details-header" style={{padding:"70px"}}><u><b>Employee Details</b></u></h1>
    <div className='w-75 bg-white rounded p-3' >
       
<table className='table border border-3 border-info'  >
<thead>
    <tr>
    <th>Employee ID</th> 
    <th>Name</th>   
    <th>Gender</th> 
    <th>Address</th>
    <th>Email ID</th>
    <th>Contact No</th>
    <th>Edit</th>
    
    </tr>
</thead>
<tbody >
{
    employees.map((e)=>(
     <tr>
         <td>{e._id}</td>
            <td  key={e._id}>{e.name}</td>
            <td>{e.gender}</td>
            <td>{e.address}</td>
            <td>{e.email}</td>
            <td>{e.contact}</td>
            <td><button className="btn btn-warning">Edit</button></td>
           
        </tr>
    ))
}

</tbody>

</table>
<br/><br/><br/><br/><br/>
    </div>


    </center>

    </div>

        
  );
};

export default EmployeeDetails;