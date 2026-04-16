import React,{ useState,useEffect } from 'react';

function App() {
  const [name, setName] = useState("");
  const [roomName, setRoomName] = useState("");
const [employees, setEmployees] = useState([]);
const [rooms,setRooms] = useState([]);
const [employeeID,setEmployeeID]=useState("");
const [roomID,setRoomID]=useState("");

const [assignments,setAssignments]= useState([]); 

const API="http://127.0.0.1:8000";


useEffect(()=>{  
  fetch(API+ "/get_employees").then(res=>res.json()).then(data=> setEmployees(data));
  fetch(API + "/get_rooms").then(res=>res.json()).then(data=> setRooms(data));
  fetch(API+"/assignments").then(res=>res.json()).then(data=> setAssignments(data));
},[]);

const addEmployee= async()=>{
  await fetch(API + "/employees?name=" + name,{method:"POST"});
  window.location.reload();
};
  const addRoom=async()=>{
  await fetch(API + "/rooms?name=" + roomName,{method:"POST"});
  window.location.reload();
};
const addAssignment= async()=>{
  await fetch(API+"/assign?employee_id="+ employeeID+"&room_id="+ roomID,{method:"POST"});
  window.location.reload();
};


return (
  
     <div style={{padding:5, fontFamily:"Arial",background:"grey"}}>
      <h2 style={{color:"white",background:"black"}}><center><b>Employee-Room Assignment System</b></center></h2>

      <div className="card p-3 mb-3" style={{width: "18rem"}}>
        <div className="card-body">
      <h3 className="card-header" ><b>Add employees:</b></h3>
     <p> <img src="https://www.commbox.io/wp-content/uploads/2023/12/6-Best-Ways-to-Keep-Your-Employees-Happy.jpg" className="card-img-top"></img></p>
    <input value={name} onChange={e => setName(e.target.value)} />
      <button type="button" class="btn btn-primary" onClick={addEmployee} style={{color:"black"}}>Add</button>
      </div>
      </div>
      
     <div className="card p-3 mb-3" style={{width: "18rem"}}>
        <div className="card-body">
      <h3  className="card-header" ><b>Add rooms:</b></h3>
     <p> <img src="https://fohfurniture.com/wp-content/uploads/2020/01/FOH-JCED202-scaled.jpg" className="card-img-top"></img></p>
      <input value={roomName} onChange={e => setRoomName(e.target.value)}/>
      <button type="button" className="btn btn-danger" onClick={addRoom} style={{color:"black"}}>Add</button>
      </div>
      </div>

      <div className="card p-3 mb-3" style={{width: "18rem"}}>
        <div className="card-body">
      <h3 className="card-header"><b>Assign:</b></h3>
      <input value={employeeID} onChange={e=> setEmployeeID(e.target.value)}/>
       <input value={roomID} onChange={e=> setRoomID(e.target.value)}/>
        <button type="button" className="btn btn-warning" onClick={addAssignment} style={{color:"black"}}>Assign</button>
        </div>
        </div>
       
       <div className="accordion">
       <div className="accordion-item">
      <h3 className="accordion-header">
      <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
        <b><u>Employees</u></b>
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
      <b><u>Rooms</u></b></button></h3>
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
          <b><u>Assignments</u></b></button></h3>
          <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
      <div className="accordion-body">
      <ul  className="list-group">
      {assignments.map(a=> <li className="list-group-item" key={a.employee_id}>Employee no.{a.employee_id} is assigned to Room no.{a.room_id}</li>)}
      </ul>
    </div>
    </div></div></div></div>

  );
}

export default App;
 
