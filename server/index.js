const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { Readable } = require('stream');
const apiKey = require('./apiKey.json');


// Route handlers
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const conversationRoutes = require('./routes/conversation');
const messageRoutes = require('./routes/message');
const postRoutes = require('./routes/posts');

// Initialize environment variables
dotenv.config();
const SCOPE = ['https://www.googleapis.com/auth/drive']
// Create an Express application
const app = express();
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000', // replace with your frontend URL
  methods: ['GET', 'POST'], // allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // allowed headers
}));
const TOKEN_PATH = 'token.json';
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Load and set OAuth2 credentials if available
const loadToken = () => {
  if (fs.existsSync(TOKEN_PATH)) {
    const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
    oauth2Client.setCredentials(tokens);
  }
};
loadToken();

// Middleware setup
app.use(express.json());  // Parse incoming JSON requests
app.use(helmet());        // Enhance security with various HTTP headers
app.use(morgan('common')); // Log HTTP requests

// Multer setup for in-memory file uploads
const storage = multer.memoryStorage(); // Use memory storage
const upload = multer({ storage });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected...'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process if unable to connect
  });

// Google Drive authentication routes
async function authorize(){
  const jwtClient = new google.auth.JWT(
    apiKey.client_email,
    null,
    apiKey.private_key,
    SCOPE
  );
  await jwtClient.authorize();
  return jwtClient;
}

// Endpoint to get Image
app.get('/api/image/:id', async (req, res) => {
  const authClient = await authorize();
  const drive = google.drive({ version: 'v3', auth: authClient });
  try {
    const fileId = req.params.id;
    const response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );
    
    response.data
      .on('end', () => console.log('Done downloading file.'))
      .on('error', err => {
        console.error('Error downloading file:', err);
        res.status(500).send('Error fetching image from Google Drive');
      })
      .pipe(res);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Error fetching image');
  }
});

// Endpoint for file uploads
app.post('/api/upload', upload.single('file'), async (req, res) => {
  const authClient = await authorize();
  try {
    const drive = google.drive({ version: 'v3', auth: authClient });
    const { originalname, buffer, mimetype } = req.file;

    // Upload the file to Google Drive
    const response = await drive.files.create({
      requestBody: {
        name: originalname, // Set the file name
        mimeType: mimetype,
        parents: ['1pkYMf6ZXNL8VEs4dI5jebC8PbiwD4qg5']
      },
      media: {
        mimeType: mimetype,
        body: Readable.from(buffer), // Pass buffer directly
      },
    });

    const fileId = response.data.id; // Get Google Drive file ID
    // console.log(response);
    res.status(200).json({ message: 'Image uploaded and saved successfully', fileId, mimetype });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file' });
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
});
