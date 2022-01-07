const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
require("dotenv").config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

const uri =
    "mongodb+srv://Soldiers:Soldiers1234@cluster0.ylija.mongodb.net/desco?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

client.connect((err) => {
    console.log("Error is:", err);
    console.log("Database connected Successfully");

    // admin
    const billCollection = client.db("desco").collection("bill");

    app.post("/add-billing", (req, res) => {
        const addBill = req.body;
        console.log(addBill);
        billCollection.insertOne(addBill).then((result) => {
            console.log("inserted count", result);
            res.send(result.insertedCount > 0);
        });
    });

    app.get("/get-bill/:limit", (req, res) => {
        const { limit } = req.params;
        billCollection
            .find()
            .limit(limit)
            .toArray((err, items) => {
                res.send([...items]);
            });
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
