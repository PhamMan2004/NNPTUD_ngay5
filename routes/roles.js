const express = require('express');
const router = express.Router();
const Role = require('../schemas/role');
const User = require('../schemas/user');

// Get all roles (non-deleted)
router.get('/', async (req, res) => {
    try {
        const roles = await Role.find({ isDeleted: false });
        res.json(roles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get role by ID
router.get('/:id', async (req, res) => {
    try {
        const role = await Role.findOne({ _id: req.params.id, isDeleted: false });
        if (!role) return res.status(404).json({ message: 'Role not found' });
        res.json(role);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new role
router.post('/', async (req, res) => {
    try {
        const newRole = new Role(req.body);
        const savedRole = await newRole.save();
        res.status(201).json(savedRole);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update role
router.put('/:id', async (req, res) => {
    try {
        const updatedRole = await Role.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedRole) return res.status(404).json({ message: 'Role not found' });
        res.json(updatedRole);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Soft delete role
router.delete('/:id', async (req, res) => {
    try {
        const deletedRole = await Role.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        if (!deletedRole) return res.status(404).json({ message: 'Role not found' });
        res.json({ message: 'Role soft-deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4) Get all users by role ID: /roles/:id/users
router.get('/:id/users', async (req, res) => {
    try {
        const users = await User.find({ role: req.params.id, isDeleted: false });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
