global.file = "grades.json";
const express = require("express");
const routes = express.Router();
const Grades = require('./controller/GradesController');

const gradesController = new Grades();

routes.get("/grades", gradesController.index);
routes.post("/grades", gradesController.create);

module.exports = routes;
