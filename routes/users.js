const express = require('express');
const router = express.Router();
const User = require('../schemas/user');

// Get all users (non-deleted)
router.get('/', async (req, res) => {
    try {
        const users = await User.find({ isDeleted: false }).populate('role');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new user
router.post('/', async (req, res) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update user
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Soft delete user
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User soft-deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2) POST /users/enable: Nhận email và username từ body -> status: true
router.post('/enable', async (req, res) => {
    const { email, username } = req.body;
    try {
        const user = await User.findOneAndUpdate(
            { email, username, isDeleted: false },
            { status: true },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found with provided email and username' });
        res.json({ message: 'User enabled successfully', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3) POST /users/disable: Nhận email và username từ body -> status: false
router.post('/disable', async (req, res) => {
    const { email, username } = req.body;
    try {
        const user = await User.findOneAndUpdate(
            { email, username, isDeleted: false },
            { status: false },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found with provided email and username' });
        res.json({ message: 'User disabled successfully', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
