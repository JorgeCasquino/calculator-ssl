const userService = require('./userService');
const defectService = require('./defectService');
const kpiService = require('./kpiService');
const reportService = require('./reportService');
const uploadService = require('./uploadService');

// Exportar todos los servicios
module.exports = {
    userService,
    defectService,
    kpiService,
    reportService,
    uploadService
};