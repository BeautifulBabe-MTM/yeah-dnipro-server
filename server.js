const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://admin:123zxc34@cluster0.hoxv5bc.mongodb.net/eDnipro', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  deadlines: Date,
  imageUrl: String,
});

const Project = mongoose.model('Project', projectSchema, 'projects');

module.exports = Project;

app.use(cors());
app.use(express.json());

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    console.log('Проекты:', projects);
    console.log('Кол-во проектов:', projects.length);
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/addProjects', async (req, res) => {
  try {
    const { name, description, deadline, image } = req.body;
    
    const newProject = new Project({
      name,
      description,
      deadline,
      image,
    });

    const savedProject = await newProject.save();

    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Ошибка при добавлении в бд:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(PORT, () => {
  console.log(`Server is working on port ${PORT}`);
});
