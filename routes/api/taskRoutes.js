const express = require('express');
const router = express.Router();
const Task = require('../../models/Task');
const Project = require('../../models/Project');
const auth = require('../../utils/auth');

router.use(auth);

// POST /api/projects/:projectId/tasks
router.post('/projects/:projectId/tasks', async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  if (!project || project.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const task = await Task.create({ ...req.body, project: project._id });
  res.status(201).json(task);
});

// GET /api/projects/:projectId/tasks
router.get('/projects/:projectId/tasks', async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  if (!project || project.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const tasks = await Task.find({ project: req.params.projectId });
  res.json(tasks);
});

// PUT /api/tasks/:taskId
router.put('/tasks/:taskId', async (req, res) => {
  const task = await Task.findById(req.params.taskId).populate('project');
  if (!task || task.project.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  Object.assign(task, req.body);
  await task.save();
  res.json(task);
});

// DELETE /api/tasks/:taskId
router.delete('/tasks/:taskId', async (req, res) => {
  const task = await Task.findById(req.params.taskId).populate('project');
  if (!task || task.project.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  await task.deleteOne();
  res.json({ message: 'Deleted' });
});

module.exports = router;
