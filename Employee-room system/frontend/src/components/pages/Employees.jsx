import React, { useState, useEffect } from 'react';

const Employees = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [employees, setEmployees] = useState([]);
  
  const API = "http://127.0.0.1:8000";

  useEffect(() => {
    fetch(API + "/employees")
      .then(res => res.json())
      .then(data => setEmployees(data));
  }, []);

  const addEmployee = async () => {
    if (!name.trim()) {
      alert("Enter employee name");
      return;
    }
    if (!address.trim()) {
      alert("Enter employee address");
      return;
    }
    if (!gender.trim()) {
      alert("Select employee gender");
      return;
    }
    if (!email.trim()) {
      alert("Enter employee email");
      return;
    }
    if (!contact.trim()) {
      alert("Enter employee contact number");
      return;
    }
    const res = await fetch(API + "/employees?name=" + name + "&address=" + address + "&gender=" + gender + "&email=" + email + "&contact=" + contact, { method: "POST" });
    const data = await res.json();

    if (!res.ok) {
      alert(data.detail);
      return;
    }

    setEmployees([...employees, data]);
    setName("");
    setAddress("");
    setGender("");
    setEmail("");
    setContact("");
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <div className="card p-3 mb-3">
            <div className="card-body" >
              <h3 className="card-header" style={{ width: "11.8223rem" }} ><b>Add Employees:</b></h3>
              <p>
                <img 
                  src="https://www.commbox.io/wp-content/uploads/2023/12/6-Best-Ways-to-Keep-Your-Employees-Happy.jpg" 
                      className="card-img-top" 
                      alt="Employees"
                      style={{ width: "100%", height: "auto" }}
                />
              </p>
              Employee name:
              <input 
                className="form-control mt-2 mb-2" 
                value={name} 
                onChange={e => setName(e.target.value)} 
              />
              Gender:
              <select 
                className="form-select mt-2 mb-2"
                value={gender}
                onChange={e => setGender(e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              Address:
                <input
                  className="form-control mt-2 mb-2"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
                Phone no:
                <input
                  className="form-control mt-2 mb-2"
                  type="tel" onChange={e => setContact(e.target.value)}
                />
                Email ID:
                <input
                  className="form-control mt-2 mb-2"
                  type="email" onChange={e=>setEmail(e.target.value)}
                />
                <br></br>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={addEmployee}
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="accordion">
            <div className="accordion-item">
              <h3 className="accordion-header">
                <button 
                  className="accordion-button" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target="#collapseEmployees"
                >
                  <b><u>Employees List</u></b>
                </button>
              </h3>
              <div id="collapseEmployees" className="accordion-collapse collapse show">
                <div className="accordion-body">
                  <ol className="list-group">
                    {employees.map((e) => (
                      <li className="list-group-item" key={e._id}>{e.name}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employees;