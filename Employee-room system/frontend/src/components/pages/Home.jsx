import React from 'react';




const Home = () => {
  return (
    <div className="homepage" style={{paddingTop:"80px", padding: "5px", fontFamily: "Arial"}}>
      <h2 style={{color:"black",padding:"100px"}}><center><b><u>Employee-Room Booking System</u></b></center></h2>
      <p style={{fontFamily: "Roboto Condensed",color:"black"}}><center><b>Description:</b> Full-Stack Employee–Room Booking System using React, FastAPI, and MongoDB</center></p>
      <img src="https://www.swipedon.com/hs-fs/hubfs/desks/desks-illustration.jpg?width=629&name=desks-illustration.jpg" alt="Booking Illustration" style={{width: "100%", maxWidth: "600px", display: "block", margin: "20px auto"}} />
      <p style={{fontFamily: "Roboto Condensed",color:"black"}}><center><b>Features:</b></center></p>
      <ul style={{fontFamily: "Roboto Condensed",color:"black", maxWidth: "600px", margin: "0 auto"}}>
        <li>Employee management</li>
        <li>Room availability checking</li>
        <li>Booking creation and modification</li>
        <li>Booking deletion</li>
      </ul>
    </div>
  );
};

export default Home;