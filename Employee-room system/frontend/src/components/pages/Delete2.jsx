import React, { useState, useEffect } from 'react';

const Delete2 = () => {
    const [room, setRoom] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState("");
    const [message, setMessage] = useState("");
    const API = "http://127.0.0.1:8000";

useEffect(() => {
    fetchRooms();
}, []);

const fetchRooms = async () => {
    try {
        const res = await fetch(API + "/rooms");
        const data = await res.json();
        setRoom(data);
    } catch (error) {
        console.error("Error fetching rooms:", error);
    }
};

const deleteRoom = async (room_id) => {
    try {
        const res = await fetch(API + "/rooms/" + room_id, { method: "DELETE" });
        if (!res.ok) {
            const data = await res.json();
            alert(data.detail);
            return;
        }
        setRoom([]);
    } catch (error) {
        console.error("Error deleting room:", error);
    }
};

return (
    <div className="container mt-4">
        <div className="row">
            <div className="col-md-6">
                <div className="card p-4 mb-4">
                    <div className="card-body">
                        <h3 className="card-header" style={{ width: "11.8223rem" }}><b>Delete Rooms:</b></h3>
                        <p>
                        
                            <select
                                className="form-select mt-2 mb-2"
                                value={selectedRoom}
                                onChange={(e) => setSelectedRoom(e.target.value)}
                            >
                                <option value="">Select Room</option>
                                {room.map((r) => (
                                    <option key={r._id} value={r._id}>
                                        {r.room_name}
                                    </option>
                                ))}
                            </select>
                        </p>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => deleteRoom(selectedRoom)}
                        >
                            Delete Room
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
};

export default Delete2;