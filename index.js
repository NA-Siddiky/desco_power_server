const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ylija.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

client.connect(err => {

    console.log("Error is:", err)
    console.log("Database connected Successfully")

    // admin 
    const adminsCollection = client.db("tech-soldiers").collection("admin");


});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});