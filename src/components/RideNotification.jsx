import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

function RideNotification() {
    const [userId, setUserId] = useState('');
    const [rideNotifications, setRideNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            const { userId } = decodeJwtToken(token);
            setUserId(userId);
            fetchRideNotifications(userId);
        }
    }, []); 

    const fetchRideNotifications = async (userId) => {
        try {
            const response = await axios.get(`https://backend-1-1trx.onrender.com/user-notifications/${userId}`);
            const fetchedNotifications = response.data;

            // Filter out notifications with return notification status 'none'
            const filteredNotifications = fetchedNotifications.filter(notification => notification.returnNotification !== 'none');

            // Fetch ride details and user details for each notification
            const rideDetails = await Promise.all(filteredNotifications.map(async notification => {
                const rideResponse = await axios.get(`https://backend-1-1trx.onrender.com/rides/${notification.rideId}`);
                const userResponse = await axios.get(`https://backend-1-1trx.onrender.com/user/${rideResponse.data.userId}`);
                return { ...notification, rideDetails: rideResponse.data, userMobileNumber: userResponse.data.mobileNumber, vehicleName: userResponse.data.vehicleName, vehicleNumber: userResponse.data.vehicleNumber };
            }));

            setRideNotifications(rideDetails);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching ride notifications:', error);
            setError(error);
            setLoading(false);
        }
    };

    // Display ride notifications associated with the frontend user
    return (
        <div className='yourride'>
            <h2>Ride Notifications</h2>
            {loading ? <div>Loading...</div> : 
            error ? <div>Error: {error.message}</div> :
            (
                <div>
                    {rideNotifications.map(notification => (
                        <div key={notification._id} className="ride-notification">
                            
                            {(notification.returnNotification === 'accepted' || notification.returnNotification === 'declined') &&
                            <div className="card ridecard">
                                <p>Pickup: {notification.rideDetails.pickup}</p>
                                <p>Destination: {notification.rideDetails.destination}</p>
                                <p>Date: {new Date(notification.rideDetails.date).toLocaleDateString('en-GB')}</p>
                                <p>Time: {notification.rideDetails.time}</p>
                                <p>Vehicle Name: {notification.vehicleName}</p>
                                <p>Vehicle Number: {notification.vehicleNumber}</p>
                                {notification.returnNotification === 'accepted' && 
                                    <p><FontAwesomeIcon icon={faCheckCircle} className="accepted-icon" /> User Mobile Number: {notification.userMobileNumber}</p>}
                                {notification.returnNotification === 'declined' && 
                                    <p><FontAwesomeIcon icon={faTimesCircle} className="declined-icon" /> Status: {notification.returnNotification}</p>}
                            </div>
                            }
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default RideNotification;
