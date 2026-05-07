import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const Rooms = () => {
  const [form, setForm] = useState({ 
    room_name: '', 
    floor_no: '', 
    occupancy: '', 
   
  });
  const [rooms, setRooms] = useState({ data: [], total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(false);
   const [entriesPerPage,setEntriesPerPage]=useState(5);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [editForm, setEditForm] = useState({
    room_name: '',
    floor_no: '',
    occupancy: ''

  });
  const [saving, setSaving] = useState(false);
  
  const API = "http://127.0.0.1:8000";

  useEffect(() => {
    fetchRooms();
  }, [rooms.page, entriesPerPage]);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/rooms?page=${rooms.page}&limit=${entriesPerPage}`);
      const data = await res.json();
      setRooms(data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  const addRoom = async () => {
    const { room_name, floor_no, occupancy } = form;
    if (!room_name || !floor_no || !occupancy) {
      toast.error("Please fill all fields");
      return;
    }
    
    const res = await fetch(`${API}/rooms?room_name=${room_name}&floor_no=${floor_no}&occupancy=${occupancy}`, 
      { method: "POST" }
    );
    
    if (res.ok) {
      setForm({ room_name: '', floor_no: '', occupancy: ''});
      const newTotalPages = Math.ceil((rooms.total + 1) / 5);
      setRooms({ ...rooms, page: newTotalPages });
      fetchRooms();
      toast.success("Room added successfully");
    } else {
      const error = await res.json();
      toast.error(error.detail);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this room?")) {
      const res = await fetch(`${API}/rooms/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchRooms();
        toast.success("Deleted successfully");
      } else {
        toast.error("Failed to delete");
      }
    }
  };

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= rooms.pages) {
      setRooms({ ...rooms, page: newPage });
    }
  };

 const handleEntriesChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setEntriesPerPage(newLimit);
    setRooms({...rooms,page:1});
};

  const openEditModal = (room) => {
    setSelectedRoom(room);
    setEditForm({
      room_name: room.room_name || '',
      floor_no: room.floor_no || '',
      occupancy: room.occupancy || '',
    
    });
    setShowModal(true);
  };


  const closeModal = () => {
    setShowModal(false);
    setSelectedRoom(null);
    setEditForm({
      room_name: '',
      floor_no: '',
      occupancy: '',
      
    });
  };


  const handleUpdate = async () => {
    const { room_name, floor_no, occupancy } = editForm;
    
    if (!room_name || !floor_no || !occupancy) {
      toast.error("Please fill all fields");
      return;
    }
    
    setSaving(true);
    
    try {
      const response = await fetch(`${API}/rooms/${selectedRoom._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: room_name,
          floor_no: floor_no,
          occupancy: occupancy,
         
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Room updated successfully!');
        closeModal();
        fetchRooms(); 
      } else {
        toast.error(data.detail || 'Failed to update employee');
      }
    } catch (error) {
      console.error("Error updating room:", error);
      toast.error('Failed to update room. Please try again.');
    } finally {
      setSaving(false);
    }
  };

   const startItem=(rooms.page-1) * entriesPerPage +1;
  const endItem= Math.min(rooms.page * entriesPerPage, rooms.total);


  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      
      <div className="flex flex-wrap -mx-4">
      
        <div className="w-full lg:w-1/3 px-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">Add New Room</h3>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Room Name" 
                 style={{marginRight: '20px'}}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.room_name} 
                onChange={e => setForm({...form, room_name: e.target.value})} 
              />
            
              <select 
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.floor_no}  style={{marginRight: '20px'}}
                onChange={e => setForm({...form, floor_no: e.target.value})}
              >
                <option value="">Select Floor No</option>
                <option value="Male">1</option>
                <option value="Female">2</option>
                <option value="Other">3</option>
                <option value="Other">4</option>
                <option value="Other">5</option>
                <option value="Other">6</option>
              </select>
              <input 
                type="text" 
                placeholder="Occupancy"  style={{marginRight: '20px'}}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.occupancy} 
                onChange={e => setForm({...form, occupancy: e.target.value})} 
              />
            
              <br></br>
               <br></br>
              
              <button 
                onClick={addRoom} 
               
                 type="button" className="btn btn-outline-dark"
                
              >
                Add Room
              </button>
              
            </div>
          </div>
        </div>
       <br></br>
       
  
        <div className="w-full lg:w-2/3 px-4 mb-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="details-header2 bg-gray-800 text-white p-4">
              <h3 className="text-xl font-bold">Room List</h3>
                <label  className="text-sm font-semibold text-gray-700" style={{marginRight: '10px'}} > Show entries:</label>
              <select value={entriesPerPage}  onChange={handleEntriesChange}   className="px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value={5}>5</option>
                 <option value={10}>10</option>
                  <option value={25}>25</option>
                   <option value={50}>50</option>
              </select>
               
             
              <div className="text-sm text-gray-600">
                Showing {startItem} to {endItem} of {rooms.total} entries
              </div>
             </div>
            
            
            <div className="overflow-x-auto h-96 w-96">
              <table className="table table-xs table-pin-rows table-pin-cols">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold table-primary" >ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold table-secondary">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold table-success">Floor No</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold table-danger">Occupancy</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold table-light">Edit</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold table-dark">Delete</th>
                  </tr>
                </thead>
                <tbody >
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-8">Loading...</td>
                    </tr>
                  ) : rooms.data.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-8">No rooms found</td>
                    </tr>
                  ) : (
                    rooms.data.map((room) => (
                      <tr key={room._id} className="border-b hover:bg-gray-50" >
                        <td className="px-4 py-2 text-sm table-primary">{room._id.slice(-6)}</td>
                        <td className="px-4 py-2 font-medium table-secondary">{room.room_name}</td>
                        <td className="px-4 py-2 table-success">{room.floor_no}</td>
                        <td className="px-4 py-2 table-danger">{room.occupancy}</td>
                        
                        <td className="px-4 py-2 text-center table-light">
                          <button 
                            onClick={() => openEditModal(room)}
                            type="button" className="btn btn-outline-primary"
                           
                          >
                            Edit
                          </button>
                        </td>
                        <td className="px-4 py-2 text-center table-dark">
                          <button 
                           type="button" className="btn btn-outline-danger"
                            
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
                  
                  className="px-4 py-2 bg-gray-300  btn btn-outline-dark rounded disabled:opacity-50 hover:bg-gray-400 transition"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {rooms.page} of {rooms.pages}
                </span>
                <button 
                  onClick={() => changePage(rooms.page + 1)} 
                  disabled={rooms.page === rooms.pages}
                  className="px-4 py-2 bg-gray-300 btn btn-outline-dark rounded disabled:opacity-50  hover:bg-gray-400 transition"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-400 rounded-lg shadow-xl max-w-2xl w-full mx-4">
             <button 
                onClick={closeModal} style={{position:'absolute', right:'200px'}}
                className="text-black btn btn-outline-danger hover:text-gray-300 text-2xl"
              >
                X
              </button>
            <div className="bg-gray-800 text-white p-4 rounded-t-lg flex justify-between items-center">
             
              <h3 className="text-xl font-bold">Edit Room</h3>
             
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Room Name *</label>
                  <input 
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.room_name} 
                    onChange={e => setEditForm({...editForm, room_name: e.target.value})} 
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Floor No *</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.floor_no}
                    onChange={e => setEditForm({...editForm, floor_no: e.target.value})}
                  >
                    <option value="">Select Floor No</option>
                    <option value="Male">1</option>
                    <option value="Female">2</option>
                    <option value="Other">3</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Occupancy *</label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.occupancy}
                    onChange={e => setEditForm({...editForm, occupancy: e.target.value})}
                    placeholder="Enter occupancy"
                  />
                </div>
                
              
                
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    
                    className="flex-1 bg-blue-600 btn btn-outline-primary text-white py-2 rounded hover:bg-blue-700 transition font-semibold disabled:opacity-50"
                    onClick={handleUpdate}
                    disabled={saving}
                  >
                    {saving ? 'Updating...' : 'Update Room'}
                  </button>
                  <p></p>
                  <button 
                    type="button" 
                    className="flex-1 bg-gray-500 btn btn-outline-danger text-white py-2 rounded hover:bg-gray-600 transition font-semibold"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
