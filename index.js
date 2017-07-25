'use strict';

const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const shell = require('node-powershell');
const config = require('./config.json');


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/add', function (req, res) {
    //fs.writeFile('D:\\work\\test.txt', req.body.text, function(err) {
    fs.writeFile(config.path + '\\' + req.body.fileName, req.body.text, function(err) {
        if(err) {
            res.send(err.message)
        }

        res.send('Файл добавлен');
        /*saveBackup(req.body.backup)
            .then(result => {
               res.send(result + '. ' + 'Файл сохранён.');
            })
            .catch(err => {
                res.send(err);
            });*/
    });
});

app.post('/restart', function (req, res) {
    let ps = new shell({
        executionPolicy: 'Bypass',
    });

    //ps.addCommand('Set-Location -Path D:\\work\\excel-parser');
    //ps.addCommand('Get-Location');
    ps.addCommand(req.body.command);

    ps.invoke()
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            res.send(err.message)
            ps.dispose();
        });

    ps.on('output', result => {
        console.log(result);
    });
});


function saveBackup(text) {
    return new Promise( function(resolve, reject){
        fs.writeFile('backup.txt', text, function(err) {
            if(err) {
                reject(err.message);
            }

            resolve('Backup сохранён');
        });
    });
}


app.listen(3000, function () {
    console.log('listening on port 3000');
});