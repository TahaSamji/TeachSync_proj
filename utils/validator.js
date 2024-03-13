const jwt = require("jsonwebtoken");
const { responseHandler, responses } = require("../utils/responseHandler");

exports.roles = {
    unauthorized: 0,
    authorized: 1,
    admin: 2
}

exports.validator = (controller = () => { }, authorized = this.roles.unauthorized, schema = false) => async (req, res) => {
    try {
        if (authorized === this.roles.authorized || authorized === this.roles.admin) {
            try {
                const token = req.headers.authorization;
                if (!token) throw new Error();
                const user = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET)
                if (authorized === this.roles.admin && !user.admin) throw new Error();
                req.user = user;
            } catch (e) {
                return responseHandler(res, { response: responses.unauthorized })
            }
        }
        controller(req, res);
    } catch (error) {
        responseHandler(res, { response: responses.serverError, error })
    }
}