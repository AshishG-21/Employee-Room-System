import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
  const API = "http://127.0.0.1:8000";

  useEffect(() => {
    fetchEmployees();
  }, [employees.page]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/employees?page=${employees.page}&limit=5`);
      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async () => {
    const { name, gender, address, email, contact } = form;
    if (!name || !gender || !address || !email || !contact) {
      alert("Please fill all fields");
      return;
    }
    
    const res = await fetch(`${API}/employees?name=${name}&gender=${gender}&address=${address}&email=${email}&contact=${contact}`, 
      { method: "POST" }
    );
    
    if (res.ok) {
      setForm({ name: '', gender: '', address: '', email: '', contact: '' });
      
      const newTotalPages = Math.ceil((employees.total + 1) / 5);
      setEmployees({ ...employees, page: newTotalPages });
      fetchEmployees();
      alert("Employee added successfully");
    } else {
      const error = await res.json();
      alert(error.detail);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this employee?")) {
      const res = await fetch(`${API}/employees/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchEmployees();
        alert("Deleted successfully");
      }
    }
  };

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= employees.pages) {
      setEmployees({ ...employees, page: newPage });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap -mx-4">
        
        <div className="w-full lg:w-1/3 px-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">Add New Employee</h3>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Full Name" 
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
              />
              <select 
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.gender} 
                onChange={e => setForm({...form, gender: e.target.value})}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input 
                type="text" 
                placeholder="Address" 
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.address} 
                onChange={e => setForm({...form, address: e.target.value})} 
              />
              <input 
                type="email" 
                placeholder="Email Address" 
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
              <button 
                onClick={addEmployee} 
                className="w-full bg-blue-600 text-black py-2 rounded hover:bg-blue-700 transition font-semibold"
              >
                Add Employee
              </button>
            </div>
          </div>
        </div>
        <br></br>
      
        <div className="w-full lg:w-2/3 px-4 mb-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden" >
            <div className="details-header2 bg-gray-800 text-white p-3">
              <h3 className="text-xl font-bol" >Employee List</h3>
              <p className="text-sm text-gray-300">Total: {employees.total} employees</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="table border border-3 border-info">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Gender</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Address</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Contact</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Edit</th>
                     <th className="px-4 py-3 text-center text-sm font-semibold">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-8">Loading...</td>
                    </tr>
                  ) : employees.data.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-8">No employees found</td>
                    </tr>
                  ) : (
                    employees.data.map((emp) => (
                      <tr key={emp._id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm">{emp._id.slice(-6)}</td>
                        <td className="px-4 py-2 font-medium">{emp.name}</td>
                        <td className="px-4 py-2">{emp.gender}</td>
                        <td className="px-4 py-2">{emp.address}</td>
                        <td className="px-4 py-2">{emp.email}</td>
                        <td className="px-4 py-2">{emp.contact}</td>
                        <td className="px-4 py-2 text-center space-x-2">
                          <Link 
                            to={`/employeesedit/${emp._id}`} 
                            className="btn btn-warning"
                          >
                            Edit
                          </Link>
                          </td>
                          <td className="px-4 py-2 text-center">
                          <button 
                             className='btn btn-danger'
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
                  className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {employees.page} of {employees.pages}
                </span>
                <button 
                  onClick={() => changePage(employees.page + 1)} 
                  disabled={employees.page === employees.pages}
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

export default Employees;
