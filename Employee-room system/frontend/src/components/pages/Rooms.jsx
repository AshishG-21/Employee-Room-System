import React, { useState, useEffect } from 'react';

const Rooms = () => {
  const [roomName, setRoomName] = useState("");
    const [floorNo, setFloorNo] = useState("");
    const [size, setSize] = useState("");
  const [rooms, setRooms] = useState([]);
  const API = "http://127.0.0.1:8000";

  useEffect(() => {
    fetch(API + "/rooms")
      .then(res => res.json())
      .then(data => setRooms(data));
  }, []);

  const addRoom = async () => {
    if (!roomName.trim()) {
      alert("Enter room name");
      return;
    }
    if (!floorNo.trim()) {
      alert("Enter floor number");
      return;
    }
    const res = await fetch(API + "/rooms?name=" + roomName + "&floor_no=" + floorNo + "&size=" + size, { method: "POST" });
    const data = await res.json();

    if (!res.ok) {
      alert(data.detail);
      return;
    }

    setRooms([...rooms, data]);
    setRoomName("");
    setFloorNo("");
    setSize("");
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <div className="card p-4 mb-4">
            <div className="card-body">
              <h3 className="card-header"><b>Add Rooms:</b></h3>
              <p>
                <img 
                  src="https://fohfurniture.com/wp-content/uploads/2020/01/FOH-JCED202-scaled.jpg" 
                  className="card-img-top" 
                  alt="Rooms"
                  style={{ width: "100%", height: "auto" }}
                />
              </p>
              Room name:
              <input 
                className="form-control mt-2 mb-2" 
                value={roomName} 
                onChange={(e) => setRoomName(e.target.value)} 
              />
              Floor no:
              <input 
                className="form-control mt-2 mb-2"
                value={floorNo}
                onChange={(e) => setFloorNo(e.target.value)}
              />
              Size:
              <input 
                className="form-control mt-2 mb-2"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              />
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={addRoom}
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="accordion">
            <div className="accordion-item">
              <h3 className="accordion-header">
                <button 
                  className="accordion-button collapsed" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target="#collapseRooms"
                >
                  <b><u>Rooms List</u></b>
                </button>
              </h3>
              <div id="collapseRooms" className="accordion-collapse collapse">
                <div className="accordion-body">
                  <ol className="list-group">
                    {rooms.map((r) => (
                      <li className="list-group-item" key={r._id}>{r.room_name} - Floor {r.floor_no} - {r.size}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms;