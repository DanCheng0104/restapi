'use strict';

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/sandbox");

const db = mongoose.connection;

db.on("error",function(err){
	console.error("connection error",err);
});

db.once("open",function(){
	console.log("db connection is successful");
	const Schema = mongoose.Schema;
	//create a schema
	const animalSchema = new Schema({
		type: {type:String, default:"goldfish"},
		size: String,
		color: {type:String, default:"golden"},
		mass: {type:Number, default:0.007},
		name: {type:String, default:"angela"}
	});

	animalSchema.pre("save",function(next){
		if (this.mass >= 100){
			this.size = 'big';
		}else if (this.mass >= 5 && this.mass <100){
			this.size = 'medium';
		}else{
			this.size = 'small';
		}
		next();
	});

	animalSchema.statics.findSize = function(size,callback){
		//this == Animal
		return this.find({size: size},callback);
	}

	animalSchema.methods.findSameColor = function(callback){
		//this == document

		return this.model("Animal").find({color: this.color},callback)
	}
    //create a collection object
	const Animal = mongoose.model("Animal",animalSchema);
	//create a document
	const elephant = new Animal({
			type: "elephant",
			color:"gray",
			mass:6000,
			name:"lawrence"
	});
	const whale = new Animal({
			type: "whale",
			mass:190500,
			name:"fig"
	});
	const animal = new Animal({});
	const animalData = [
		{
			type: "mouse",
			color:"gray",
			mass:0.035,
			name:"Marvin"
		},
		{
			type: "nutria",
			color:"brown",
			mass:6.35,
			name:"Gretchen"
		},
		{
			type: "wolf",
			color:"grey",
			mass: 45,
			name:"Iris"
		},
		elephant,
		animal,
		whale
	];
	Animal.remove({},function(err){
		if (err) console.log("save failed", err);
		Animal.create(animalData,function(err,animals){
			if (err) console.log("save failed", err);
			Animal.findOne({type:"elephant"},function(err,elephant){
				//console.log(animals);
				elephant.findSameColor(function(err,animals){
					console.log(animals);
					if (err) console.log("find failed", err);
					animals.forEach(function(animal){
						console.log(`${animal.name} the ${animal.color}  ${animal.size}`)
					});
					db.close(function(){
						console.log('db connection is closed');
					});					
				})

			})
		})	
	});
    //save the document and collection in one action
    //save() is an async function



});