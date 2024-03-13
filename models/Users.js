const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    role: String,
    program: String,
    batch: String,
    coursesAssigned: [String],
    officeHours: [],
    department: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Users = mongoose.model('Users', UserSchema);

module.exports = Users;