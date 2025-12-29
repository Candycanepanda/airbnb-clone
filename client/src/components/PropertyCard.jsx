import React from 'react';
import { Link } from 'react-router-dom';

function PropertyCard({ property }) {
  return (
    <Link to={`/properties/${property._id}`} className="property-card">
      <img src={property.imageUrl} alt={property.title} className="property-card-image" />
      <div className="property-card-info">
        <h3>{property.title}</h3>
        <p>{property.location}</p>
        <p className="price">${property.price} / night</p>
      </div>
    </Link>
  );
}

export default PropertyCard;