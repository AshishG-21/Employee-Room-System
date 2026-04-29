import React, { useState, useEffect } from 'react';

const Book = () => {
  const [booking, setBooking] = useState({ employee_id: '', room_id: '', start: '', end: '' });
  const [employees, setEmployees] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState({ data: [], total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(false);
  const API = "http://127.0.0.1:8000";

  useEffect(() => {
    fetchEmployees();
    fetchRooms();
    fetchBookings();
  }, [bookings.page]);

  const fetchEmployees = async () => {
    const res = await fetch(`${API}/employees/all`);
    const data = await res.json();
    setEmployees(data);
  };

  const fetchRooms = async () => {
    const res = await fetch(`${API}/rooms/all`);
    const data = await res.json();
    setRooms(data);
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/assignments?page=${bookings.page}&limit=5`);
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const addBooking = async () => {
    const { employee_id, room_id, start, end } = booking;
    if (!employee_id || !room_id || !start || !end) {
      alert("Please fill all fields");
      return;
    }
    
    const res = await fetch(`${API}/assign?employee_id=${employee_id}&room_id=${room_id}&start=${start}&end=${end}`, 
      { method: "POST" }
    );
    
    if (res.ok) {
      setBooking({ employee_id: '', room_id: '', start: '', end: '' });
      fetchBookings();
      alert("Room booked successfully");
    } else {
      const error = await res.json();
      alert(error.detail);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Cancel this booking?")) {
      const res = await fetch(`${API}/assignments/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchBookings();
        alert("Booking cancelled");
      }
    }
  };

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= bookings.pages) {
      setBookings({ ...bookings, page: newPage });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap -mx-4">
  
        <div className="w-full lg:w-1/2 px-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4"><u>Book a Room</u></h3>
            <div className="space-y-3">
              <select className="w-full p-2 border rounded" value={booking.employee_id} 
                onChange={e => setBooking({...booking, employee_id: e.target.value})}>
                <option value="">Select Employee</option>
                {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name}</option>)}
              </select>
              
              <select className="w-full p-2 border rounded" value={booking.room_id}
                onChange={e => setBooking({...booking, room_id: e.target.value})}>
                <option value="">Select Room</option>
                {rooms.map(room => <option key={room._id} value={room._id}>{room.room_name}</option>)}
              </select>
              
              <input type="datetime-local" className="w-full p-2 border rounded"
                value={booking.start} onChange={e => setBooking({...booking, start: e.target.value})} />
              <input type="datetime-local" className="w-full p-2 border rounded"
                value={booking.end} onChange={e => setBooking({...booking, end: e.target.value})} />
              
              <button onClick={addBooking} className="w-full bg-green-600 text-black py-2 rounded hover:bg-green-700">
                Book Room
              </button>
            </div>
          </div>
        </div>

  
        <div className="w-full lg:w-1/2 px-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Bookings ({bookings.total})</h3>
            
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
              <>
                <div className="space-y-2">
                  {bookings.data.map(b => (
                    <div key={b._id} className="bg-gray-50 p-3 rounded border">
                      <div className="font-semibold">{b.employee_name}</div>
                      <div className="text-sm">Room: {b.room_name}</div>
                      <div className="text-sm">From: {new Date(b.start).toLocaleString()}</div>
                      <div className="text-sm">To: {new Date(b.end).toLocaleString()}</div>
                      <button onClick={() => handleDelete(b._id)} className="mt-2 bg-red-500 text-black px-3 py-1 rounded text-sm">
                        Cancel
                      </button>
                    </div>
                  ))}
                </div>

                {bookings.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    <button onClick={() => changePage(bookings.page - 1)} disabled={bookings.page === 1}
                      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">
                      Prev
                    </button>
                    <span className="px-3 py-1">Page {bookings.page} of {bookings.pages}</span>
                    <button onClick={() => changePage(bookings.page + 1)} disabled={bookings.page === bookings.pages}
                      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Book;
