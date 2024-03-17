import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Modal, Form } from 'react-bootstrap';

function PublishedRides() {
    const [publishedRides, setPublishedRides] = useState([]);
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRide, setSelectedRide] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [formData, setFormData] = useState({
        pickup: '',
        destination: '',
        date: '',
        time: '',
        availableSeats: 0 // Initialize available seats to 0 or any default value
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const { userId } = decodeJwtToken(token);
            setUserId(userId);

            axios.get(`https://backend-1-1trx.onrender.com/published-rides?userId=${userId}`)
                .then(response => {
                    setPublishedRides(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching published rides:', error);
                    setLoading(false);
                });
        }
    }, []);

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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}/${month}/${day}`;
    };

    const handleEdit = (ride) => {
        setSelectedRide(ride);
        setShowEditModal(true);
        setFormData({
            pickup: ride.pickup,
            destination: ride.destination,
            date: formatDate(ride.date),
            time: ride.time,
            availableSeats: ride.availableSeats // Set available seats from selected ride
        });
    };

    const handleDelete = (rideId) => {
        if (window.confirm('Are you sure you want to delete this ride?')) {
            axios.delete(`https://backend-1-1trx.onrender.com/published-rides/${rideId}`)
                .then(response => {
                    setPublishedRides(prevRides => prevRides.filter(ride => ride._id !== rideId));
                })
                .catch(error => {
                    console.error('Error deleting ride:', error);
                });
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        axios.put(`https://backend-1-1trx.onrender.com/published-rides/${selectedRide._id}`, {
            pickup: formData.pickup,
            destination: formData.destination,
            date: formData.date,
            time: formData.time,
            availableSeats: formData.availableSeats // Include available seats in the request
        })
        .then(response => {
            const updatedRides = publishedRides.map(ride => {
                if (ride._id === selectedRide._id) {
                    return { ...ride, ...formData };
                }
                return ride;
            });
            setPublishedRides(updatedRides);
            setShowEditModal(false);
        })
        .catch(error => {
            console.error('Error updating ride:', error);
        });
    };

    return (
        <div className='yourride'>
            <h2>Your Published Rides</h2>
            {loading ? <div>Loading...</div> :
                error ? <div>Error: {error.message}</div> :
                    <div className="card-container">
                        {publishedRides.map(ride => (
                            <Card key={ride._id} className='publishedcard'>
                                <Card.Body>
                                    <Card.Title>{ride.pickup} to {ride.destination}</Card.Title>
                                    <Card.Text>Date: {formatDate(ride.date)}</Card.Text>
                                    <Card.Text>Time: {ride.time}</Card.Text>
                                    <Button variant="primary" onClick={() => handleEdit(ride)}>Edit</Button>
                                    <Button variant="danger" onClick={() => handleDelete(ride._id)}>Delete</Button>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
            }

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Ride</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditSubmit}>
                        <Form.Group controlId="pickup">
                            <Form.Label>Pickup</Form.Label>
                            <Form.Control type="text" name="pickup" value={formData.pickup} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group controlId="destination">
                            <Form.Label>Destination</Form.Label>
                            <Form.Control type="text" name="destination" value={formData.destination} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group controlId="date">
                            <Form.Label>Date</Form.Label>
                            <Form.Control type="date" name="date" value={formData.date} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group controlId="time">
                            <Form.Label>Time</Form.Label>
                            <Form.Control type="time" name="time" value={formData.time} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group controlId="availableSeats">
                            <Form.Label>Available Seats</Form.Label>
                            <Form.Control type="number" name="availableSeats" value={formData.availableSeats} onChange={handleInputChange} />
                        </Form.Group>
                        <Button variant="primary" type="submit">Save Changes</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default PublishedRides;
