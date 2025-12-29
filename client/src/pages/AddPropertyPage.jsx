import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddPropertyPage.css';

function AddPropertyPage() {
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerNight, setPricePerNight] = useState('');
  
  // --- NEW LOGIC ---
  const [imageUrl, setImageUrl] = useState(''); // For the URL text box
  const [file, setFile] = useState(null); // For the file upload
  const [isUploading, setIsUploading] = useState(false);
  
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setImageUrl(''); // Clear the URL box if a file is selected
  };

  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
    setFile(null); // Clear the file if a URL is pasted
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('You must be logged in to add a property.');
      return navigate('/login');
    }

    let finalImageUrl = imageUrl; // Start with the URL from the text box

    // --- THIS IS THE NEW UPLOAD LOGIC ---
    if (file) {
      // Step 1: Upload the file first
      setIsUploading(true);
      const formData = new FormData();
      formData.append('photo', file); // 'photo' must match the backend route

      try {
        const uploadRes = await axios.post('http://localhost:4000/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        finalImageUrl = uploadRes.data.url; // Get the URL from Cloudinary
        setIsUploading(false);

      } catch (err) {
        console.error(err);
        alert('File upload failed. Please try again.');
        setIsUploading(false);
        return;
      }
    }
    // --- End of new upload logic ---

    if (!finalImageUrl) {
      alert('Please provide an image by uploading a file or pasting a URL.');
      return;
    }

    // Step 2: Create the property with the final URL
    try {
      const newProperty = {
        title,
        address,
        pricePerNight: Number(pricePerNight),
        description,
        imageUrl: finalImageUrl, // Send the final URL
        owner: userId
      };

      await axios.post('http://localhost:4000/api/properties', newProperty);
      alert('Property added!');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Error adding property: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Add a New Property</h2>
        
        {/* Unchanged fields */}
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

        {/* --- NEW FILE INPUT --- */}
        <div className="form-group">
          <label>Upload Image from Device</label>
          <input type="file" onChange={handleFileChange} accept="image/*" />
        </div>

        <p style={{ textAlign: 'center', margin: '10px 0', color: '#777' }}>OR</p>

        {/* --- EXISTING URL INPUT --- */}
        <div className="form-group">
          <label>Paste Image URL</label>
          <input type="text" value={imageUrl} onChange={handleUrlChange} />
        </div>
        
        {/* Show a message while uploading */}
        {isUploading && <p>Uploading image, please wait...</p>}
        
        <button type="submit" className="form-button" disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Add Property'}
        </button>
      </form>
    </div>
  );
}

export default AddPropertyPage;