const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { responseHandler, responses } = require("../utils/responseHandler");
const Users = require("../models/Users");
const helpers = require("../utils/helpers")

exports.signup = async (req, res) => {
    try {
        const { email, password, firstName, lastName, role, program, batch, coursesAssigned, officeHours, department } = req.body;
        let user = await Users.findOne({ email });

        if (user) {
            return responseHandler(res, { response: responses.userExists });
        }

        let userDetails = { email, password: await bcrypt.hash(password, 5), firstName, lastName, role };

        if (role === 'Student' || role === 'TA') {
            userDetails = { ...userDetails, program, batch };
        }

        if (role === 'TA' || role === 'Professor') {
            // Split the coursesAssigned string into an array
            const coursesArray = coursesAssigned.split(',').map(course => course.trim());
            
            userDetails = { ...userDetails, coursesAssigned: coursesArray, officeHours, department };
        }

        await Users.create(userDetails);
        responseHandler(res);
    } catch (error) {
        responseHandler(res, { response: responses.serverError, error });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await Users.findOne({ email })
        if (!user) return responseHandler(res, { response: responses.userNotFound })
        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) return responseHandler(res, { response: responses.invalidPassword })
        const token = jwt.sign({ id: user._id, email, createdAt: new Date(), admin: user.admin }, process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRY });
        responseHandler(res, {
            data: { userDetails: { ...user.toObject(), password: undefined, jwt: undefined }, token }
        })
    } catch (error) {
        responseHandler(res, { response: responses.serverError, error })
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.user.email })
        const { firstName, lastName, coursesAssigned, officeHours, department } = req.body;
        user.firstName = firstName;
        user.lastName = lastName;
        user.coursesAssigned = coursesAssigned;
        user.officeHours = officeHours;
        user.department = department;
        await user.save();
        responseHandler(res);
    } catch (error) {
        responseHandler(res, { response: responses.serverError, error })
    }
}

exports.forgetPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await Users.findOne({ email })
        if (user) {
            const newPassword = helpers.generateAlphanumericPassword();
            await user.updateOne({ password: await bcrypt.hash(newPassword, 5) })
            await helpers.transporter.sendMail({
                from: 'hammad1029@gmail.com',
                to: user.email,
                subject: "Password Reset",
                text: `Dear ${user.firstName} ${user.lastName}, your new password is: ${newPassword}`
            });
        }
        responseHandler(res);
    } catch (error) {
        responseHandler(res, { response: responses.serverError, error });
    }
}

exports.changePassword = async (req, res) => {
    try {
        const { password, confirmPassword } = req.body
        if (password !== confirmPassword) responseHandler(res, { response: responses.invalidPassword });
        const user = await Users.findOne({ email: req.user.email })
        if (user) await user.updateOne({ password: await bcrypt.hash(password, 5) })
        responseHandler(res);
    } catch (error) {
        responseHandler(res, { response: responses.serverError, error });
    }
}