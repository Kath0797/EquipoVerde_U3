const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TempSchema = Schema({
    NoCo: String,
    Temp: String,
    Fecha: {type: Date, default: Date()}
});

module.exports = mongoose.model('temper', TempSchema);