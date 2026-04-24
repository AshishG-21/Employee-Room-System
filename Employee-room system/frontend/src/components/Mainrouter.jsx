import React from 'react'
import Home from './pages/Home'
import Employees from './pages/Employees'
import EmployeesDetails from './pages/EmployeesDetails'
import Delete from './pages/Delete'
import Delete2 from './pages/Delete2'
import Delete3 from './pages/Delete3'
import Rooms from './pages/Rooms'
import RoomsDetails from './pages/RoomsDetails'
import Book from './pages/Book'
import BookingDetails from './pages/BookingDetails'

import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
const MainRouter = () => {
  return (
    
    <div>
      
      <Navbar bg="primary" data-bs-theme="dark" fixed="top">
        <Container>
          <Navbar.Brand className='text-warning fs-1'>RoomBooker</Navbar.Brand>
          
          <Nav className="me-auto">
            
            <Nav.Link className="my-link" as={Link} to="/"><b>Home</b></Nav.Link>
            <div class="dropdown">
  <Nav.Link class="btn btn-secondary dropdown-toggle" className="my-link" role="button" data-bs-toggle="dropdown" aria-expanded="false">
   <b> Employees</b>
  </Nav.Link>
   <ul class="dropdown-menu">
            <Nav.Link className="my-link" as={Link} to="/employees"><b>Add Employees</b></Nav.Link>
             <Nav.Link className="my-link" as={Link} to="/employeesdetails"><b>View Details</b></Nav.Link>
            <Nav.Link className="my-link" as={Link} to="/delete"><b>Delete Employees</b></Nav.Link>
            </ul>
            </div>
            <div class="dropdown">
            <Nav.Link class="btn btn-secondary dropdown-toggle" className="my-link" role="button" data-bs-toggle="dropdown" aria-expanded="false">
   <b> Rooms</b>
  </Nav.Link>
   <ul class="dropdown-menu">
            <Nav.Link className="my-link" as={Link} to="/rooms"><b>Add Rooms</b></Nav.Link>
                <Nav.Link className="my-link" as={Link} to="/roomsdetails"><b>View Details</b></Nav.Link>
            <Nav.Link className="my-link" as={Link} to="/delete2"><b>Delete Rooms</b></Nav.Link>
            </ul></div>
             <div class="dropdown">
            <Nav.Link class="btn btn-secondary dropdown-toggle" className="my-link" role="button" data-bs-toggle="dropdown" aria-expanded="false">
   <b> Booking</b>
  </Nav.Link>
   <ul class="dropdown-menu">
            <Nav.Link className="my-link" as={Link} to="/book"><b>Book Room</b></Nav.Link>
            <Nav.Link className="my-link" as={Link} to="/bookingdetails"><b>View Booking Details</b></Nav.Link>
            <Nav.Link className="my-link" as={Link} to="/delete3"><b>Delete Booking</b></Nav.Link>
            </ul></div>
          </Nav>
        </Container>
      </Navbar>

      
      <div style={{ paddingTop: "80px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/employeesdetails" element={<EmployeesDetails />} />
            <Route path="/delete" element={<Delete />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/roomsdetails" element={<RoomsDetails />} />
          <Route path="/delete2" element={<Delete2 />} />
          <Route path="/book" element={<Book />} />
          <Route path="/bookingdetails" element={<BookingDetails />} />
          <Route path="/delete3" element={<Delete3 />} />
        </Routes>
      </div>
    </div>
  )
}

export default MainRouter