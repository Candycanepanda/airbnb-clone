// src/pages/PropertyDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PropertyDetailPage.css'; // We'll create this next

function PropertyDetailPage() {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // This hook gets the ":id" from the URL
  const { id } = useParams(); 

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        // Use our new backend route
        const response = await axios.get(`http://localhost:4000/api/properties/${id}`);
        setProperty(response.data);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Failed to load property details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]); // Re-run this effect if the ID in the URL changes

  if (loading) {
    return <div className="detail-status">Loading...</div>;
  }

  if (error) {
    return <div className="detail-status detail-error">{error}</div>;
  }

  if (!property) {
    return null; // or a "Property not found" message
  }

  return (
    <div className="property-detail-container">
      {/* --- Title --- */}
      <h1 className="property-detail-title">{property.title}</h1>
      <p className="property-detail-address">{property.address}</p>
      
      {/* --- Image --- */}
      <div className="property-detail-image-container">
        <img 
          src={property.imageUrl} 
          alt={property.title} 
          className="property-detail-image" 
        />
      </div>

      {/* --- Main Content --- */}
      <div className="property-detail-content">
        <div className="property-detail-description">
          <h2>Property Details</h2>
          <p>{property.description || 'No description provided.'}</p>
        </div>
        
        {/* --- Booking Box (UI only for now) --- */}
        <div className="property-detail-booking-box">
          <div className="booking-box-price">
            <strong>${property.pricePerNight}</strong> / night
          </div>
          <button className="booking-box-button">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetailPage;