import React, { useState } from 'react'
import Home from './pages/Home'
import Employees from './pages/Employees'
import Rooms from './pages/Rooms'
import Book from './pages/Book'
import { Routes, Route, NavLink } from 'react-router-dom'
import './App.css'
const MainRouter = () => {

  return (
    <div>
      
      <nav className="bg-blue-600 text-white fixed top-0 w-full z-50 shadow-lg" style={{backgroundColor: "#1e3a8a",  position: 'sticky', top: 0, zIndex: 1000}}>
        <div className="container mx-auto px-4">
         
          
          <div className="flex justify-between items-center py-4">
            
            <div className="flex gap-6">
             <h1 className="room" style={{ textAlign: 'left' , color: '#ffc107'}}><b>RoomBooker</b></h1>
              <NavLink to="/" className="my-link " style={{marginRight: '30px'}}><b>Home</b></NavLink>
                
             <NavLink to="/employees" className="my-link" style={{marginRight: '30px'}}><b>Employees</b></NavLink>
             
             <NavLink to="/rooms" className="my-link" style={{marginRight: '30px'}}><b>Rooms</b> </NavLink>
            
            <NavLink to="/book" className="my-link" style={{marginRight: '30px'}}><b>Booking</b> </NavLink>
              
               
             
            </div>
          </div>
        </div>
      </nav>

     
      <div className="pt-20 min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/book" element={<Book />} />
        </Routes>
      </div>
    </div>
  )
}

export default MainRouter
