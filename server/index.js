/* =============================================
 * --- IMPORTS (The tools we need) ---
 * ============================================= */
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer'); // For handling file uploads
const { CloudinaryStorage } = require('multer-storage-cloudinary'); // For Cloudinary
const cloudinary = require('cloudinary').v2; // For Cloudinary

/* =============================================
 * --- IMPORT YOUR MODELS ---
 * ============================================= */
const User = require('./models/User');
const Property = require('./models/Property');

/* =============================================
 * --- INITIAL SETUP & CONFIG ---
 * ============================================= */
dotenv.config(); // Load variables from your .env file
const app = express(); // Create your application

/* =============================================
 * --- CLOUDINARY CONFIG (NEW!) ---
 * ============================================= */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// This tells multer to store files in Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'airbnb-clone', // A folder name in your Cloudinary account
    allowed_formats: ['jpg', 'png', 'jpeg']
  }
});

// 'upload' is our configured multer instance
const upload = multer({ storage: storage });

/* =============================================
 * --- MIDDLEWARE (The "rules" for the server) ---
 * ============================================= */
app.use(cors());
app.use(express.json()); // Allow the server to read incoming JSON

/* =============================================
 * --- DATABASE CONNECTION ---
 * ============================================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully!'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

/* =============================================
 * --- API ROUTES (The "endpoints") ---
 * ============================================= */

// A simple test route
app.get('/', (req, res) => {
  res.send('Welcome to the Airbnb Clone API! Server is running.');
});

// --- YOUR AUTH ROUTES (Unchanged) ---
app.post('/api/auth/register', async (req, res) => {
  // ... (your existing register code is fine, no changes)
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ username, passwordHash });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('SERVER REGISTER ERROR:', err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already taken' });
    }
    res.status(500).json({ error: 'An unexpected error occurred on the server' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  // ... (your existing login code is fine, no changes)
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Wrong username or password' });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Wrong username or password' });
    }
    res.status(200).json({ 
      message: 'Login successful!', 
      userId: user._id,
      username: user.username 
    });
  } catch (err) {
    console.error('SERVER LOGIN ERROR:', err);
    res.status(500).json({ error: 'An unexpected error occurred on the server' });
  }
});

// --- NEW FILE UPLOAD ROUTE ---
// This route just takes a file, uploads it to Cloudinary, and returns the URL
app.post('/api/upload', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // req.file.path contains the URL from Cloudinary
  res.status(200).json({ url: req.file.path });
});

// --- UPDATED CREATE PROPERTY ROUTE ---
// This route now accepts JSON data (including a URL)
app.post('/api/properties', async (req, res) => {
  try {
    // We get the data from the body
    const { title, address, description, pricePerNight, imageUrl, owner } = req.body;

    // We check for the URL, which could come from the file upload or the text box
    if (!imageUrl) {
       return res.status(400).json({ error: 'An image URL is required' });
    }

    const newProperty = new Property({
      title,
      address,
      description,
      pricePerNight,
      imageUrl, // We save the final URL here
      owner
    });

    await newProperty.save();
    res.status(201).json({ message: 'Property created successfully', property: newProperty });
    
  } catch (err) {
    console.error('SERVER CREATE PROPERTY ERROR:', err);
    res.status(500).json({ error: 'Error creating property' });
  }
});


/// --- GET ALL PROPERTIES (NOW WITH SEARCH!) ---
app.get('/api/properties', async (req, res) => {
  try {
    const { location } = req.query; // Get 'location' from URL (e.g., ?location=Paris)
    
    let filter = {}; // Start with an empty filter

    if (location) {
      // If a location is provided, filter by the 'address' field.
      // '$regex: location' is a "contains" search
      // '$options: 'i'' makes it case-insensitive
      filter.address = { $regex: location, $options: 'i' };
    }

    // Find all properties that match the filter (if no location, filter is empty)
    const properties = await Property.find(filter);
    
    // Send them back as JSON
    res.status(200).json(properties);

  } catch (err) {
    console.error('SERVER GET PROPERTIES ERROR:', err);
    res.status(500).json({ error: 'Error fetching properties' });
  }
});
// --- GET A SINGLE PROPERTY BY ID (NEW!) ---
app.get('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the URL

    // Find the property in the database
    const property = await Property.findById(id); 
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Send the single property back
    res.status(200).json(property);

  } catch (err) {
    console.error('SERVER GET_ONE_PROPERTY ERROR:', err);
    res.status(500).json({ error: 'Error fetching property details' });
  }
});
// --- GET ALL PROPERTIES FOR A SPECIFIC USER (NEW!) ---
app.get('/api/properties/my-properties/:userId', async (req, res) => {
  try {
    const { userId } = req.params; // Get the user's ID from the URL

    // Find all properties where the 'owner' field matches the userId
    const properties = await Property.find({ owner: userId });
    
    res.status(200).json(properties);

  } catch (err) {
    console.error('SERVER GET_MY_PROPERTIES ERROR:', err);
    res.status(500).json({ error: 'Error fetching your properties' });
  }
});
// --- DELETE A PROPERTY (NEW!) ---
app.delete('/api/properties/:id', async (req, res) => {
  try {
    const propertyId = req.params.id;
    // We get the userId from the request body
    const { userId } = req.body; 

    // Find the property first
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // --- SECURITY CHECK ---
    // Check if the person trying to delete is the owner
    if (property.owner.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized: You are not the owner' });
    }

    // If checks pass, delete the property
    await Property.findByIdAndDelete(propertyId);

    res.status(200).json({ message: 'Property deleted successfully' });

  } catch (err) {
    console.error('SERVER DELETE PROPERTY ERROR:', err);
    res.status(500).json({ error: 'Error deleting property' });
  }
});
// --- UPDATE A PROPERTY (NEW!) ---
app.put('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body; // This holds all the new form data

    // Find the property first
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // --- SECURITY CHECK ---
    // Check if the user ID from the form matches the property's owner
    // This prevents someone from hijacking the request
    if (property.owner.toString() !== updatedData.owner) {
      return res.status(403).json({ error: 'Unauthorized: You are not the owner' });
    }

    // If checks pass, find by ID and update it
    const updatedProperty = await Property.findByIdAndUpdate(id, updatedData, {
      new: true, // This returns the new, updated document
      runValidators: true // This ensures the new data is valid
    });

    res.status(200).json({ message: 'Property updated successfully', property: updatedProperty });

  } catch (err) {
    console.error('SERVER UPDATE PROPERTY ERROR:', err);
    res.status(500).json({ error: 'Error updating property' });
  }
});

/* =============================================
 * --- START THE SERVER ---
 * ============================================= */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});