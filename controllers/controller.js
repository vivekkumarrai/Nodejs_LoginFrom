
var db = require('./../configdb/db');
const multer = require('multer');
const bcrypt = require("bcrypt");
const { query } = require("express");
//const {JsonWebTokenError} = require('jsonwebtoken');
var jwt = require('jsonwebtoken');
// const body = require('express-validator');






// ******************* View All data ******************//

exports.viewdata = (req, res) => {
    db.query("Select *from user", (err,results) => {
        if(err){
            return console.error(err.message);
        }
        console.log(results);
        res.status(200).json({
            success: true,
            message: "Successfully View your data",
            data:results
        });
    });
}








   // ************** Delete *****************//

   exports.delete = (req, res) => {
    let sql = "DELETE FROM user WHERE id=" + req.params.id;
    db.query(sql, (err, results) => {
      if (err) return console.log(err.message);
      else
        res.status(200).json({
          success: true,
          message: "success",
          data: results,
        });
    });
  };


  


    //*****************Update ********************//
      
    exports.update = (req, res) => {
      let sql ="UPDATE user SET first_name='" +
        req.body.firstname +"', last_name='"+req.body.lastname+
        "', email='" +
        req.body.email +"', phone ='"+req.body.phone+
        "' WHERE id=" +
        req.params.id;
      db.query(sql, (err, results) => {
        if (err) console.log(err);
        else
          res.status(200).json({
            success: true,
            message: "success",
            data: results,
          });
      });
    };

  







// exports.createdata = (req,res) => {
//     let doc = { first_name:req.body.first_name, last_name:req.body.last_name,
//                   email:req.body.email, phone_number:req.body.phone_number ,
//                   password:req.body.password, profile_picture:req.body.profile_picture};               
            
//      let sql = "INSERT INTO user set ?";
//      dbConn.query(sql,doc, (err, results) => {
//          if(err)
//          {
//          return  console.log(err.message)
//          }
//          else
//          {
//            res.status(200).json({ 
//                success: true,
//                message:"SuccessFully Add Data",
//                data:doc
//            });
//          }

//      }); 



//**************** Register Start Here *********************//



exports.register = (req, res, next) => {

  first_name = req.body.first_name;
      last_name = req.body.last_name;
      phone = req.body.phone;
    email = req.body.email;
    password = req.body.password;
    confirmpassword = req.body.confirmpassword;
  
    // check unique email address
  
    var sql = "SELECT * FROM user WHERE email =?";
    db.query(sql, email, function (err, data, fields) {
      if (err) throw err;
      else if (data.length > 0) {
        res.status(400).json({
          success: false,
          message: "Data Already exist",
        });
        console.log("Data Already exist");
      } else if (confirmpassword != password) {
        res.status(400).json({
          success: false,
          message: "Password & Confirm Password is not Matched",
        });
        console.log("Password & Confirm Password is not Matched");
      } else {
        // save users data into database
  
        bcrypt.hash(password, 10, function (err, hash) {
          if (err) throw err;
          else
            var sql =
              "INSERT INTO user (first_name,last_name,phone,email,password) VALUES ?";
          var values = [[first_name, last_name, phone, email, hash]];
          var token =jwt.sign({_id:email},'qwertyuiop');
          console.log(token)
          db.query(sql, [values], function (err, data) {
            if (err) throw err;
            else {
              db.query(
                "SELECT * FROM user WHERE email = ?",
                [email],
                (err, results) => {
                  bcrypt.compare(password, results[0].password, (err, result) => {
                    if (!result) {
                      res.status(400).json({
                        status: false,
                        message: "Email and password does not match",
                        err: err,
                      });
                    } else {
                      res.status(200).json({
                        status: true,
                        message: "Successfully Login",
                        data: results,
                        token:token
                      });
                    }
                  });
                }
              );
            }
          });
        });
      }
    });


  };



  //**********************  Profile Picture Start here *************************//

  
  const storage = multer.diskStorage({
    destination:function(req, file, cb) {
        cb(null,"./uploads");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
  });
  var upload = multer({storage : storage}).single("profile_picture");
 exports.addData=(req, res)=> {
    //console.log("reg",req.headers)
    // if(!req.headers.authorization){
    //   res.json({
    //     status:false,
    //     message:"not Authorized"
    //   })
    // }
    upload(req, res, function(err){
        if(err)
        console.log(err.message);
        else
        {
            console.log("File uploaded");
            const id = req.body.id;
            const filePath = req.file.filename;
  
            var sql = "UPDATE user SET profile_picture = ? WHERE id = "+id
            var values = [[filePath]]
            db.query(sql ,[values],(err, results) => {
              if(err) 
              {
                console.log(err.message);
              res.status(400).json({
                status: "fails",
                err:err.message
              })}
              else{
                console.log("Data Successfully Uploaded")
  
                res.status(200).json({
                  status:"success",
                  data: results
                })
                
              }
             
            })
  
        }
    })
  }
  



//*****************    Login Start here *********************//


exports.login = (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    console.log(email, password);
  
    db.query("SELECT * FROM user WHERE email = ?", [email], (error, results) => {
      console.log(results.length);
      if (error) {
        res.json({
          status: false,
          message: "there are some error with query",
        });
      } else {
        console.log(results);
        if (results.length > 0) {
          bcrypt.compare(password, results[0].password, (err, result) => {
            if (!result) {
              res.status(400).json({
                status: false,
              
                message: "Email and password does not match",
                err: err,
              });
            } else {
              res.status(200).json({
                status: true,
                message: "Successfully Login",
                data: results,
              });
            }
          });
        } else {
          res.status(400).json({
            status: false,
            status:400,
            message: "Email does not exits",
          });
        }
      }
    });
  };












     
     
