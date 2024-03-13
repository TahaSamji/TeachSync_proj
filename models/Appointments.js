const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    appointer: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    appointee: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    fromDate: String,
    toDate: String,
    description: String,
    confirmed: {
        type: Number,
        default: 0
    },
    completed: {
        type: Boolean,
        default: false
    },
    cancelled: {
        type: Boolean,
        default: false
    }
});

const Appointments = mongoose.model('Appointments', AppointmentSchema);

module.exports = Appointments;