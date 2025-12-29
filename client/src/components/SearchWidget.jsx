import React, { useState } from 'react';
import './SearchWidget.css'; // We'll create this next

function SearchWidget({ onSearch }) {
  const [location, setLocation] = useState('');
  
  // We'll add UI for dates/guests, but the logic just uses location for now
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const handleSearch = (e) => {
    e.preventDefault();
    // When "Search" is clicked, we call the onSearch function
    // and pass the location up to the HomePage
    onSearch({ location });
  };

  return (
    <div className="search-widget-container">
      <form className="search-widget-form" onSubmit={handleSearch}>
        
        {/* --- Location Input --- */}
        <div className="search-input-group">
          <label htmlFor="location">Where</label>
          <input 
            type="text" 
            id="location" 
            placeholder="Search destinations" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* --- Date/Guest Inputs (UI only for now) --- */}
        <div className="search-input-group">
          <label htmlFor="checkin">Check in</label>
          <input 
            type="text" 
            id="checkin" 
            placeholder="Add dates"
            onFocus={(e) => e.target.type = 'date'}
            onBlur={(e) => e.target.type = 'text'}
          />
        </div>
        <div className="search-input-group">
          <label htmlFor="checkout">Check out</label>
          <input 
            type="text" 
            id="checkout" 
            placeholder="Add dates"
            onFocus={(e) => e.target.type = 'date'}
            onBlur={(e) => e.target.type = 'text'}
          />
        </div>
        <div className="search-input-group guests">
          <label htmlFor="guests">Who</label>
          <input 
            type="text" 
            id="guests" 
            placeholder="Add guests"
          />
        </div>

        {/* --- Search Button --- */}
        <button type="submit" className="search-widget-button">
          <svg viewBox="0 0 32 32" height="16" width="16" fill="currentColor">
            <path d="M13 24a11 11 0 1 0 0-22 11 11 0 0 0 0 22zm8.7 5.3a1 1 0 0 1-1.4 0l-4.2-4.2a1 1 0 0 1 1.4-1.4l4.2 4.2a1 1 0 0 1 0 1.4z"></path>
          </svg>
          Search
        </button>

      </form>
    </div>
  );
}

export default SearchWidget;