// Profile.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
function Profile() {
    const [userName, setUserName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [rating, setRating] = useState(0);
    const [vehicleName, setVehicleName] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [userId, setUserId] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('/default_image_url');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const userIdFromToken = getUserIdFromToken(token);
            setUserId(userIdFromToken);

            axios.get(`https://backend-1-1trx.onrender.com/user/${userIdFromToken}`)
                .then(response => {
                    const user = response.data;
                    setUserName(user.name);
                    setMobileNumber(user.mobileNumber);
                    setRating(user.rating);
                    setVehicleName(user.vehicleName || '');
                    setVehicleNumber(user.vehicleNumber || '');
                    setLicenseNumber(user.licenseNumber || '');
                    setImageUrl(user.profileImage || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRB-r-33_9ZqU1sAITY2wlJNXYt-qkzsLszA&usqp=CAU');
                })
                .catch(error => {
                    console.error('Error fetching user details:', error);
                });
        }
    }, []);

    const getUserIdFromToken = (token) => {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        return decodedToken.userId;
    };

    const handleSaveDetails = () => {
        const userData = {
            vehicleName,
            vehicleNumber,
            licenseNumber
        };
        axios.post(`https://backend-1-1trx.onrender.com/user/${userId}/details`, userData)
            .then(response => {
                console.log('Details saved successfully.');
                setEditMode(false);
            })
            .catch(error => {
                console.error('Error saving details:', error);
            });
    };

    const handleImageUpload = (event) => {
        const selectedFile = event.target.files[0];
        const formData = new FormData();
        formData.append('image', selectedFile);

        axios.post(`https://backend-1-1trx.onrender.com/user/${userId}/image-upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log('Image uploaded successfully.');
                setImageUrl(response.data.imageUrl);
            })
            .catch(error => {
                console.error('Error uploading image:', error);
            });
    };

    const isVehicleDetailsEmpty = () => {
        return !vehicleName && !vehicleNumber && !licenseNumber;
    };

    return (
        
        <div className="profile-container">
            <div className="profile-section left-section">
                <h3 className="section-title"><b>User Details</b></h3>
                {isVehicleDetailsEmpty() || editMode ? (
                    <div className="profile-details">
                        <input type="text" placeholder="Vehicle Name" value={vehicleName} onChange={e => setVehicleName(e.target.value)} />
                        <input type="text" placeholder="Vehicle Number" value={vehicleNumber} onChange={e => setVehicleNumber(e.target.value)} />
                        <input type="text" placeholder="Driving License Number" value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} />
                        <button onClick={handleSaveDetails}>Save Details</button>
                    </div>
                ) : (
                    <div className="profile-details">
                        <p>Name: {userName}</p>
                        <p>Mobile Number: {mobileNumber}</p>
                        <p>Vehicle Name: {vehicleName}</p>
                        <p>Vehicle Number: {vehicleNumber}</p>
                        <p>Driving License Number: {licenseNumber}</p>
                        <button onClick={() => setEditMode(true)}>Edit Details</button>
                    </div>
                )}
            </div>
            <div className="profile-section right-section">
                <h3 className="section-title"><b>Profile Picture</b></h3>
                <div className="profile-image-container">
                    <img src={imageUrl} alt="Profile" />
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                </div>
            </div>


            <div className="profile-navigation">
                <Link to="/yourride">Your Rides</Link>
                <Link to="/published-rides">Published Rides</Link>
            </div>

        </div>
        
    );
}

export default Profile;
