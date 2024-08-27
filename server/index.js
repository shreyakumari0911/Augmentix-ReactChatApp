const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');

// Route handlers
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const conversationRoutes = require('./routes/conversation');
const messageRoutes = require('./routes/message');
const postRoutes = require('./routes/posts');

// Initialize environment variables
dotenv.config();

// Create an Express application
const app = express();

// Serve static files from the "public/images" directory
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Middleware setup
app.use(express.json());  // Parse incoming JSON requests
app.use(helmet());        // Enhance security with various HTTP headers
app.use(morgan('common')); // Log HTTP requests

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    }
});
const upload = multer({ storage });

// function MongoDBstart(){
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
        .then(() => {
            console.log('MongoDB connected...', process.env.MONGO_URL);
        })
        .catch((err) => {
          console.error('MongoDB connection error:', err);
          process.exit(1); // Exit the process if unable to connect
        });
    console.log("mongodb function called", process.env.MONGO_URL);
// }
  

// Endpoint for file uploads
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        res.status(200).json('File uploaded successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).json('Error uploading file.');
    }
});

// API route handlers
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/conversation', conversationRoutes);
app.use('/api/messages', messageRoutes);

// Start the server
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Connect to MongoDB
    // MongoDBstart();
});
