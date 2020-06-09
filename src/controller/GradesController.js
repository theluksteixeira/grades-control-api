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

    async treeBestGrade(req, res) {
        const { subject, type } = req.params;

        const Grade = new GradesController();
        let arrayGrades = await Grade.loadFile();

        const filterGrade = arrayGrades.grades.filter((grade) => {
            return grade.subject == subject && grade.type == type;
        });

        const topGrade = filterGrade.sort((a, b) => {
            return b.value - a.value;
        });

        return res.json(topGrade.splice(0, 3));
    }

    async gradeMedia(req, res) {
        const { subject, type } = req.params;

        const Grade = new GradesController();
        let arrayGrades = await Grade.loadFile();

        const filterGrade = arrayGrades.grades.filter((grade) => {
            return grade.subject == subject && grade.type == type;
        });

        const totalGrade = filterGrade.reduce((accumulator, grade) => {
            return accumulator + grade.value;
        }, 0);

        const media = totalGrade / filterGrade.length;

        return res.json({ msg: `Média das notas: ${media} pontos.` });
    }

    async gradeStudent(req, res) {
        const { student, subject } = req.params;

        const Grade = new GradesController();
        let arrayGrades = await Grade.loadFile();

        const filterGrade = arrayGrades.grades.filter((grade) => {
            return grade.student == student && grade.subject == subject;
        });

        const totalGrade = filterGrade.reduce((accumulator, grade) => {
            return accumulator + grade.value;
        }, 0);

        return res.json({ msg: `Nota total: ${totalGrade} pontos.` });
    }

    async findOne(req, res) {
        const { id } = req.params;

        const Grade = new GradesController();
        let arrayGrades = await Grade.loadFile();

        const indexGrade = await arrayGrades.grades.findIndex(
            (grade) => grade.id == id
        );

        if (indexGrade === -1) {
            return res.status(400).json({ error: "Id não encontrado." });
        }

        return res.json(arrayGrades.grades[indexGrade]);
    }

    async delete(req, res) {
        const { id } = req.params;

        const Grade = new GradesController();
        let arrayGrades = await Grade.loadFile();

        const indexGrade = await arrayGrades.grades.findIndex(
            (grade) => grade.id == id
        );

        if (indexGrade === -1) {
            return res.status(400).json({ error: "Id não encontrado." });
        }

        arrayGrades.grades.splice(indexGrade, 1);

        try {
            await fs.writeFile(global.file, JSON.stringify(arrayGrades));
        } catch (err) {
            res.status(400).json({ error: err });
        }

        return res.json({ msg: "Removido com sucesso." });
    }

    async update(req, res) {
        const { id } = req.params;
        const { student, subject, type, value } = req.body;

        const Grade = new GradesController();
        let arrayGrades = await Grade.loadFile();

        const indexGrade = await arrayGrades.grades.findIndex(
            (grade) => grade.id == id
        );

        if (indexGrade === -1) {
            return res.status(400).json({ error: "Id não encontrado." });
        }

        arrayGrades.grades[indexGrade] = {
            id,
            student,
            subject,
            type,
            value,
            timestamp: new Date(),
        };

        try {
            await fs.writeFile(global.file, JSON.stringify(arrayGrades));
        } catch (err) {
            res.status(400).json({ error: err });
        }

        return res.json(arrayGrades.grades[indexGrade]);
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
