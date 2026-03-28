import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getRoadmaps, getRoadmapsByUserId, getRoadmapById, addRoadmap, deleteRoadmapById } from '../sharedStore.js';

const router = express.Router();

// Create roadmap
router.post('/', verifyToken, (req, res) => {
  try {
    const { topic, content, difficulty } = req.body;
    const dayBlocks = content.split(/📅 DAY \d+:|DAY \d+:/g).filter(b => b.trim() !== "");
    const days = dayBlocks.length;

    const roadmap = {
      id: 'roadmap_' + Date.now(),
      userId: req.userId,
      topic,
      content,
      days,
      difficulty: difficulty || 'intermediate',
      status: 'active',
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    addRoadmap(roadmap);

    res.status(201).json({
      message: 'Roadmap saved successfully',
      roadmap: {
        id: roadmap.id,
        topic: roadmap.topic,
        days: roadmap.days,
        progress: 0
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all roadmaps for user
router.get('/', verifyToken, (req, res) => {
  try {
    console.log(`[Roadmap GET] User ID: ${req.userId}`);
    const userRoadmaps = getRoadmapsByUserId(req.userId);
    console.log(`[Roadmap GET] Found ${userRoadmaps.length} roadmaps for user`);
    res.json({
      total: userRoadmaps.length,
      roadmaps: userRoadmaps.map(r => ({
        id: r.id,
        topic: r.topic,
        days: r.days || 0,
        progress: r.progress || 0,
        status: r.status || 'active',
        difficulty: r.difficulty || 'intermediate',
        content: r.content,
        createdAt: r.createdAt
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single roadmap
router.get('/:id', verifyToken, (req, res) => {
  try {
    const roadmap = getRoadmapById(req.params.id);
    if (!roadmap || roadmap.userId !== req.userId) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }
    res.json(roadmap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete roadmap
router.delete('/:id', verifyToken, (req, res) => {
  try {
    const roadmap = getRoadmapById(req.params.id);
    if (!roadmap || roadmap.userId !== req.userId) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }
    deleteRoadmapById(req.params.id);
    res.json({ message: 'Roadmap deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update roadmap progress
router.patch('/:id', verifyToken, (req, res) => {
  try {
    const roadmap = getRoadmapById(req.params.id);
    if (!roadmap || roadmap.userId !== req.userId) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }
    const { progress, status } = req.body;
    if (progress !== undefined) roadmap.progress = progress;
    if (status !== undefined) roadmap.status = status;
    roadmap.updatedAt = new Date();
    console.log(`[Roadmap PATCH] Updated roadmap ${req.params.id}: progress=${progress}%, status=${status}`);
    res.json({ message: 'Roadmap updated successfully', roadmap });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
