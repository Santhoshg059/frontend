import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotificationComponent = () => {
    const [userId, setUserId] = useState('');
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const { userId } = decodeJwtToken(token);
            setUserId(userId);
            fetchNotifications(userId);
        }
    }, [userId]); 

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

    const fetchNotifications = async (userId) => {
        try {
            const response = await axios.get(`https://backend-1-1trx.onrender.com/notifications/${userId}`);
            console.log('Fetched notifications:', response.data);
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleAccept = async (notificationId, reqById, notification) => {
        try {
            console.log('Accepting notification:', notification);
            await axios.put(`https://backend-1-1trx.onrender.com/notifications/${notificationId}/accept`);
            
            if (notification.returnNotification === 'accepted') {
                const mobileNumber = await fetchUserMobileNumber(reqById);
                console.log('Fetched mobile number:', mobileNumber);
                updateNotification(notificationId, { mobileNumber });
            }
            fetchNotifications(userId);
        } catch (error) {
            console.error('Error accepting notification:', error);
        }
    };

    const fetchUserMobileNumber = async (userId) => {
        try {
            const response = await axios.get(`https://backend-1-1trx.onrender.com/user/mobile/${userId}`);
            console.log('Fetched user mobile number:', response.data.mobileNumber);
            return response.data.mobileNumber;
        } catch (error) {
            console.error('Error fetching user mobile number:', error);
            return null;
        }
    };

    const handleDecline = async (notificationId) => {
        try {
            console.log('Declining notification:', notificationId);
            await axios.put(`https://backend-1-1trx.onrender.com/notifications/${notificationId}/decline`);
            fetchNotifications(userId);
        } catch (error) {
            console.error('Error declining notification:', error);
        }
    };

    const updateNotification = (notificationId, updatedFields) => {
        console.log('Updating notification:', notificationId, updatedFields);
        setNotifications(prevNotifications => {
            return prevNotifications.map(notification => {
                if (notification._id === notificationId) {
                    return { ...notification, ...updatedFields };
                }
                return notification;
            });
        });
    };

    return (
        <div className='notification-container'>
            <h2>Notifications</h2>
            {notifications.map(notification => (
                <div key={notification._id} className="notification-card">
                    <p>{notification.message}</p>
                    <p>Person: {notification.Counts}</p>
                    {notification.mobileNumber && (
                        <p>Mobile Number: {notification.mobileNumber}</p>
                    )}
                    <p>Status: {notification.returnNotification === 'none' ? 'Pending' : notification.returnNotification}</p>
                    {notification.returnNotification === 'none' && (
                        <div className='notification-button'>
                            <button className='notification-accept' onClick={() => handleAccept(notification._id, notification.ReqById, notification)}>Accept</button>
                            <button className='notification-decline' onClick={() => handleDecline(notification._id)}>Decline</button>
                        </div>
                    )}
                    {notification.returnNotification === 'accepted' && notification.mobileNumber && (
                        <p>Mobile Number: {notification.mobileNumber}</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default NotificationComponent;
