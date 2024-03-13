const Yup = require("yup");

exports.login = Yup.object({
  email: Yup.string().required(),
  password: Yup.string().required(),
}).required();

exports.signUp = Yup.object({
  email: Yup.string().required(),
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  password: Yup.string().min(8).required(),
  role: Yup.string().required(),
  program: Yup.string().when('role', {
    is: (role) => ['Student', 'TA'].includes(role),
    then: (schema) => schema.required(),
    otherwise: (schema) => schema
  }),
  batch: Yup.string().when('role', {
    is: (role) => ['Student', 'TA'].includes(role),
    then: (schema) => schema.required(),
    otherwise: (schema) => schema
  }),
  coursesAssigned: Yup.array().of(Yup.string()).when('role', {
    is: (role) => ['TA', 'Professor'].includes(role),
    then: (schema) => schema.required(),
    otherwise: (schema) => schema
  }),
  officeHours: Yup.array().of(Yup.string()).when('role', {
    is: (role) => ['TA', 'Professor'].includes(role),
    then: (schema) => schema.required(),
    otherwise: (schema) => schema
  }),
  department: Yup.string().when('role', {
    is: (role) => ['TA', 'Professor'].includes(role),
    then: (schema) => schema.required(),
    otherwise: (schema) => schema
  }),
}).required();

exports.updateProfile = Yup.object({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  coursesAssigned: Yup.array().of(Yup.string()).required(),
  officeHours: Yup.array().of(Yup.string()).required(),
  department: Yup.string().required(),
}).required()