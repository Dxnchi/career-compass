const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Your very first API Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'success', 
        message: 'Career Compass Engine is live and ready.' 
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});