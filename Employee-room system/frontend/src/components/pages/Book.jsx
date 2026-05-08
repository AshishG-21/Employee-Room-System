import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const Book = () => {
  const [form, setForm] = useState({
      employee_id: '',
      room_id: '',
      start: '',
      end: ''
    
    });
 
  const [employees, setEmployees] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState({ data: [], total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(false);
   const [entriesPerPage,setEntriesPerPage]=useState(5);
   const [showModal, setShowModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
     const [editForm, setEditForm] = useState({
      employee_id: '',
      room_id: '',
      start: '',
      end: ''
    
    });

    const [saving, setSaving] = useState(false);
  const API = "http://127.0.0.1:8000";

  useEffect(() => {
    fetchEmployees();
    fetchRooms();
    fetchBookings();
  }, [bookings.page, entriesPerPage]);

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
      const res = await fetch(`${API}/assignments?page=${bookings.page}&limit=${entriesPerPage}`);
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to fetch assignments");
    } finally {
      setLoading(false);
    }
  };

  const addBooking = async () => {
    const { employee_id, room_id, start, end } = form;
    if (!employee_id || !room_id || !start || !end) {
      toast.error("Please fill all fields");
      return;
    }
    
    const res = await fetch(`${API}/assignments/assign?employee_id=${employee_id}&room_id=${room_id}&start=${start}&end=${end}`, 
      { method: "POST" }
    );
    
    if (res.ok) {
      setForm({ employee_id: '', room_id: '', start: '', end: '' });
       setBookings({...bookings,page:1}); 
      toast.success("Room booked successfully");
    } else {
      const error = await res.json();
      toast.error(error.detail);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Cancel this booking?")) {
      const res = await fetch(`${API}/assignments/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchBookings();
        toast.success("Booking cancelled");
         } else {
      const error = await res.json();
      toast.error(error.detail);
    }
      }
    };
  

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= bookings.pages) {
      setBookings({ ...bookings, page: newPage });
    }
  };

   const handleEntriesChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setEntriesPerPage(newLimit);
    setBookings({...bookings,page:1});
};

  const openEditModal = (booking) => {
    setSelectedBooking(booking);
    setEditForm({
      employee_id: booking.employee_id || '',
      room_id: booking.room_id || '',
      start: booking.start || '',
      end:booking.end
    });
    setShowModal(true);
  };


  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
    setEditForm({
      employee_id: '',
      room_id: '',
      start: '',
      end:''
    });
  };

   const handleUpdate = async () => {
    const { employee_id, room_id, start, end } = editForm;
    
    if (!employee_id || !room_id || !start || !end) {
      toast.error("Please fill all fields");
      return;
    }
    
    setSaving(true);
    
    try {
      const response = await fetch(`${API}/assignments/${selectedBooking._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employee_id: employee_id,
          room_id: room_id,
          start: start,
          end: end
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Booking updated successfully!');
        closeModal();
        fetchBookings(); 
      } else {
        toast.error(data.detail || 'Failed to update booking');
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error('Failed to update booking. Please try again.');
    } finally {
      setSaving(false);
    }
  };

   const startItem=(bookings.page-1) * entriesPerPage +1;
  const endItem= Math.min(bookings.page * entriesPerPage, bookings.total);



  return (
    <div className="container mx-auto px-4 py-8">
       <Toaster position="top-right" />
            
      <div className="flex flex-wrap -mx-4">
  
        <div className="w-full lg:w-1/2 px-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Book a Room</h3>
            <div className="space-y-3">
              <select className="w-full p-2 border rounded" value={form.employee_id} 
               style={{marginRight: '20px'}}
                onChange={e => setForm({...form, employee_id: e.target.value})}>
                <option value="">Select Employee</option>
                {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name}</option>)}
              </select>
              
              <select className="w-full p-2 border rounded" value={form.room_id}
               style={{marginRight: '20px'}}
                onChange={e => setForm({...form, room_id: e.target.value})}>
                <option value="">Select Room</option>
                {rooms.map(room => <option key={room._id} value={room._id}>{room.room_name}</option>)}
              </select>
              
              <input type="datetime-local" className="w-full p-2 border rounded"
               style={{marginRight: '20px'}}
                value={form.start} onChange={e => setForm({...form, start: e.target.value})} />
              <input type="datetime-local" className="w-full p-2 border rounded"
               style={{marginRight: '20px'}}
                value={form.end} onChange={e => setForm({...form, end: e.target.value})} />
              
              <button  onClick={addBooking} className="w-full bg-green-600  py-2 rounded hover:bg-green-700 btn btn-outline-dark">
                Book Room
              </button>
            </div>
          </div>
        </div>
        <br></br>
          <div className="w-full lg:w-2/3 px-4 mb-8">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden" >
                    <div className="details-header2 bg-gray-800 text-white p-3">
                      <h3 className="text-xl font-bol" >Booking List</h3>
                         <label  className="text-sm font-semibold text-gray-700" style={{marginRight: '10px'}} > Show entries:</label>
              <select value={entriesPerPage}  onChange={handleEntriesChange}   className="px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value={5}>5</option>
                 <option value={10}>10</option>
                  <option value={25}>25</option>
                   <option value={50}>50</option>
              </select>
               
             
              <div className="text-sm text-gray-600">
                Showing {startItem} to {endItem} of {bookings.total} entries
              
             </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="table  border-3 border-info">
                        <thead className="bg-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold table-primary">ID</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold table-secondary">Employee Name</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold table-success">Room Name</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold table-danger">Start</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold table-info">End</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold table-light">Edit</th>
                             <th className="px-4 py-3 text-center text-sm font-semibold table-dark">Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            <tr>
                              <td colSpan="7" className="text-center py-8">Loading...</td>
                            </tr>
                          ) : bookings.data.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="text-center py-8">No bookings found</td>
                            </tr>
                          ) : (
                            bookings.data.map((booking) => (
                              <tr key={booking._id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2 text-sm table-primary">{booking._id.slice(-6)}</td>
                                <td className="px-4 py-2 font-medium table-secondary">{booking.employee_name}</td>
                                <td className="px-4 py-2 table-success">{booking.room_name}</td>
                                <td className="px-4 py-2 table-danger">{booking.start}</td>
                                <td className="px-4 py-2 table-info">{booking.end}</td>
                                <td className="px-4 py-2 text-center space-x-2 table-light">
                                  <button 
                            onClick={() => openEditModal(booking)}
                            type="button" className="btn btn-outline-primary"
                           
                          >
                            Edit
                          </button>
                                  </td>
                                  <td className="px-4 py-2 text-center table-dark">
                                  <button 
                                     className='btn btn-outline-danger'
                                    onClick={() => handleDelete(booking._id)}
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
        
      
                {bookings.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    <button onClick={() => changePage(bookings.page - 1)} disabled={bookings.page === 1}
                      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 btn btn-outline-dark">
                      Prev
                    </button>
                    <span className="px-3 py-1">Page {bookings.page} of {bookings.pages}</span>
                    <button onClick={() => changePage(bookings.page + 1)} disabled={bookings.page === bookings.pages}
                      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 btn btn-outline-dark">
                      Next
                    </button>
                  </div>
                )}
              
          
          </div>
        </div>
      </div>
      <br></br>
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
             
              <h3 className="text-xl font-bold">Edit Booking</h3>
             
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Employee Name *</label>
                  <select className="w-full p-2 border rounded" value={editForm.employee_id} 
               style={{marginRight: '20px'}}
                onChange={e => setEditForm({...editForm, employee_id: e.target.value})}>
                <option value="">Select Employee</option>
                {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name}</option>)}
              </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Room Name *</label>
                 <select className="w-full p-2 border rounded" value={editForm.room_id}
               style={{marginRight: '20px'}}
                onChange={e => setEditForm({...editForm, room_id: e.target.value})}>
                <option value="">Select Room</option>
                {rooms.map(room => <option key={room._id} value={room._id}>{room.room_name}</option>)}
              </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Start time *</label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.start}
                    onChange={e => setEditForm({...editForm, start: e.target.value})}
                    placeholder="Enter starting time"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">End time *</label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.end}
                    onChange={e => setEditForm({...editForm, end: e.target.value})}
                    placeholder="Enter ending time"
                  />
                </div>
                
              
                
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    
                    className="flex-1 bg-blue-600 btn btn-outline-primary text-white py-2 rounded hover:bg-blue-700 transition font-semibold disabled:opacity-50"
                    onClick={handleUpdate}
                    disabled={saving}
                  >
                    {saving ? 'Updating...' : 'Update Booking'}
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

export default Book;
