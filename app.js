const path = require('path')
const express = require("express");
const mongoose = require("mongoose");
const CrudCollection = require("./crud")

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/",(req,res)=>{
    res.send("Helooo");
})

app.post("/mens", async (req,res)=>{
    try {
        const addUser = new CrudCollection(req.body)
        console.log(req.body);
        const result = await addUser.save();
        res.status(201).send(req.body)
    } catch (error) {
        res.status(400).send(error);
    }
})

app.get("/mens", async (req,res)=>{
    try {
        const result = await CrudCollection.find({});
        res.status(201).send(result)
    } catch (error) {
        res.status(400).send(error);
    }
})

app.get("/mens/:id", async (req,res)=>{
    try {
        const _id = req.params.id;
        // console.log(_id);
        const result = await CrudCollection.findById(_id);
        res.status(201).send(result)
    } catch (error) {
        res.status(400).send(error);
    }
})

app.patch("/mens/:id", async (req,res)=>{
    try {
        const _id = req.params.id;
        const result = await CrudCollection.findByIdAndUpdate(_id,req.body,{
            new : true
        })
        res.status(201).send(result)
    } catch (error) {
        res.status(500).send(error);
    }
})

app.delete("/mens/:id", async (req,res)=>{
    try {
        const _id = req.params.id;
        const result = await CrudCollection.findByIdAndDelete(_id)
        res.status(201).send(result)
    } catch (error) {
        res.status(500).send(error);
    }
})

app.listen(port, (req,res)=>{
    console.log(`Connection is established on port no. ${port}`);
})

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/data").then(()=>{
    console.log("Connection success");
}).catch((error)=>{
    console.log(error);
})