const express = require('express');
const router = express.Router()

 const controller = require('../controllers/controller');
 const validator = require('../controllers/validation')


 //********** View all data Api *************//
router.get('/viewdata',controller.viewdata);


// router.post('/createdata', controller.createdata);


//********** Login Api *************//
router.post('/login',validator.validatelogin,validator.checkValidationResult,controller.login);


//********** Register Api *************//
router.post('/register',validator.validateregister,validator.checkValidationResult,controller.register);


//********** Profile Api *************//
router.post('/profile',controller.addData);


//*******  Update Api ************//
 router.put('/update/:id', controller.update);


//******** Delete Api **********//
 router.delete('/delete/:id', controller.delete);


module.exports= router;