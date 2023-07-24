var express = require('express');
var router = express();
const bcrypt = require("bcrypt");
const {check,validationResult} = require("express-validator");
const connection = require("../connection")


// Posting the products in the databse 
// The work will be done by admin 
router.post("/product",async (req,res)=>{

    const productName = req.body.productName;
    const price= req.body.price;
    const countInStock = req.body.countInStock;
    const product_description = req.body.product_description;

    const newProduct = {
        productName : productName,
        price : price,
        countInStock : countInStock,
        product_description : product_description 
    }



    try{

        connection.query('INSERT INTO products SET ?',newProduct,(error,result)=>{
            if (error) {
                return res.status(500).json({
                  errors: error
                });
              }
    
    
            else{
    
                newProduct.id = result.insertId;
                res.status(200).json(newProduct);
            }
        })

    }

    
    catch (error) {


        console.log(error)
        return res.status(500).json({
          errors:error
        })
      }

})

// Exporting
module.exports = router;