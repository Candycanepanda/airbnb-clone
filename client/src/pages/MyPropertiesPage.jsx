import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './MyPropertiesPage.css'; // We'll create this next

function MyPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    // If user is not logged in, send them to the login page
    if (!currentUserId) {
      navigate('/login');
      return;
    }

    const fetchMyProperties = async () => {
      try {
        setLoading(true);
        // Use our new backend route to get ONLY this user's properties
        const response = await axios.get(`http://localhost:4000/api/properties/my-properties/${currentUserId}`);
        setProperties(response.data);
      } catch (err) {
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProperties();
  }, [currentUserId, navigate]);

  // --- DELETE FUNCTION (Moved from HomePage) ---
  const handleDelete = async (propertyId) => {
    if (!window.confirm('Are you sure you want to permanently delete this property?')) {
      return;
    }
    try {
      await axios.delete(`http://localhost:4000/api/properties/${propertyId}`, {
        data: { userId: currentUserId }
      });
      setProperties(prevProperties =>
        prevProperties.filter(property => property._id !== propertyId)
      );
      alert('Property deleted!');
    } catch (err) {
      console.error('Error deleting property:', err);
      alert('Failed to delete property. ' + (err.response?.data?.error || ''));
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', fontSize: '1.5rem', marginTop: '40px' }}>Loading your properties...</div>;
  }

  return (
    <div className="my-properties-container">
      <h1>My Properties</h1>
      <div className="my-properties-grid">
        {properties.length > 0 ? (
          properties.map((property) => (
            <div key={property._id} className="property-card">
              {/* This link goes to the standard details page */}
              <Link to={`/property/${property._id}`} className="property-card-link-internal">
                <img 
                  src={property.imageUrl} 
                  alt={property.title} 
                  className="property-image" 
                />
                <div className="property-info">
                  <h3 className="property-title">{property.title}</h3>
                  <p className="property-address">{property.address}</p>
                </div>
              </Link>
              
              {/* --- ACTION BUTTONS --- */}
              <div className="property-actions">
                <Link to={`/edit-property/${property._id}`} className="action-btn update-btn">
                  Update
                </Link>
                <button 
                  onClick={() => handleDelete(property._id)} 
                  className="action-btn remove-btn"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>You haven't added any properties yet. <Link to="/add-property">Add one now!</Link></p>
        )}
      </div>
    </div>
  );
}

export default MyPropertiesPage;