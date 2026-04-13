import React,{ useState,useEffect } from 'react';

function App() {
  const [name, setName] = useState("");
  const [roomName, setRoomName] = useState("");
const [employees, setEmployees] = useState([]);
const [rooms,setRooms] = useState([]);

const API="http://127.0.0.1:8000";


useEffect(()=>{  
  fetch(API+ "/get_employees").then(res=>res.json()).then(data=> {console.log("Employees:",data);
    setEmployees(data)});
  fetch(API + "/get_rooms").then(res=>res.json()).then(data=> {console.log("Rooms:",data);
     setRooms(data)});
},[]);

const addEmployee= async()=>{
  await fetch(API + "/employees?name=" + name,{method:"POST"});
  window.location.reload();
};
  const addRoom=async()=>{
  await fetch(API + "/rooms?name=" + roomName,{method:"POST"});
  window.location.reload();
};
return (
     <div>
      <h2>Employee Room System</h2>

      <h3>Add Employee</h3>
      <input value={name} onChange={e => setName(e.target.value)}/>
      <button onClick={addEmployee}>Add</button>

      <h3>Add Room</h3>
      <input value={roomName} onChange={e => setRoomName(e.target.value)}/>
      <button onClick={addRoom}>Add</button>

      <h3>Employees</h3>
      <ul>
        {employees.map(e =><li key={e.id}>{e.name}</li>)}
      </ul>

      <h3>Rooms</h3>
      <ul>
        {rooms.map(r => <li key={r.id}>{r.room_name}</li>)}
      </ul>
    </div>
  );
}

export default App;
 