import React, { useState, useEffect } from 'react';
import coins from "../images/coins2.png"
import homecontactimg from "../images/homecontactimg.png"
import handimg from "../images/handimage.png"
import axios from 'axios';
// import jwt_decode from 'jwt-decode';
import {
    MDBFooter,
    MDBContainer,
    MDBCol,
    MDBRow,
    MDBIcon,
    MDBBtn
} from 'mdb-react-ui-kit';

function Publishride() {
    const [pickup, setPickup] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [personCount, setPersonCount] = useState('');
    const [price, setPrice] = useState('');
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [userMobileNumber, setUserMobileNumber] = useState('');


    function decodeJwtToken(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error decoding JWT token:', error);
            return null;
        }
    }
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const { userId, name } = decodeJwtToken(token); // Assuming you have a function to decode the JWT token
            setUserId(userId);
            setUserName(name);
            fetchUserDetails(userId);
        }
    }, []);

    const fetchUserDetails = async (userId) => {
        try {
            const response = await axios.get(`https://backend-1-1trx.onrender.com/user/${userId}`); // Assuming you have an endpoint to fetch user details by ID
            const { name, mobileNumber } = response.data;
            setUserName(name);
            setUserMobileNumber(mobileNumber);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const pbnext = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('https://backend-1-1trx.onrender.com/rides', {
                pickup,
                destination,
                date,
                time,
                personCount,
                price,
                userId,
                userName,
                userMobileNumber
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Ride published successfully:', response.data);
            setPickup('');
        setDestination('');
        setDate('');
        setTime('');
        setPersonCount('');
        setPrice('');
            // Add logic to navigate to the next page or show success message
        } catch (error) {
            console.error('Error publishing ride:', error);
            // Handle error, show error message, etc.
        }
    };



    return (
        <>
         
            <div className="mdiv">
                <div className="picturediv">
                    <div className="input-group">
                        <input type="text" className="form-control" placeholder="Pickup" value={pickup} onChange={(e) => setPickup(e.target.value)} required />
                        <input type="text" className="form-control" placeholder="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} required />
                        <input type="date" className="form-control" placeholder="Date" value={date} onChange={(e) => setDate(e.target.value)} required />
                        <input type="time" className="form-control" placeholder="Time" value={time} onChange={(e) => setTime(e.target.value)} required />
                        <input type="number" className="form-control" min="1" placeholder="Enter count" value={personCount} onChange={(e) => setPersonCount(e.target.value)} required />
                        <input type="number" className="form-control" min="0" step="1" placeholder="Price per person" value={price} onChange={(e) => setPrice(e.target.value)} required />
                        <button type="submit" className="btn btn-primary" onClick={pbnext}><b>Next</b></button>
                    </div>
                </div>
                <div className="card-group">
                    <div className="card" >
                        <img src={coins} className="homeimg card-img-top" alt="coins" />
                        <div className="card-body">
                            <h5 className="card-title"><b>Money-Saving Strategies for Transportation</b></h5>
                            <p className="card-text">Booking transportation in advance often leads to better deals. This applies to flights, trains, and sometimes even ride-hailing services.</p>
                        </div>
                    </div>
                    <div id="card1" className="card">
                        <img src={homecontactimg} className="homeimg card-img-top" alt="..." />
                        <div className="card-body">
                            <h5 className="card-title"><b>Secure, Seamless Booking</b></h5>
                            <p className="card-text">We've designed a user-friendly platform that prioritizes your safety. From profile verifications to secure transactions, every step of your journey with us is carefully crafted to provide a seamless and secure booking experience.</p>
                        </div>
                    </div>
                    <div className="card">
                        <img src={handimg} className="homeimg card-img-top" alt="..." />
                        <div className="card-body">
                            <h5 className="card-title"><b>Effortless Navigation</b></h5>
                            <p className="card-text">Navigate through our intuitive interface effortlessly. Scroll through options, click to explore destinations, and tap to select your preferred travel arrangements. It's that easy to embark on your next adventure!</p>
                        </div>
                    </div>
                </div>
            </div>

            <MDBFooter className='bg-light text-center text-white'>
                <MDBContainer className='p-4 pb-0'>
                    <section className='mb-4'>
                        {/* Social media icons */}
                    </section>
                </MDBContainer>

                <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                    © 2023 Copyright:
                    <a className='text-white' href='https://frontend-sage-one-40.vercel.app/'>
                        Comrade.com
                    </a>
                </div>
            </MDBFooter>
        </>
    );
}

export default Publishride;
