const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const mongoDBUri = 'mongodb+srv://ala:ala123@cluster0.tojwjkt.mongodb.net/elearning?retryWrites=true&w=majority';
mongoose.connect(mongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

// Course schema
const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  price: Number,
});

const Course = mongoose.model('Courses', courseSchema);

// Admin user schema
const userAuthSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const UserAuth = mongoose.model('UserAuth', userAuthSchema);

app.post('/api/user/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await UserAuth.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.password === password) {
      return res.json({ success: "User authenticated" });
    } else {
      return res.status(400).json({ message: "Incorrect password" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// CRUD operations for courses
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/courses', async (req, res) => {
  const { title, description, image, price } = req.body;
  try {
    const newCourse = await Course.create({ title, description, image, price });
    res.json(newCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/courses/:id', async (req, res) => {
  const courseId = req.params.id;
  const { title, description, image, price } = req.body;
  try {
    const updatedCourse = await Course.findByIdAndUpdate(courseId, { title, description, image, price }, { new: true });
    res.json(updatedCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  const courseId = req.params.id;
  try {
    await Course.findByIdAndDelete(courseId);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
