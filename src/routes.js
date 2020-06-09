global.file = "grades.json";
const express = require("express");
const routes = express.Router();
const Grades = require('./controller/GradesController');

const gradesController = new Grades();

routes.get("/grades", gradesController.index);
routes.post("/grades", gradesController.create);
routes.put("/grades/:id", gradesController.update);
routes.delete("/grades/:id", gradesController.delete);
routes.get("/grades/:id", gradesController.findOne);
routes.get("/grades/:student/:subject", gradesController.gradeStudent);
routes.get("/grades-media/:subject/:type", gradesController.gradeMedia);
routes.get("/grades-top/:subject/:type", gradesController.treeBestGrade);

module.exports = routes;
