const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // To parse JSON data

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://avionaramos2:jSXAt3Dh8FJEjZsU@aviona.j7kb1.mongodb.net/?retryWrites=true&w=majority&appName=aviona', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1); // Exit if MongoDB connection fails
    });

// Define a schema for the users collection
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true } 
});

// Create a model for the users collection
const User = mongoose.model('User', userSchema);

// Serve static files (for the form)
app.use(express.static('public'));

// Handle form submission without redirection
app.post('/signup', async (req, res) => {
    const { email } = req.body;

    console.log('Received email:', email); // Log the received email for debugging

    if (!email) {
        return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'This email is already registered.' });
        }

        // Save email to the database
        const newUser = new User({ email });
        await newUser.save();

        // Send success response
        res.status(200).json({ message: 'Email successfully saved to the database.' });
    } catch (err) {
        console.error('Error saving to database:', err);

        // Log the specific error message from MongoDB
        if (err.name === 'MongoError' && err.code === 11000) {
            return res.status(400).json({ message: 'This email is already registered.' });
        }

        res.status(500).json({ message: `An error occurred: ${err.message}` }); // Return the error message to the client
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
