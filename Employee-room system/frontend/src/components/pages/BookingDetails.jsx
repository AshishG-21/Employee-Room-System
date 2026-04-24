import React, { useState, useEffect } from 'react';
import axios from 'axios';
const BookingDetails = () => {
/********************** */
const [employeeID, setEmployeeID] = useState("");
  const [roomID, setRoomID] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [employees, setEmployees] = useState([]);
  const [rooms, setRooms] = useState([]);
const [bookings,setBookings]=useState([]);
const [name, setName] = useState("");
  const [address, setAddress] = useState("");
const API = "http://127.0.0.1:8000";


useEffect(()=>{
  axios.get(`${API}/assignments`)
  .then(result=>setBookings(result.data))
  .catch(err=>console.log(err))
},[])




    return (
     <div>
        
      <center>
        
    <h1 className="details-header" style={{padding:"70px"}}><b><u>Booking Details</u></b></h1>
    <div className='w-75 bg-white rounded p-3'>
       
<table className='table border border-3 border-info ' >
<thead>
    <tr>
    
    <th>Employee ID</th>   
    <th>Room ID</th> 
    <th>Start</th>
    <th>End</th>
    <th>Edit</th>
    
    </tr>
</thead>
<tbody>
{
    bookings.map((b)=>(
     <tr>
         
            <td  key={b._id}>{b.employee_id}</td>
            <td>{b.room_id}</td>
            <td>{b.start}</td>
            <td>{b.end}</td>
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

export default BookingDetails;