const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 2050;

const app = express()
app.use(cors());
app.use(bodyParser.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hhrsq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    console.log('connect err', err);
    const productCollection = client.db("shopBD").collection("products");
    const ordersCollection = client.db("shopBD").collection("orders");
    console.log('Database connected');

    app.post('/addProduct', (req, res) => {
        const newProduct = req.body;
        productCollection.insertOne(newProduct)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/products', (req, res) => {
        productCollection.find()
            .toArray((err, items) => {
                res.send(items);
            })
    })

    app.get('/product/:id', (req, res) => {
        const sProduct = req.params.id;
        // console.log('sProduct', sProduct);
        productCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                // console.log('documents', documents);
                res.send(documents[0]);
            })
    })

    app.delete('/delete/:id', (req, res) => {
        // console.log(req.params.id);
        productCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                console.log('delete', result);
            })
    })


    // order collection api
    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
            .then(result => {
                console.log('inserted count', result);
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/orders', (req, res) => {
        console.log('query', req.query.email);
        ordersCollection.find({ email: req.query.email })
            .toArray((err, items) => {
                res.send(items);
            })
    })

});



app.get('/', (req, res) => {
    res.send('Hello Apu Fouzder!')
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})