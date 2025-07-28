const express = require('express');
const router = express.Router();
const Project = require('../../models/Project');
const auth = require('../../utils/auth');

// All routes use auth
router.use(auth);

// POST /api/projects
router.post('/', async (req, res) => {
  try {
    const project = await Project.create({ ...req.body, user: req.user._id });
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/projects
router.get('/', async (req, res) => {
  const projects = await Project.find({ user: req.user._id });
  res.json(projects);
});

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project || project.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  res.json(project);
});

// PUT /api/projects/:id
router.put('/:id', async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project || project.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  Object.assign(project, req.body);
  await project.save();
  res.json(project);
});

// DELETE /api/projects/:id
router.delete('/:id', async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project || project.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  await project.deleteOne();
  res.json({ message: 'Deleted' });
});

module.exports = router;
