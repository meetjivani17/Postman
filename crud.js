const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const NewSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true,
        trim: true,
        minlength:10
    },
    phone: {
        type : Number,
        min:1000000000,
        max:9999999999,
        required : true,
    },
    email: {
        type : String,
        required : true,
        unique:[true,"Email already exist"],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email")
            }
        }
    },
    password: {
        type: String,
        required : true
    }
})

NewSchema.pre("save", async function(next){
        if (this.isModified("password" || this.isModified("email"))) {
            // this.email = await bcrypt.hash(this.email,10);
            this.password = await bcrypt.hash(this.password,10);
        }
        next();
})

const CrudCollection = new mongoose.model("CrudCollection",NewSchema)

module.exports = CrudCollection;