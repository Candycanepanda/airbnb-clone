// src/pages/EditPropertyPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams ,Navigate } from 'react-router-dom';
import './AddPropertyPage.css'; // We re-use the same form styles

function EditPropertyPage() {
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerNight, setPricePerNight] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [owner, setOwner] = useState(''); // To store the owner ID for security
  
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const { id } = useParams(); // Get the property ID from the URL

  // --- 1. FETCH THE CURRENT PROPERTY DATA ---
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/properties/${id}`);
        const data = response.data;
        
        // --- 2. PRE-FILL THE FORM ---
        setTitle(data.title);
        setAddress(data.address);
        setDescription(data.description);
        setPricePerNight(data.pricePerNight);
        setImageUrl(data.imageUrl);
        setOwner(data.owner); // Save the owner ID
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch property data:', err);
        alert('Failed to load property. You may not be the owner.');
        navigate('/my-properties'); // Send them back
      }
    };
    fetchProperty();
  }, [id, navigate]);

  // --- 3. HANDLE THE SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // We get this from local storage to prove we are logged in
    const currentUserId = localStorage.getItem('userId');
    
    // Security check: Does the logged-in user match the property's owner?
    if (currentUserId !== owner) {
        alert('Authentication failed. You are not the owner of this property.');
        return;
    }

    const updatedProperty = {
      title,
      address,
      description,
      pricePerNight: Number(pricePerNight),
      imageUrl,
      owner // Pass the owner ID back for the backend's security check
    };

    try {
      // Use the PUT route to update
      await axios.put(`http://localhost:4000/api/properties/${id}`, updatedProperty);
      alert('Property updated successfully!');
      navigate('/my-properties'); // Go back to the "My Properties" list
    } catch (err) {
      console.error(err);
      alert('Error updating property: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', fontSize: '1.5rem', marginTop: '40px' }}>Loading editor...</div>;
  }

  // --- 4. RENDER THE FORM (Same as AddPropertyPage) ---
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Edit Your Property</h2>
        
        <div className="form-group">
          <label>Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Address (Location)</label>
          <input type="text" value={address} onChange={e => setAddress(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Price per night</label>
          <input type="number" value={pricePerNight} onChange={e => setPricePerNight(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
          <p style={{fontSize: '0.8rem', color: '#777', marginTop: '5px'}}>Note: To change the image, please paste a new URL.</p>
        </div>
        
        <button type="submit" className="form-button">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditPropertyPage;