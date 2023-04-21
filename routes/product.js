const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

// Add product api

router.post('/add',auth.authenticateToken,checkRole.checkRole,(req,res) => {
    let product = req.body;
    var query = "insert into product (name,categoryId,description,price,status) values(?,?,?,?,'true')";
    connection.query(query,[product.name,product.categoryId,product.description,product.price],(err,results) => {
        if(!err){
            return res.status(200).json({message: "Product Addedd Successfully"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})

// get all product api

router.get('/get',auth.authenticateToken,(req,res,next) => {
    var query = "select p.id,p.name,p.description,p.price,p.status,c.id as categoryId,c.name as categoryName from product as p INNER JOIN category as c where p.categoryId = c.id";
    connection.query(query,(err,results) => {
        if(!err){
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
})

// on the basis of category we are going to get api by passing category id

router.get('/getByCategory/:id',auth.authenticateToken,(req,res,next) => {
    const id = req.params.id;
    var query = "select id,name from product where categoryId= ? and status= 'true'";
    connection.query(query,[id],(err,results) => {
        if(!err)
        {
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
})


// getting single product by id api

router.get('/getById/:id',auth.authenticateToken,(req,res,next) => {
    const id = req.params.id;
    var query = "select id,name,description,price from product where id = ?";
    connection.query(query,[id],(err,results) => {
        if(!err){
            return res.status(200).json(results[0]); //because we need only one record so it should be in the form of array
        }
        else{
            return res.status(500).json(err);
        }
    })
})

//  update product api

router.patch('/update',auth.authenticateToken,checkRole.checkRole,(req,res,next) => {
    let product = req.body;
    var query = "update product set name=?,categoryId=?,description=?,price=? where id=?";
    connection.query(query,[product.name,product.categoryId,product.description,product.price,product.id],(err,results) => {
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message: "Product id not found"});
            }
            return res.status(200).json({message: "Product Updated Successfully"});
        }
        else{
            return res.status(500).json(err);

        }

    })
})

// delete product api

router.delete('/delete/:id',auth.authenticateToken,checkRole.checkRole,(req,res,next) => {
    const id = req.params.id;
    var query = "delete from product where id=?";
    connection.query(query,[id],(err,results) => {
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message: "Product id not found"});
            }
            return res.status(200).json({message: "Product Deleted Successfully"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})

// change status api

router.patch('/updateStatus',auth.authenticateToken,checkRole.checkRole,(req,res,next) => {
    let user = req.body;
    query = "update product set status=? where id=?";
    connection.query(query,[user.status,user.id],(err,results) => {
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message: "Product id not found"});
            }
            return res.status(200).json({message: "Product Status Updated successfully"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})

module.exports = router;