import React, { useState, useEffect } from 'react';

const Delete = () => {
    const [employee, setEmployee] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [message, setMessage] = useState("");
    const API = "http://127.0.0.1:8000";

useEffect(() => {
    fetchEmployees();
}, []);

const fetchEmployees = async () => {
    try {
        const res = await fetch(API + "/employees");
        const data = await res.json();
        setEmployee(data);
    } catch (error) {
        console.error("Error fetching employees:", error);
    }
};

const deleteEmployee = async (employee_id) => {
    try {
        const res = await fetch(API + "/employees/" + employee_id, { method: "DELETE" });
        if (!res.ok) {
            const data = await res.json();
            alert(data.detail);
            return;
        }
        setEmployee([]);
    } catch (error) {
        console.error("Error deleting employee:", error);
    }
};

return (
    <div className="container mt-4">
        <div className="row">
            <div className="col-md-6">
                <div className="card p-4 mb-4">
                    <div className="card-body">
                        <h3 className="card-header" style={{ width: "11.8223rem" }}><b>Delete Employees:</b></h3>
                        <p>
                        
                            <select
                                className="form-select mt-2 mb-2"
                                value={selectedEmployee}
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                            >
                                <option value="">Select Employee</option>
                                {employee.map((emp) => (
                                    <option key={emp._id} value={emp._id}>
                                        {emp.name}
                                    </option>
                                ))}
                            </select>
                        </p>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => deleteEmployee(selectedEmployee)}
                        >
                            Delete Employee
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
};

export default Delete;