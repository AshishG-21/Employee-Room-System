import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Rooms = () => {
  const [form, setForm] = useState({ 
    room_name: '', 
    floor_no: '', 
    size: '',
  });
  const [rooms, setRooms] = useState({ data: [], total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(false);
  const API = "http://127.0.0.1:8000";

  useEffect(() => {
    fetchRooms();
  }, [rooms.page]);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/rooms?page=${rooms.page}&limit=5`);
      const data = await res.json();
      setRooms(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const addRoom = async () => {
    const { room_name, floor_no, size } = form;
    if (!room_name || !floor_no || !size) {
      alert("Please fill all fields");
      return;
    }
    
    const res = await fetch(`${API}/rooms?room_name=${room_name}&floor_no=${floor_no}&size=${size}`, 
      { method: "POST" }
    );
    
    if (res.ok) {
      setForm({ room_name: '', floor_no: '', size: '' });
      
      const newTotalPages = Math.ceil((rooms.total + 1) / 5);
      setRooms({ ...rooms, page: newTotalPages });
      fetchRooms();
      alert("Room added successfully");
    } else {
      const error = await res.json();
      alert(error.detail);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this room?")) {
      const res = await fetch(`${API}/rooms/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchRooms();
        alert("Deleted successfully");
      }
    }
  };

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= rooms.pages) {
      setRooms({ ...rooms, page: newPage });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap -mx-4">
    
        <div className="w-full lg:w-1/3 px-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">Add New Room</h3>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Room Name" 
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.room_name} 
                onChange={e => setForm({...form, room_name: e.target.value})} 
              />
              <input 
                type="number" 
                placeholder="Floor Number" 
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.floor_no} 
                onChange={e => setForm({...form, floor_no: e.target.value})}
              />
              
              
               <select 
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.size} 
                onChange={e => setForm({...form, size: e.target.value})}
              >
                <option value="">Select Size</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
              <button 
                onClick={addRoom} 
                className="w-full bg-blue-600 text-black py-2 rounded hover:bg-blue-700 transition font-semibold"
              >
                Add Room
              </button>
            </div>
          </div>
        </div>
       <br></br>
        
        <div className="w-full lg:w-2/3 px-4 mb-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="details-header2 bg-gray-800 text-white p-3">
              <h3 className="text-xl font-bold">Room List</h3>
              <p className="text-sm text-gray-300">Total: {rooms.total} rooms</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="table border border-3 border-info">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Floor Number</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Size</th>
                    
                    <th className="px-4 py-3 text-center text-sm font-semibold">Edit</th>
                     <th className="px-4 py-3 text-center text-sm font-semibold">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-8">Loading...</td>
                    </tr>
                  ) : rooms.data.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-8">No rooms found</td>
                    </tr>
                  ) : (
                    rooms.data.map((room) => (
                      <tr key={room._id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm">{room._id.slice(-6)}</td>
                        <td className="px-4 py-2 font-medium">{room.room_name}</td>
                        <td className="px-4 py-2">{room.floor_no}</td>
                        <td className="px-4 py-2">{room.size}</td>
                       
                        <td className="px-4 py-2 text-center space-x-2">
                          <Link 
                            to={`/roomsedit/${room._id}`} 
                            className="btn btn-warning"
                          >
                            Edit
                          </Link>
                          </td>
                          <td className="px-4 py-2 text-center">
                          <button 
                             className='btn btn-danger'
                            onClick={() => handleDelete(room._id)}
                          >
                            Delete
                          </button>
                        </td>
                       </tr>
                    ))
                  )}
                </tbody>
               </table>
            </div>

          
            {rooms.pages > 1 && (
              <div className="flex justify-center items-center gap-2 py-4 bg-gray-50">
                <button 
                  onClick={() => changePage(rooms.page - 1)} 
                  disabled={rooms.page === 1}
                  className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {rooms.page} of {rooms.pages}
                </span>
                <button 
                  onClick={() => changePage(rooms.page + 1)} 
                  disabled={rooms.page === rooms.pages}
                  className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
