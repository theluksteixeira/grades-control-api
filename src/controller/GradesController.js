const express = require("express");
const fs = require("fs").promises;

class GradesController {
    async loadFile() {
        try {
            const gradeBinario = await fs.readFile(global.file, "utf-8");
            return JSON.parse(gradeBinario);
        } catch (err) {
            return `Erro ao ler o arquivo: ${err}`;
        }
    }

    async index(req, res) {
        const Grade = new GradesController();
        const arrayGrades = await Grade.loadFile();
        return res.json(arrayGrades);
    }

    async create(req, res) {
        const Grade = new GradesController();
        let arrayGrades = await Grade.loadFile();

        const { student, subject, type, value } = req.body;

        const newGrade = {
            id: arrayGrades.nextId,
            student,
            subject,
            type,
            value,
            timestamp: new Date(),
        };

        arrayGrades.nextId++;
        arrayGrades.grades.push(newGrade);

        try {
            await fs.writeFile(global.file, JSON.stringify(arrayGrades));
        } catch (err) {
            res.status(400).json({ error: err });
        }

        return res.json(newGrade);
    }
}

module.exports = GradesController;
