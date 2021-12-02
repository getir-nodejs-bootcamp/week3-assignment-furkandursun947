const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




// GET: show all products
app.get('/products', (req, res) => {
    axios({
        method: "GET",
        url: "http://localhost:8080/productsAPI",   
    }).then((data) => {
        res.status(200).json(data.data);    // all datas with a status code of 200
    }).catch((err) => {
        res.status(400).json({              
            title: 'not found, bad request',
            error: err
        })
    });
});

// GET: show one product
app.get('/products/:id', (req, res) => {
    axios({
        method: "GET",
        url: `http://localhost:8080/productsAPI/${req.params.id}`,   
    }).then((data) => {
        res.status(200).json(data.data);   // only one data with a status code of 200
    }).catch((err) => {
        res.status(400).json({
            title: 'product not exist, bad request',
            error: err
        })
    });
});


// POST: add a product
app.post('/products', (req, res) => {
    axios.post(`http://localhost:8080/productsAPI`, req.body)
        .then(response =>{
            res.status(201).send(response.data);
        }).catch((err) => {
            res.status(400).send(err);
        });
})


// PATCH: update a product, partial update
app.patch('/products/:id', (req, res) => {
    axios.patch(`http://localhost:8080/productsAPI/${req.params.id}`, req.body)
        .then(response =>{
            res.status(201).send(response.data);
        }).catch((err) => {
            res.status(400).send(err);
        });
})




// PUT: update a product completely, if the product is not exist; then it creates the product
app.put('/products/:id', (req, res) => {
    axios.put(`http://localhost:8080/productsAPI/${req.params.id}`, req.body)
        .then(response =>{
            res.status(201).send("updated");
        }).catch((err) => {
            res.status(400).send(err);
        });
})



app.delete('/products/:id', (req, res) => {
    axios.delete(`http://localhost:8080/productsAPI/${req.params.id}`)
    .then(response =>{
        res.status(200).send("Deleted");
    }).catch((err) => {
        res.status(400).send(err);
    });
})






module.exports = app;

