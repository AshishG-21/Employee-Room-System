import React, { useState, useEffect } from 'react';
import axios from 'axios';
const RoomsDetails = () => {
/********************** */
const [rooms,setRooms]=useState([]);
const [name, setName] = useState("");
  const [address, setAddress] = useState("");
const API = "http://127.0.0.1:8000";


useEffect(()=>{
  axios.get(`${API}/rooms`)
  .then(result=>setRooms(result.data))
  .catch(err=>console.log(err))
},[])




    return (
     <div>
        
      <center>
        
     <h1 className="details-header" style={{padding:"70px"}}><b><u>Room Details</u></b></h1>
    <div className='w-75 bg-white rounded p-3'>
       
<table className='table border border-3 border-info' >
<thead>
    <tr>
    <th>Room ID</th> 
    <th>Name</th>   
    <th>Floor No</th> 
    <th>Size</th>
    <th>Edit</th>
    
    </tr>
</thead>
<tbody>
{
    rooms.map((r)=>(
     <tr>
         <td>{r._id}</td>
            <td  key={r._id}>{r.room_name}</td>
            <td>{r.floor_no}</td>
            <td>{r.size}</td>
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

export default RoomsDetails;