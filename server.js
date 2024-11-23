require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');
const userRoutes = require('./routes/user.routes.js');

const app = express();

// Redis setup
const redisClient = createClient({ legacyMode: true });
redisClient.connect().catch(console.error);

const redisStore = new RedisStore({ client: redisClient });

// Middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  session({
    store: redisStore,
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true in production with HTTPS
  })
);

// Database connection using async/await
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process with failure
  }
}

// Call the connectDB function
connectDB();

// Routes
app.use('/api/users', userRoutes);



// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
