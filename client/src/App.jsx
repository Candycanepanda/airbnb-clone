import React from 'react';
import { Routes, Route } from 'react-router-dom';

// --- IMPORT ALL COMPONENTS & PAGES ---
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; 
import AddPropertyPage from './pages/AddPropertyPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import MyPropertiesPage from './pages/MyPropertiesPage';
import EditPropertyPage from './pages/EditPropertyPage';

function App() {
  return (
    <>
      <Header />
      
      <div className="main-content-wrapper">
        <main style={{ maxWidth: '1200px', margin: '24px auto', padding: '0 20px', paddingTop: '80px', position: 'relative', zIndex: 10 }}>
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/add-property" element={<AddPropertyPage />} />
            <Route path="/property/:id" element={<PropertyDetailPage />} /> 
            <Route path="/my-properties" element={<MyPropertiesPage />} />
            <Route path="/edit-property/:id" element={<EditPropertyPage />} /> 
          </Routes>
          
        </main>
      </div>

      {/* --- ANIMATED DROPLETS BACKGROUND --- */}
      <div className="droplets-background">
        <div className="droplet droplet-1"></div>
        <div className="droplet droplet-2"></div>
        <div className="droplet droplet-3"></div>
        <div className="droplet droplet-4"></div>
        <div className="droplet droplet-5"></div>
        <div className="droplet droplet-6"></div>
        <div className="droplet droplet-7"></div>
        <div className="droplet droplet-8"></div>
      </div>
      {/* --- END DROPLETS --- */}
    </>
  );
}

export default App;