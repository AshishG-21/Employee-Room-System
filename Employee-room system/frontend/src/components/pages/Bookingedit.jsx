import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Bookingedit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    employee_id: '',
    room_id: '',
    start: '',
    end: ''
  
  });
  
  const API = "http://127.0.0.1:8000";

  useEffect(() => {
    fetchAssignment();
  }, [id]);

  const fetchAssignment = async () => {
    try {
      const res = await fetch(`${API}/assignments/all`);
      const bookings = await res.json();
      const assignment = bookings.find(b => b._id === id);
      
      if (assignment) {
        setForm({
          employee_id: assignment.employee_id || '',
          room_id: assignment.room_id || '',
          start: assignment.start || '',
          end: assignment.end || ''
          
        });
      } else {
        alert("Assignment not found");
        navigate('/assignments');
      }
    } catch (error) {
      console.error("Error fetching assignment:", error);
      alert("Failed to load assignment data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    const { employee_id, room_id, start, end} = form;
    
    if (!employee_id || !room_id || !start || !end) {
      alert("Please fill all fields");
      return;
    }
    
    setSaving(true);
    
    try {
      
      const response = await fetch(`${API}/assignments/${id}`, {
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
        alert(data.message || 'Assignment updated successfully!');
        navigate('/assignments');
      } else {
        alert(data.detail || 'Failed to update assignment');
      }
    } catch (error) {
      console.error("Error updating assignment:", error);
      alert('Failed to update assignment. Please try again.');
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
            <h3 className="text-xl font-bold">Edit Assignment</h3>
            <p className="text-sm text-gray-300">Update booking information</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Employee ID *</label>
                <input 
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.employee_id} 
                  onChange={e => setForm({...form, employee_id: e.target.value})} 
                  placeholder="Enter employee ID"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Room ID *</label>
                <input 
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.room_id}
                  onChange={e => setForm({...form, room_id: e.target.value})}
                  placeholder="Enter room ID"
                />
              </div>
              
               <input type="datetime-local" className="w-full p-2 border rounded"
                value={form.start} onChange={e => setForm({...form, start: e.target.value})} />
              <input type="datetime-local" className="w-full p-2 border rounded"
                value={form.end} onChange={e => setForm({...form, end: e.target.value})} />
              
              
              
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  className="flex-1 bg-blue-600 text-black py-2 rounded hover:bg-blue-700 transition font-semibold disabled:opacity-50"
                  onClick={handleUpdate}
                  disabled={saving}
                >
                  {saving ? 'Updating...' : 'Update Assignment'}
                </button>
                <button 
                  type="button" 
                  className="flex-1 bg-gray-500 text-black py-2 rounded hover:bg-gray-600 transition font-semibold"
                  onClick={() => navigate('/assignments')}
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

export default Bookingedit;