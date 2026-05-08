import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const Employees = () => {
  const [form, setForm] = useState({ 
    name: '', 
    gender: '', 
    address: '', 
    email: '', 
    contact: '' 
  });
  const [employees, setEmployees] = useState({ data: [], total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(false);
  const [entriesPerPage,setEntriesPerPage]=useState(5);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    gender: '',
    address: '',
    email: '',
    contact: ''
  });
  const [saving, setSaving] = useState(false);
  
  const API = "http://127.0.0.1:8000";

  useEffect(() => {
    fetchEmployees();
  }, [employees.page,entriesPerPage]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/employees?page=${employees.page}&limit=${entriesPerPage}`);
      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async () => {
    const { name, gender, address, email, contact } = form;
    if (!name || !gender || !address || !email || !contact) {
      toast.error("Please fill all fields");
      return;
    }
    
    const res = await fetch(`${API}/employees?name=${name}&gender=${gender}&address=${address}&email=${email}&contact=${contact}`, 
      { method: "POST" }
    );
    
    if (res.ok) {
      setForm({ name: '', gender: '', address: '', email: '', contact: '' });
      setEmployees({...employees,page:1});
      toast.success("Employee added successfully");
    } else {
      const error = await res.json();
      toast.error(error.detail);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this employee?")) {
      const res = await fetch(`${API}/employees/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchEmployees();
        toast.success("Deleted successfully");
      } else {
        toast.error("Failed to delete");
      }
    }
  };

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= employees.pages) {
      setEmployees({ ...employees, page: newPage });
    }
  };

  const handleEntriesChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setEntriesPerPage(newLimit);
    setEmployees({...employees,page:1});
};

  const openEditModal = (employee) => {
    setSelectedEmployee(employee);
    setEditForm({
      name: employee.name || '',
      gender: employee.gender || '',
      address: employee.address || '',
      email: employee.email || '',
      contact: employee.contact || ''
    });
    setShowModal(true);
  };


  const closeModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
    setEditForm({
      name: '',
      gender: '',
      address: '',
      email: '',
      contact: ''
    });
  };


  const handleUpdate = async () => {
    const { name, gender, address, email, contact } = editForm;
    
    if (!name || !gender || !address || !email || !contact) {
      toast.error("Please fill all fields");
      return;
    }
    
    setSaving(true);
    
    try {
      const response = await fetch(`${API}/employees/${selectedEmployee._id}`, {
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
        toast.success(data.message || 'Employee updated successfully!');
        closeModal();
        fetchEmployees(); 
      } else {
        toast.error(data.detail || 'Failed to update employee');
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error('Failed to update employee. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const startItem=(employees.page-1) * entriesPerPage +1;
  const endItem= Math.min(employees.page * entriesPerPage, employees.total);

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      
      <div className="flex flex-wrap -mx-4">
      
        <div className="w-full lg:w-1/3 px-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">Add New Employee</h3>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Full Name" 
                 style={{marginRight: '20px'}}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
              />
            
              <select 
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.gender}  style={{marginRight: '20px'}}
                onChange={e => setForm({...form, gender: e.target.value})}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input 
                type="text" 
                placeholder="Address"  style={{marginRight: '20px'}}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.address} 
                onChange={e => setForm({...form, address: e.target.value})} 
              />
              <input 
                type="email" 
                placeholder="Email Address"  style={{marginRight: '20px'}}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.email} 
                onChange={e => setForm({...form, email: e.target.value})} 
              />
              <input 
                type="tel" 
                placeholder="Phone Number" 
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.contact} 
                onChange={e => setForm({...form, contact: e.target.value})} 
              />
              <br></br>
               <br></br>
              
              <button 
                onClick={addEmployee}  className="btn btn-outline-dark"
              >
                Add Employee
              </button>
              
            </div>
          </div>
        </div>
       <br></br>
       
  
        <div className="w-full lg:w-2/3 px-4 mb-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="details-header2 bg-gray-800 text-white p-4">
              <h3 className="text-xl font-bold">Employee List</h3>
             
              <label  className="text-sm font-semibold text-gray-700" style={{marginRight: '10px'}} > Show entries:</label>
              <select value={entriesPerPage}  onChange={handleEntriesChange}   className="px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value={5}>5</option>
                 <option value={10}>10</option>
                  <option value={25}>25</option>
                   <option value={50}>50</option>
              </select>
               
             
              <div className="text-sm text-gray-600">
                Showing {startItem} to {endItem} of {employees.total} entries
              </div>
             </div>
            <div className="overflow-x-auto h-96 w-96">
              <table className="table table-xs table-pin-rows table-pin-cols">
                <thead className="bg-gray-200">
                  <tr style={{color:'blue'}}>
                    <th className="px-4 py-3 text-left text-sm font-semibold table-primary" >ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold table-secondary">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold table-success">Gender</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold table-danger">Address</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold table-info">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold table-warning">Contact</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold table-light">Edit</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold table-dark">Delete</th>
                  </tr>
                </thead>
                <tbody >
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-8">Loading...</td>
                    </tr>
                  ) : employees.data.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-8">No employees found</td>
                    </tr>
                  ) : (
                    employees.data.map((emp) => (
                      <tr key={emp._id} className="border-b hover:bg-gray-50" >
                        <td className="px-4 py-2 text-sm table-primary">{emp._id.slice(-6)}</td>
                        <td className="px-4 py-2 font-medium table-secondary">{emp.name}</td>
                        <td className="px-4 py-2 table-success">{emp.gender}</td>
                        <td className="px-4 py-2 table-danger">{emp.address}</td>
                        <td className="px-4 py-2 table-info">{emp.email}</td>
                        <td className="px-4 py-2 table-warning">{emp.contact}</td>
                        <td className="px-4 py-2 text-center table-light">
                          <button 
                            onClick={() => openEditModal(emp)}
                            type="button" className="btn btn-outline-primary"
                           
                          >
                            Edit
                          </button>
                        </td>
                        <td className="px-4 py-2 text-center table-dark">
                          <button 
                           type="button" className="btn btn-outline-danger"
                            
                            onClick={() => handleDelete(emp._id)}
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

          
            {employees.pages > 1 && (
              <div className="flex justify-center items-center gap-2 py-4 bg-gray-50">
                <button 
                  onClick={() => changePage(employees.page - 1)} 
                  disabled={employees.page === 1}
                  
                  className="px-4 py-2 bg-gray-300 btn btn-outline-dark rounded disabled:opacity-50 hover:bg-gray-400 transition"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {employees.page} of {employees.pages}
                </span>
                <button 
                  onClick={() => changePage(employees.page + 1)} 
                  disabled={employees.page === employees.pages}
                  className="px-4 py-2 bg-gray-300 btn btn-outline-dark rounded disabled:opacity-50 hover:bg-gray-400 transition"
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
              <h3 className="text-xl font-bold">Edit Employee</h3>
              
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Full Name *</label>
                  <input 
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.name} 
                    onChange={e => setEditForm({...editForm, name: e.target.value})} 
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Gender *</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.gender}
                    onChange={e => setEditForm({...editForm, gender: e.target.value})}
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
                    value={editForm.address}
                    onChange={e => setEditForm({...editForm, address: e.target.value})}
                    placeholder="Enter address"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Phone Number *</label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="tel" 
                    value={editForm.contact}
                    onChange={e => setEditForm({...editForm, contact: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Email Address *</label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="email" 
                    value={editForm.email}
                    onChange={e => setEditForm({...editForm, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    className="flex-1 bg-blue-600 text-white btn btn-outline-primary py-2 rounded hover:bg-blue-700 transition font-semibold disabled:opacity-50"
                    onClick={handleUpdate}
                    disabled={saving}
                  >
                    {saving ? 'Updating...' : 'Update Employee'}
                  </button>
                  <p></p>
                  <button 
                    type="button" 
                    className="flex-1 bg-gray-500 text-white btn btn-outline-danger py-2 rounded hover:bg-gray-600 transition font-semibold"
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

export default Employees;
