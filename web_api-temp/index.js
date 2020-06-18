const express = require('express');
const asyncHandler = require('express-async-handler');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Temperatura = require('./db/db_temp.js');

mongoose.connect('mongodb://localhost:27017/temp_verde', { 'useNewUrlParser': true, 'useUnifiedTopology': true }, (err) => {
    if (err) {
        console.log('Error con la conexion de la base de datos');
    }
    else
        console.log('Conexion exitosa a la base de datos');
});

app.set('port', process.env.PORT || 5045);
app.set('json spaces', 2);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(app.get('port'), () => {
    console.log(`Server corriendo en el puerto ${app.get('port')}`);
});

app.get('/proy/temp', asyncHandler(async (req,res,next) => {
    res.send("HOLA A TODOS");
}));

app.post('/proyecto/agregarTemperatura', asyncHandler( async (req,res,next) => {
    console.log('Post /proyecto/agregarTemperatura');
    console.log(req.body);
    var tem = new Temperatura();

    tem.NoCo = await req.body.NoCo;
    tem.Temp = await req.body.Temp;

    tem.save((err, temp_save) => {
        if (err) 
            res.json({'R':500});
            
            res.status(200).send({tem: temp_save});
    });
}));

app.post('/proyecto/obtenerTemperatura', asyncHandler(async (req,res,next) => {
    var Tipo = req.body.Tipo;
    var FI = req.body.FI;
    var FF = req.body.FF;

        if(Tipo == "Completa") {
            Temperatura.find({}, "NoCo Temp", function(err, temp_save) {
                if(err) {
                    res.json({'R':500});
                }else{
                    res.json({'R':200, 'D':temp_save});
                }     
            });
        }
        else if(Tipo == "Rango") {
            Temperatura.find({Fecha:{
                $gte: new Date(FI),
                $lt: new Date(FF)
            }}, function(err, temp_save) {
                if(err) {
                    res.json({'R':500});
                }else{
                    res.json({'R':200, 'D':temp_save});
                }
            });
        }
        else{
            res.json({'R':400});
        }
}));