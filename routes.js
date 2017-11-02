'use strict'

const express = require('express');
const router = express.Router();
const Question = require("./models").Question;

router.param("qid",function(req,res,next,id){
	Question.findById(id,function(err,doc){
		if(err) return next(err);
		if(!doc){
			err = new Error("Not Found");
			err.status = 404;
			return next(err);
		}
		req.question = doc;
		return next();
	});
});

router.param("aid",function(req,res,next,id){
	req.answer = req.question.answers.id(id);
	if(!req.answer ){
		const err = new Error("Not Found");
		err.status = 404;
		return next(err);
	}
	return next();
});
//return all the questions
router.get('/',function(req,res,next){
	Question.find({})
				.sort({createdAt: -1})
				.exec(function(err,questions){
					if (err) return next(err);
					res.json(questions);
				});
});

router.post('/',function(req,res,next){
	const question = new Question(req.body);
	console.log(req.body)
	question.save(function(err,question){
		if(err) return next(err);
		res.status(201);
		res.json(question);
	})
});

router.get('/:qid',function(req,res,next){
	res.json(req.question);
});


router.post('/:qid/answers',function(req,res,next){
	req.question.answers.push(req.body);
	req.question.save(function(err,question){
		if(err) return next(err);
		res.status(201);
		res.json(question);
	});
});

router.put('/:qid/answers/:aid',function(req,res){
	req.answer.update(req.body,function(err,result){
		if(err) return next(err);
		res.json(result);
	});
});

router.put('/:qid',function(req,res){
	req.question.update(req.body,function(err,result){
		if(err) return next(err);
		res.json(result);
	});
});

router.delete('/:qid/answers/:aid',function(req,res){
	req.answer.remove(function(err){
		req.question.save(function(err,question){
			console.log(err);
			if(err) return next(err);
			res.json(question);
		});
	});
});

router.post('/:qid/answers/:aid/vote-:dir',function(req,res,next){
		console.log('dir' + req.params.dir);
		if (req.params.dir.search(/^(up|down)$/)===-1){
			const err = new Error("not found");
			err.status = 404;
			next(err);
		}
		else {
			req.vote = req.params.dir;
			next();
		}

	},function(req,res,next){
		req.answer.vote(req.vote, function(err,question){
			if(err) return next(err);
			res.json(question);
		})

});
module.exports = router;