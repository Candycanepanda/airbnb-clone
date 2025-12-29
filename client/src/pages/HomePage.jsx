import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './HomePage.css';
import SearchWidget from '../components/SearchWidget'; // We keep the search

function HomePage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState({});

  // Updated fetch logic to handle search
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams(searchQuery).toString();
        const response = await axios.get(`http://localhost:4000/api/properties?${params}`);
        setProperties(response.data);
      } catch (err) {
        console.error('Error fetching properties:', err);
        alert('Could not fetch properties. See console for details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [searchQuery]); // Re-runs when search query changes

  return (
    <div className="home-container">
      
      {/* --- SEARCH WIDGET --- */}
      <SearchWidget onSearch={setSearchQuery} /> 

      <h2 className="properties-header">All Properties</h2>
      
      {/* --- PROPERTY GRID --- */}
      <div className="properties-grid">
        {loading ? (
          <p>Loading...</p>
        ) : properties.length > 0 ? (
          properties.map((property) => (
            // The link now wraps the whole card. No more delete logic.
            <Link 
              to={`/property/${property._id}`} 
              key={property._id} 
              className="property-card-link"
            >
              <div className="property-card">
                <img 
                  src={property.imageUrl} 
                  alt={property.title} 
                  className="property-image" 
                />
                <div className="property-info">
                  <h3 className="property-title">{property.title}</h3>
                  <p className="property-address">{property.address}</p>
                  <p className="property-price">
                    <strong>${property.pricePerNight}</strong> / night
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No properties found matching your search. Try a different location.</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;