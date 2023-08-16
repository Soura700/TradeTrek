var express = require('express');
var router = express();
const bcrypt = require("bcrypt");
const {check,validationResult} = require("express-validator");
const connection = require("../connection")

// connection is an instance of the database connection that you should establish using the database library. This connection is used to interact with the database server.

// .query is a method provided by the database library to send SQL queries to the database server. It takes two main arguments:


// Posting the products in the databse 
// The work will be done by admin 
router.post("/create",async (req,res)=>{

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

// Get all products
router.get("/getProducts", async (req, res) => {
  try {
    connection.query('SELECT * FROM products' , (error,result)=>{
      if(error){
        res.status(500).json(error)
      }
      else{

        const productsWithImages = result.map(product => {
          const imagesArray = JSON.parse(product.images);
          return {
            ...product,
            images: imagesArray // Replace 'images' field with the parsed array
          };
        });

        res.status(200).json(productsWithImages)
      }
    });
  } catch (error) {
    res.status(500).json(error);
  }
});



// Get Products by id
//Get single product

router.get("/singleProduct/:id",async(req,res)=>{
  try{
    
    const id = req.params.id;

    console.log(id)

    connection.query(' SELECT * from products where p_id = ?  ' , id  , (error,result) =>{
      if(error){
        res.status(500).json(error);
      }
      else{
        res.status(200).json(result)
      }
    })
  }catch(error){
    res.status(500).json(error);
  }
})

// Get Product by Categories

router.get("/:categories",async (req,res)=>{
  const {categories} = req.params;
  try{
    

    console.log(categories)

    connection.query(' SELECT * from products where categories = ?  ' , categories  , (error,result) =>{
      if(error){
        res.status(500).json(error);
      }
      else{
        res.status(200).json(result)
      }
    })
  }catch(error){
    res.status(500).json(error);
  }
})



// Exporting
module.exports = router;