// src/controllers/reportController.js
const { reportService, defectService, kpiService } = require('../services/reportService');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs').promises;

const reportController = {
    generateReport: async (req, res) => {
        try {
            const { type, format, startDate, endDate, includeCharts } = req.body;
            const userId = req.user.id;

            // Obtener los datos según el tipo de reporte
            let reportData = {};
            switch (type) {
                case 'defects':
                    reportData = await defectService.getAllDefects({
                        startDate,
                        endDate
                    });
                    break;
                case 'kpi':
                    reportData = {
                        dashboard: await kpiService.getDashboardData(),
                        pareto: await kpiService.getParetoAnalysis(),
                        controlChart: await kpiService.getControlChartData()
                    };
                    break;
                case 'summary':
                    reportData = {
                        defects: await defectService.getAllDefects({ startDate, endDate }),
                        kpis: await kpiService.getDashboardData()
                    };
                    break;
                default:
                    return res.status(400).json({ error: 'Tipo de reporte no válido' });
            }

            // Generar el reporte en el formato solicitado
            let reportPath;
            let reportBuffer;

            if (format === 'pdf') {
                reportBuffer = await generatePDFReport(type, reportData, { startDate, endDate, includeCharts });
                reportPath = path.join(__dirname, '../storage/reports', `report-${Date.now()}.pdf`);
            } else if (format === 'excel') {
                reportBuffer = await generateExcelReport(type, reportData, { startDate, endDate });
                reportPath = path.join(__dirname, '../storage/reports', `report-${Date.now()}.xlsx`);
            } else {
                return res.status(400).json({ error: 'Formato no soportado' });
            }

            // Guardar el archivo
            await fs.writeFile(reportPath, reportBuffer);

            // Registrar el reporte en la base de datos
            const report = await reportService.createReport({
                type,
                format,
                filePath: reportPath,
                userId,
                startDate,
                endDate
            });

            res.status(201).json({
                message: 'Reporte generado exitosamente',
                reportId: report.id
            });
        } catch (error) {
            console.error('Error al generar reporte:', error);
            res.status(500).json({ error: 'Error al generar el reporte' });
        }
    },

    getReportHistory: async (req, res) => {
        try {
            const { startDate, endDate, type } = req.query;
            const reports = await reportService.getReportHistory({
                startDate,
                endDate,
                type,
                userId: req.user.id
            });

            res.json(reports);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el historial de reportes' });
        }
    },

    getReportById: async (req, res) => {
        try {
            const report = await reportService.getReportById(req.params.id);
            if (!report) {
                return res.status(404).json({ error: 'Reporte no encontrado' });
            }

            res.json(report);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el reporte' });
        }
    },

    downloadReport: async (req, res) => {
        try {
            const report = await reportService.getReportById(req.params.id);
            if (!report) {
                return res.status(404).json({ error: 'Reporte no encontrado' });
            }

            const fileExists = await fs.access(report.filePath)
                .then(() => true)
                .catch(() => false);

            if (!fileExists) {
                return res.status(404).json({ error: 'Archivo no encontrado' });
            }

            const fileBuffer = await fs.readFile(report.filePath);
            const fileName = path.basename(report.filePath);

            res.setHeader('Content-Type', report.format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
            res.send(fileBuffer);
        } catch (error) {
            res.status(500).json({ error: 'Error al descargar el reporte' });
        }
    },

    deleteReport: async (req, res) => {
        try {
            const report = await reportService.getReportById(req.params.id);
            if (!report) {
                return res.status(404).json({ error: 'Reporte no encontrado' });
            }

            // Eliminar el archivo físico
            await fs.unlink(report.filePath);

            // Eliminar el registro de la base de datos
            await reportService.deleteReport(req.params.id);

            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar el reporte' });
        }
    }
};

// Funciones auxiliares para la generación de reportes
async function generatePDFReport(type, data, options) {
    const doc = new PDFDocument();
    const chunks = [];

    return new Promise((resolve, reject) => {
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Encabezado del reporte
        doc.fontSize(20).text(`Reporte de ${type.toUpperCase()}`, { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Fecha de generación: ${new Date().toLocaleDateString()}`);
        doc.moveDown();

        switch (type) {
            case 'defects':
                generateDefectsPDFContent(doc, data, options);
                break;
            case 'kpi':
                generateKPIPDFContent(doc, data, options);
                break;
            case 'summary':
                generateSummaryPDFContent(doc, data, options);
                break;
        }

        doc.end();
    });
}

async function generateExcelReport(type, data, options) {
    const workbook = new ExcelJS.Workbook();
    
    switch (type) {
        case 'defects':
            await generateDefectsExcelContent(workbook, data, options);
            break;
        case 'kpi':
            await generateKPIExcelContent(workbook, data, options);
            break;
        case 'summary':
            await generateSummaryExcelContent(workbook, data, options);
            break;
    }

    return workbook.xlsx.writeBuffer();
}

// Funciones auxiliares para generar contenido específico de los reportes
function generateDefectsPDFContent(doc, data, options) {
    doc.fontSize(16).text('Listado de Defectos');
    doc.moveDown();

    data.forEach((defect, index) => {
        doc.fontSize(12).text(`${index + 1}. ${defect.type}`);
        doc.fontSize(10)
            .text(`Proceso: ${defect.process}`)
            .text(`Fecha: ${new Date(defect.date).toLocaleDateString()}`)
            .text(`Descripción: ${defect.description || 'N/A'}`);
        doc.moveDown();
    });
}

async function generateDefectsExcelContent(workbook, data, options) {
    const sheet = workbook.addWorksheet('Defectos');

    sheet.columns = [
        { header: 'Tipo', key: 'type', width: 20 },
        { header: 'Proceso', key: 'process', width: 20 },
        { header: 'Fecha', key: 'date', width: 15 },
        { header: 'Descripción', key: 'description', width: 30 }
    ];

    data.forEach(defect => {
        sheet.addRow({
            type: defect.type,
            process: defect.process,
            date: new Date(defect.date).toLocaleDateString(),
            description: defect.description || 'N/A'
        });
    });
}

module.exports = reportController;