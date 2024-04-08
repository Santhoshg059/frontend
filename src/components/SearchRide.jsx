// SearchRide.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faCalendarAlt, faClock, faUser, faMobileAlt, faMoneyBillAlt, faCar, faChair, faEnvelope } from '@fortawesome/free-solid-svg-icons';


function SearchRide() {
    const location = useLocation();
    const rides = location.state ? location.state.rides : [];

    const [userId, setUserId] = useState(null);
    const [name, setName] = useState(null);
    const [personCounts, setPersonCounts] = useState({});
    const [userDetails, setUserDetails] = useState({});

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handlePersonCountChange = (rideId, value) => {
        setPersonCounts(prevState => ({
            ...prevState,
            [rideId]: value
        }));
    };

    const fetchUserDetails = async (userId) => {
        try {
            const response = await axios.get(`https://backend-1-1trx.onrender.com/user/${userId}`);
            setUserDetails(response.data);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const decodeJwtToken = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));

            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error decoding JWT token:', error);
            return null;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const { userId, name } = decodeJwtToken(token);
            setUserId(userId);
            setName(name);
            fetchUserDetails(userId);
        }
    }, []);

    const sendRequest = async (rideId, pickup, destination) => {
        try {
            await axios.post('https://backend-1-1trx.onrender.com/send-request', {
                rideId,
                pickup,
                destination,
                userId,
                name,
                personCounts: personCounts[rideId] || 1,
            });
            alert('Request sent successfully');
        } catch (error) {
            console.error('Error sending request:', error);
            alert('Failed to send request. Please try again.');
        }
    };

    return (
        <div id="root" style={{ backgroundColor: '#cbecf4', color: '#fff', minHeight: '100vh' }}>
        <div className="container" >
            <h2 className="text-center mb-4">Search Results</h2>
            <div className="row">
                {rides.map((ride, index) => (
                    <div key={index} className="col-md-6">
                        <div className="card mb-4">
                            <div className="card-body">
                                <div className="ride-details">
                                    <h5 className="card-title">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} /> Pickup: {ride.pickup}
                                    </h5>
                                    <h5 className="card-title">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} /> Destination: {ride.destination}
                                    </h5>
                                    <p className="card-text">
                                        <FontAwesomeIcon icon={faMoneyBillAlt} /> Price: ${ride.price}
                                    </p>
                                    <p className="card-text">
                                        <FontAwesomeIcon icon={faChair} /> Available Seats: {ride.availableSeats}
                                    </p>
                                    <p className="card-text">
                                        <FontAwesomeIcon icon={faCalendarAlt} /> Date: {formatDate(ride.date)}
                                    </p>
                                    <p className="card-text">
                                        <FontAwesomeIcon icon={faClock} /> Time: {ride.time}
                                    </p>
                                </div>
                                <hr />
                                <div className="user-details">
                                    <h5 className="card-title">
                                        <FontAwesomeIcon icon={faUser} /> Name: {userDetails.name}
                                    </h5>
                                    <p className="card-text">
                                        <FontAwesomeIcon icon={faMobileAlt} /> Mobile: {userDetails.mobileNumber}
                                    </p>
                                    <p className="card-text">
                                        <FontAwesomeIcon icon={faEnvelope} /> Email: {userDetails.email}
                                    </p>
                                    <p className="card-text">
                                        <FontAwesomeIcon icon={faCar} /> Vehicle Name: {userDetails.vehicleName}
                                    </p>
                                    <p className="card-text">
                                        <FontAwesomeIcon icon={faCar} /> Vehicle Number: {userDetails.vehicleNumber}
                                    </p>
                                </div>
                                <div className="input-group mt-3 searchinput">
                                    <input type="number" className="form-control requestseat" value={personCounts[ride._id] || 1}
                                        onChange={(e) => handlePersonCountChange(ride._id, e.target.value)}
                                        min="1" max={ride.availableSeats} />
                                    <button className="btn btn-primary ms-3 requestseatbtn" onClick={() => sendRequest(ride._id, ride.pickup, ride.destination)}>Send Request</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
}

export default SearchRide;
