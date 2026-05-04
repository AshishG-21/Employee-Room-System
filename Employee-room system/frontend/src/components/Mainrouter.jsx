import React, { useState } from 'react'
import Home from './pages/Home'
import Employees from './pages/Employees'
import EmployeesDetails from './pages/EmployeesDetails'
import Employeesedit from './pages/Employeesedit'
import Delete from './pages/Delete'
import Delete2 from './pages/Delete2'
import Delete3 from './pages/Delete3'
import Rooms from './pages/Rooms'
import RoomsDetails from './pages/RoomsDetails'
import Roomsedit from './pages/Roomsedit'
import Book from './pages/Book'
import BookingDetails from './pages/BookingDetails'
import Bookingedit from './pages/Bookingedit'
import { Routes, Route, NavLink } from 'react-router-dom'
import './App.css'
const MainRouter = () => {

  return (
    <div>
      
      <nav className="bg-blue-600 text-white fixed top-0 w-full z-50 shadow-lg" style={{backgroundColor: "#1e3a8a",  position: 'sticky', top: 0, zIndex: 1000}}>
        <div className="container mx-auto px-4">
         
          
          <div className="flex justify-between items-center py-4">
            
            <div className="flex gap-6">
             <h1 className="room" style={{ textAlign: 'left' }}><b>RoomBooker</b></h1>
              <NavLink to="/" className="my-link " ><b>Home</b></NavLink>
                <span className="text-gray-400">{" | "}</span>
             <NavLink to="/employees" className="my-link"><b>Employees</b></NavLink>
             <span className="text-gray-400">{" | "}</span>
             <NavLink to="/rooms" className="my-link"><b>Rooms</b> </NavLink>
             <span className="text-gray-400">{" | "}</span>
            <NavLink to="/book" className="my-link"><b>Booking</b> </NavLink>
              
               
             
            </div>
          </div>
        </div>
      </nav>

     
      <div className="pt-20 min-h-screen bg-gray-100">
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
          <Route path="/employeesedit/:id" element={<Employeesedit />} />
          <Route path="/roomsedit/:id" element={<Roomsedit />} />
          <Route path="/bookingedit/:id" element={<Bookingedit />} />
        </Routes>
      </div>
    </div>
  )
}

export default MainRouter
