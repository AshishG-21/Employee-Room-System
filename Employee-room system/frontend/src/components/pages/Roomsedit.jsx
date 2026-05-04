import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Roomsedit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    room_name: '',
    floor_no: '',
    size: ''
  });
  
  const API = "http://127.0.0.1:8000";

  useEffect(() => {
    fetchRoom();
  }, [id]);

  const fetchRoom = async () => {
    try {
      const res = await fetch(`${API}/rooms/all`);
      const rooms = await res.json();
      const room = rooms.find(r => r._id === id);
      
      if (room) {
        setForm({
          room_name: room.room_name || '',
          floor_no: room.floor_no || '',
          size: room.size || ''
        });
      } else {
        alert("Room not found");
        navigate('/rooms');
      }
    } catch (error) {
      console.error("Error fetching room:", error);
      alert("Failed to load room data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    const { room_name, floor_no, size } = form;
    
    if (!room_name || !floor_no || !size) {
      alert("Please fill all fields");
      return;
    }
    
    setSaving(true);
    
    try {
      
      const response = await fetch(`${API}/rooms/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: room_name,
          floor_no: floor_no,
          size: size
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || 'Room updated successfully!');
        navigate('/rooms');
      } else {
        alert(data.detail || 'Failed to update room');
      }
    } catch (error) {
      console.error("Error updating room:", error);
      alert('Failed to update room. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-800 text-white p-4">
            <h3 className="text-xl font-bold">Edit Room</h3>
            <p className="text-sm text-gray-300">Update room information</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Room Name *</label>
                <input 
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.room_name} 
                  onChange={e => setForm({...form, room_name: e.target.value})} 
                  placeholder="Enter room name"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Floor Number *</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.floor_no}
                  onChange={e => setForm({...form, floor_no: e.target.value})}
                >
                  <option value="">Select Floor Number</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Size *</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.size}
                  onChange={e => setForm({...form, size: e.target.value})}
                  placeholder="Enter room size"
                />
                
              </div>
              
            
              
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  className="flex-1 bg-blue-600 text-black py-2 rounded hover:bg-blue-700 transition font-semibold disabled:opacity-50"
                  onClick={handleUpdate}
                  disabled={saving}
                >
                  {saving ? 'Updating...' : 'Update Room'}
                </button>
                <button 
                  type="button" 
                  className="flex-1 bg-gray-500 text-black py-2 rounded hover:bg-gray-600 transition font-semibold"
                  onClick={() => navigate('/rooms')}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roomsedit;