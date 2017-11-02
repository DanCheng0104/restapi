'use strict'

const express = require('express');
const app = express();
const routes = require("./routes");
const jsonParser = require('body-parser').json;
const logger = require('morgan');

app.use(logger("dev"));
app.use(jsonParser());

'use strict';

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/qa");

const db = mongoose.connection;

db.on("error",function(err){
	console.error("connection error",err);
});

db.once("open",function(){
	console.log("connection succeed");
});

app.use(function(req,res,next){
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept-TYpe");
	if(req.method === "OPTIONS"){
		res.header("Access-Control-Allow-Methods","PUT,POST,DELETE");
		return res.status(200).json({});
	}
	next();
});
app.use("/questions",routes);

app.use(function(req, res, next){
	let err = new Error("not found");
	err.status = 404;
	next(err);
});
//our own error handler

app.use(function(err,req,res,next){
	res.status(err.status || 500);
	res.json({
		error: {
			message: err.message
		}
	})
});
const port= process.env.PORT || 3000;

app.listen(port,function(){
	console.log('server is set up')
});