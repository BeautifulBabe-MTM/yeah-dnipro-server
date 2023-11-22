const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Подключение к MongoDB
mongoose.connect('mongodb+srv://admin:123zxc34@cluster0.hoxv5bc.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  deadlines: String,
  imageUrl: String,
});

const Project = mongoose.model('projects', projectSchema);

app.use(cors());
app.use(express.json());

app.get('/projects/get', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
    console.log(projects.name);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
