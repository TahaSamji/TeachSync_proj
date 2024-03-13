const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { responseHandler, responses } = require("../utils/responseHandler");
const Users = require("../models/Users");
const Appointments = require("../models/Appointments");

exports.search = async (req, res) => {
    try {
        const keyword = req.body.keyword.trim(); // Remove leading and trailing spaces
        const likeKeywordSearch = { $regex: new RegExp(keyword.split(' ').map(term => `.*${term}.*`).join('|'), 'i') };
        const searchResults = await Users.find({
            $or: [
                { firstName: likeKeywordSearch },
                { lastName: likeKeywordSearch },
                { department: likeKeywordSearch },
                { coursesAssigned: { $elemMatch: likeKeywordSearch } },
                { officeHours: { $elemMatch: likeKeywordSearch } },
            ],
            $and: [{
                $or: [
                    { role: 'TA' },
                    { role: 'Professor' }
                ]
            }]
        }, { password: 0 });

        responseHandler(res, {
            data: searchResults,
        });
    } catch (error) {
        responseHandler(res, { response: responses.serverError, error });
    }
}

exports.create = async (req, res) => {
    try {
        // req = appointee (teacher). date, description
        await Appointments.create({
            ...req.body,
            appointer: req.user.id
        })
        responseHandler(res);
    } catch (error) {
        responseHandler(res, { response: responses.serverError, error });
    }
}

exports.getAll = async (req, res) => {
    try {
        const id = req.user.id;
        const appointments = await Appointments.find({
            $or: [
                { appointee: id },
                { appointer: id }
            ]
        }).populate("appointee").populate("appointer")

        responseHandler(res, {
            data: appointments,
        });
    } catch (error) {
        responseHandler(res, { response: responses.serverError, error });
    }

}

exports.update = async (req, res) => {
    try {
        const { id, confirmed, cancelled, completed, dateTime, description } = req.body;
        const appointment = await Appointments.findById(id)
        console.log(appointment)
        if (!appointment) return responseHandler(res, { response: responses.notFound });
        await appointment.updateOne({
            confirmed: confirmed !== undefined ? confirmed ? 2 : 1 : appointment.confirmed,
            cancelled: cancelled || appointment.cancelled,
            completed: completed || appointment.completed,
            dateTime: dateTime || appointment.dateTime,
            description: description || appointment.description,
        })
        responseHandler(res);
    } catch (error) {
        responseHandler(res, { response: responses.serverError, error });
    }
}