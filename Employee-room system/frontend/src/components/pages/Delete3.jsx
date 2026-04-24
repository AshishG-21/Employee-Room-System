import React, { useState, useEffect } from 'react';

const Delete3 = () => {
    const [booking, setBooking] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState("");
    const [message, setMessage] = useState("");
    const API = "http://127.0.0.1:8000";

useEffect(() => {
    fetchBooking();
}, []);

const fetchBooking = async () => {
    try {
        const res = await fetch(API + "/assignments");
        const data = await res.json();
        setBooking(data);
    } catch (error) {
        console.error("Error fetching booking:", error);
    }
};

const deleteBooking = async (booking_id) => {
    try {
        const res = await fetch(API + "/assignments/" + booking_id, { method: "DELETE" });
        if (!res.ok) {
            const data = await res.json();
            alert(data.detail);
            return;
        }
        setBooking([]);
    } catch (error) {
        console.error("Error deleting booking:", error);
    }
};

return (
    <div className="container mt-4">
        <div className="row">
            <div className="col-md-6">
                <div className="card p-4 mb-4">
                    <div className="card-body">
                        <h3 className="card-header" style={{ width: "11.8223rem" }}><b>Delete Bookings:</b></h3>
                        <p>
                        
                            <select
                                className="form-select mt-2 mb-2"
                                value={selectedBooking}
                                onChange={(e) => setSelectedBooking(e.target.value)}
                            >
                                <option value="">Select Booking</option>
                                {booking.map((b) => (
                                    <option key={b._id} value={b._id}>
                                        {b.employee_id} - {b.room_id} ({b.start} to {b.end})
                                    </option>
                                ))}
                            </select>
                        </p>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => deleteBooking(selectedBooking)}
                        >
                            Delete Booking
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
};

export default Delete3;