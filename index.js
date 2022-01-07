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
    const usersCollection = client.db("desco").collection("user");

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
            .limit(parseInt(limit))
            .toArray((err, items) => {
                res.send([...items]);
            });
    });

    app.post("/addUser", async (req, res) => {
        const user = req.body;
        const { email } = user;
        usersCollection.findOne({ email }, (err, data) => {
            if (email) {
                res.send.json({ msg: "user Already exist" });
            } else {
                usersCollection.insertOne(user).then((result) => {
                    if (result.insertedCount > 0) {
                        res.send(result.ops[0]);
                    }
                });
            }
        });
    });

    app.post("/update-bill/:id", async (req, res) => {
        try {
            const id = new ObjectId(req.params.id);
            const status = req.body;
            console.log(status);
            await billCollection.updateOne({ _id: id }, { $set: status });
            res.send({ message: "Update Successfully " });
        } catch (err) {
            res.send(err);
        }
    });


    app.get("/delete-billing/:id", async (req, res) => {
        const id = new ObjectId(req.params.id);
        console.log(id);
        const deleteService = await servicesCollection.deleteOne({ _id: id });
        console.log(deleteService);
        if (deleteService.deletedCount > 0) {
            res.send({ message: "Delete Successfully" });
        }
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
