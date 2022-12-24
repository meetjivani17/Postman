const path = require('path')
const express = require("express");
const mongoose = require("mongoose");
const CrudCollection = require("./crud")
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Helooo");
})

app.post("/mens", async (req, res) => {
    try {
        const addUser = new CrudCollection(req.body)
        console.log(req.body);
        const result = await addUser.save();
        res.status(201).send(req.body)
    } catch (error) {
        res.status(400).send(error);
    }
})

app.get("/mens", async (req, res) => {
    try {
        const result = await CrudCollection.find({});
        res.status(201).send(result)
    } catch (error) {
        res.status(400).send(error);
    }
})

app.get("/mens/:name", async (req, res) => {
    try {
        const name = req.params.name;
        const result = await CrudCollection.find({name:name});
        res.status(201).send(result)
    } catch (error) {
        res.status(400).send(error);
    }
})

// app.get("/mens/:id", async (req, res) => {
//     try {
//         const _id = req.params.id;
//         // console.log(_id);
//         const result = await CrudCollection.findById(_id);
//         res.status(201).send(result)
//     } catch (error) {
//         res.status(400).send(error);
//     }
// })

app.get("/sort", async (req, res) => {
    try {
        const result = await CrudCollection.find({}).sort({ name: 1 });
        res.status(201).send(result)
    } catch (error) {
        res.status(400).send(error);
    }
})

app.get("/mens/:perpage/:page", async (req, res) => {
    try {
        const perpage = Math.max(0, req.params.perpage);
        const page = Math.max(0, req.params.page) - 1;
        const result = await CrudCollection.find({}).limit(perpage).skip(perpage * page);
        res.status(400).send(result);
    } catch (error) {
        res.status(400).send(error);
    }
})

app.patch("/mens/:id", async (req, res) => {
    try {
        const _id = req.params.id;
        const result = await CrudCollection.findByIdAndUpdate(_id, req.body, {
            new: true
        })
        res.status(201).send(result)
    } catch (error) {
        res.status(500).send(error);
    }
})

app.delete("/mens/:id", async (req, res) => {
    try {
        const _id = req.params.id;
        const result = await CrudCollection.findByIdAndDelete(_id)
        res.status(201).send(result)
    } catch (error) {
        res.status(500).send(error);
    }
})

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const result = await CrudCollection.findOne({ email: email });
        const match = await bcrypt.compare(password, result.password);
        if (match) {
            res.send("login successful")
        }
        else {
            res.status(404).send("Invalid password")
        }
    } catch (error) {
        res.status(404).send("Invalid mail")
    }
})

app.listen(port, (req, res) => {
    console.log(`Connection is established on port no. ${port}`);
})

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/data").then(() => {
    console.log("Connection success");
}).catch((error) => {
    console.log(error);
})