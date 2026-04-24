import React, { useState, useEffect } from 'react';

const Book = () => {
  const [employeeID, setEmployeeID] = useState("");
  const [roomID, setRoomID] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [employees, setEmployees] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const API = "http://127.0.0.1:8000";

  useEffect(() => {
    fetch(API + "/employees")
      .then(res => res.json())
      .then(data => setEmployees(data));
    
    fetch(API + "/rooms")
      .then(res => res.json())
      .then(data => setRooms(data));
    
    fetch(API + "/assignments")
      .then(res => res.json())
      .then(data => setBookings(data));
  }, []);

  const addAssignment = async () => {
    if (!employeeID || !roomID || !start || !end) {
      alert("Please select employee, room, start time and end time");
      return;
    }

    const res = await fetch(
      `${API}/assign?employee_id=${employeeID}&room_id=${roomID}&start=${start}&end=${end}`, 
      { method: "POST" }
    );
    const data = await res.json();

    if (!res.ok) {
      alert(data.detail);
      return;
    }

    setBookings([...bookings, data]);
    setEmployeeID("");
    setRoomID("");
    setStart("");
    setEnd("");
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <div className="card p-4 mb-4">
            <div className="card-body">
              <h3 className="card-header"><b>Assign Room</b></h3>
              
              <div className="mb-3 mt-3">
                <label className="form-label">Select Employee:</label>
                <select 
                  className="form-select" 
                  value={employeeID} 
                  onChange={e => setEmployeeID(e.target.value)}
                >
                  <option value="">Select Employee</option>
                  {employees.map(e => (
                    <option key={e._id} value={e._id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Select Room:</label>
                <select 
                  className="form-select" 
                  value={roomID} 
                  onChange={e => setRoomID(e.target.value)}
                >
                  <option value="">Select Room</option>
                  {rooms.map(r => (
                    <option key={r._id} value={r._id}>
                      {r.room_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Start Time:</label>
                <input 
                  type="datetime-local" 
                  className="form-control" 
                  value={start} 
                  onChange={e => setStart(e.target.value)} 
                />
              </div>

              <div className="mb-3">
                <label className="form-label">End Time:</label>
                <input 
                  type="datetime-local" 
                  className="form-control" 
                  value={end} 
                  onChange={e => setEnd(e.target.value)} 
                />
              </div>

              <button 
                className="btn btn-success" 
                onClick={addAssignment}
              >
                Book
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="accordion">
            <div className="accordion-item">
              <h3 className="accordion-header">
                <button 
                  className="accordion-button" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target="#collapseBookings"
                >
                  <b><u>Bookings List</u></b>
                </button>
              </h3>
              <div id="collapseBookings" className="accordion-collapse collapse show">
                <div className="accordion-body">
                  <ul className="list-group">
                    {bookings.map((b) => (
                      <li className="list-group-item" key={b._id}>
                        Employee ID: {b.employee_id}<br/>
                         Room ID: {b.room_id}<br/>
                        Time: {b.start} to {b.end}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Book;