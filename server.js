const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { ObjectId } = mongoose.Schema.Types;
const morgan = require('morgan');


const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(422).json({ errors: errors.array() });
  };
};

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));


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
  deadline: String,
  image: String,
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

app.post('/api/addProject',
  validate([
    body('name').isLength({ min: 3, max: 25 }),
    body('description').isLength({ min: 5, max: 100 }),
    body('deadline').isLength({ min: 10 }),
    body('image').isLength({ min: 7 }),
  ]), async (req, res) => {
    try {
      const { name, description, deadline, image } = req.body;
      console.log(name + " - name\n" + description + " - desc\n" + deadline + "- deadline\n" + image + " - img link");
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

app.put('/api/updProject/:_id', async (req, res) => {
  try {
    const projectId = req.params._id;
    const updatedProjectData = req.body;

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $set: updatedProjectData },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: 'Проект не найден' });
    }

    res.json({ message: 'Информация о проекте успешно обновлена', updatedProject });
  } catch (error) {
    console.error('Ошибка при обновлении проекта:', error);
    res.status(500).send('Internal Server Error ');
  }
});


app.delete('/api/deleteProject/:_id', async (req, res) => {
  try {
    const projectId = req.params._id;
    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (!deletedProject) {
      return res.status(404).json({ message: 'Проект не найден' });
    }

    res.json({ message: 'Проект успешно удалён', deletedProject });
  } catch (error) {
    console.error('Ошибка при удалении проекта:', error);
    res.status(500).send(`Internal Server Error`);
  }
});

app.listen(PORT, () => {
  console.log(`Server is working on port ${PORT}`);
});
