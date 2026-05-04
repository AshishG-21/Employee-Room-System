import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Employeesedit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    gender: '',
    address: '',
    email: '',
    contact: ''
  });
  
  const API = "http://127.0.0.1:8000";

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const res = await fetch(`${API}/employees/all`);
      const employees = await res.json();
      const employee = employees.find(emp => emp._id === id);
      
      if (employee) {
        setForm({
          name: employee.name || '',
          gender: employee.gender || '',
          address: employee.address || '',
          email: employee.email || '',
          contact: employee.contact || ''
        });
      } else {
        alert("Employee not found");
        navigate('/employees');
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
      alert("Failed to load employee data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    const { name, gender, address, email, contact } = form;
    
    if (!name || !gender || !address || !email || !contact) {
      alert("Please fill all fields");
      return;
    }
    
    setSaving(true);
    
    try {
      
      const response = await fetch(`${API}/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          gender: gender,
          address: address,
          email: email,
          contact: contact
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || 'Employee updated successfully!');
        navigate('/employees');
      } else {
        alert(data.detail || 'Failed to update employee');
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      alert('Failed to update employee. Please try again.');
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
            <h3 className="text-xl font-bold">Edit Employee</h3>
            <p className="text-sm text-gray-300">Update employee information</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Full Name *</label>
                <input 
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Gender *</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.gender}
                  onChange={e => setForm({...form, gender: e.target.value})}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Address *</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.address}
                  onChange={e => setForm({...form, address: e.target.value})}
                  placeholder="Enter address"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Phone Number *</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="tel" 
                  value={form.contact}
                  onChange={e => setForm({...form, contact: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Email Address *</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="email" 
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  className="flex-1 bg-blue-600 text-black py-2 rounded hover:bg-blue-700 transition font-semibold disabled:opacity-50"
                  onClick={handleUpdate}
                  disabled={saving}
                >
                  {saving ? 'Updating...' : 'Update Employee'}
                </button>
                <button 
                  type="button" 
                  className="flex-1 bg-gray-500 text-black py-2 rounded hover:bg-gray-600 transition font-semibold"
                  onClick={() => navigate('/employees')}
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

export default Employeesedit;