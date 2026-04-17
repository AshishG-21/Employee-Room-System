import React,{ useState,useEffect } from 'react';
import "./App.css";
function App() {
  const [name, setName] = useState("");
  const [roomName, setRoomName] = useState("");
const [employees, setEmployees] = useState([]);
const [rooms,setRooms] = useState([]);
const [employeeID,setEmployeeID]=useState("");
const [roomID,setRoomID]=useState("");
const [start,setStart]=useState("");
const [end,setEnd]=useState("");
const [bookings,setBookings]=useState([]);
const API="http://127.0.0.1:8000";


useEffect(()=>{  
  fetch(API+ "/get_employees").then(res=>res.json()).then(data=> setEmployees(data));
  fetch(API + "/get_rooms").then(res=>res.json()).then(data=> setRooms(data));
  fetch(API+"/bookings").then(res=>res.json()).then(data=> setBookings(data));
},[]);

const addEmployee= async()=>{
  await fetch(API + "/employees?name=" + name,{method:"POST"});
  window.location.reload();
};
  const addRoom=async()=>{
  await fetch(API + "/rooms?name=" + roomName,{method:"POST"});
  window.location.reload();
};

const bookRoom= async()=>{
  await fetch(API+"/book?employee_id=" + employeeID + "&room_id=" + roomID +"&start=" + start + "&end=" + end,{method:"POST"});
  window.location.reload();
};

return (
  
     <div style={{padding:5, fontFamily:"Arial",background:"grey"}}>
      <h2 style={{color:"white",background:"black"}}><center><b>Employee-Room Booking System</b></center></h2>
     <div className="container mt-4">
  <div className="row">
    <div className="col-md-4">
      <div className="card p-3 mb-3" style={{width: "18rem"}}>
        <div className="card-body">
      <h3 className="card-header" ><b>Add employees:</b></h3>
     <p> <img src="https://www.commbox.io/wp-content/uploads/2023/12/6-Best-Ways-to-Keep-Your-Employees-Happy.jpg" className="card-img-top"></img></p>
    Employee name:
    <input value={name} onChange={e => setName(e.target.value)} />
      <button type="button" class="btn btn-primary" onClick={addEmployee} style={{color:"black"}}>Add</button>
      </div>
      </div>
      </div>
      
      <div className="col-md-4">
     <div className="card p-4 mb-4" style={{width: "18rem"}}>
        <div className="card-body">
      <h3  className="card-header" ><b>Add rooms:</b></h3>
     <p> <img src="https://fohfurniture.com/wp-content/uploads/2020/01/FOH-JCED202-scaled.jpg" className="card-img-top" ></img></p>
    <br></br>
      
      Room name:
      <input value={roomName} onChange={e => setRoomName(e.target.value)}/>
      <button type="button" className="btn btn-danger" onClick={addRoom} style={{color:"black"}}>Add</button>
      </div>
      </div></div>


    
      <div className="card p-3 mb-3" style={{width: "18rem"}}>
        <div className="card-body">
      <h3 className="card-header"><b>Assign:</b></h3>
      <br></br>
      
      Employee ID:<input value={employeeID} onChange={e=> setEmployeeID(e.target.value)}/>
       Room ID:<input value={roomID} onChange={e=> setRoomID(e.target.value)}/>
       Starting time:<input type="time" onChange={e=> setStart(e.target.value)}/>
       Ending time:<input type="time" onChange={e=> setEnd(e.target.value)}/>
        <button type="button" className="btn btn-warning" onClick={bookRoom} style={{color:"black"}}>Book</button>
        
        </div>
        </div></div></div>
       
       <div className="accordion">
       <div className="accordion-item">
      <h3 className="accordion-header">
      <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
        <b><u>Employees List</u></b>
      </button>
      </h3>
      <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
      <div className="accordion-body">
      <ol className="list-group">
        {employees.map(e =><li key={e.id}>{e.name}</li>)}
      </ol >
      </div></div></div></div>
      
      <div className="accordion">
       <div className="accordion-item">
      <h3 className="accordion-header">
      <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
      <b><u>Rooms List</u></b></button></h3>
      <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
      <div className="accordion-body">
      <ol  className="list-group">
        {rooms.map(r => <li key={r.id}>{r.room_name}</li>)}
      </ol>
      </div></div></div></div>

      <div className="accordion">
       <div className="accordion-item">
      <h3 className="accordion-header">
        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
          <b><u>Bookings List</u></b></button></h3>
          <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
      <div className="accordion-body">
      <ul  className="list-group">
      {bookings.map(a=> <li className="list-group-item" key={a.room_id}>From {a.start} to {a.end} room no.{a.room_id} is booked by employee no.{a.employee_id}</li>)}
      </ul>
    </div>
    </div></div></div></div>

  );
}

export default App;
 
