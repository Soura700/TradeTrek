var express = require('express');
var router = express();
const bcrypt = require("bcrypt");
const connection = require("../connection")



router.post("/add-to-cart", (req, res) => {

    const user_id = req.body.user_id;
    const product_id = req.body.product_id;
    const cartItemCount = req.body.cartItemCount;
    const totalPrice = req.body.totalPrice;

    const newCart = {
        user_id:user_id,
        product_id:product_id,
        cartItemCount:cartItemCount,
        totalPrice:totalPrice
    }

    try {
        
        connection.query('INSERT INTO carts SET ?', newCart,
            (err, res) => {
                if (err) {
                    res.status(500).json(err)
                } else {
                    res.status(200).json(res)
                }
            }
        )
    }catch(error){
        console.log(error)
        res.status(500).json(error)
    }
})


// Exporting
module.exports = router;