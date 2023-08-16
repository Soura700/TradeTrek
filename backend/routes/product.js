const Products = require("../models/Products");
const router = require("express").Router();
const path = require("path");
const multer = require("multer");
const Cart = require("../models/Cart");
const cron = require("node-cron");



// Create product
// router.post("/", async (req, res) => {
//   const newProduct = new Products(req.body);
//   try {
//     const savedProduct = await newProduct.save();
//     res.status(200).json(savedProduct);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/');
  },
  filename: function (req, file, cb) {
    console.log(file);
    // cb(null, Date.now() + path.extname(file.originalname));
    cb(null,file.originalname);
  }
});


const upload = multer({ storage: storage });


router.post("/",upload.single('img'), async (req, res) => {
  const imagePath = req.file.path;
  
  const newProduct = new Products({
    productname:req.body.productName,
    price:req.body.price,
    categories:req.body.categories,
    product_description:req.body.product_description,
    countInStock:req.body.countInStock,
    offerPrice:req.body.offerPrice, 
    img:imagePath,
  })

 
  
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});



// Get all products
router.get("/", async (req, res) => {
  try {
     'SELECT * FROM products'
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
});


//Get single product
router.get("/single/:id",async(req,res)=>{
  try{
    const singleProduct = await Products.findById(req.params.id);
    res.status(200).json(singleProduct);
  }catch(error){
    res.status(500).json(error);
  }
})

// Get product by name 
router.get("/singleProduct/:name",async(req,res)=>{
  try{
    const singleProduct = await Products.find({productname:req.params.name});
    res.status(200).json(singleProduct);
  }catch(error){
    res.status(500).json(error);
  }
})

router.get("/:categories",async (req,res)=>{
  const {categories} = req.params;
  try{
     const product = await Products.find({categories})
     res.status(200).json(product);
  }catch(error){
    console.log(error)
    res.status(500).json(error)
  }
})





// Get product by categories
router.get("/:categories",async (req,res)=>{
  const {categories} = req.params;
  try{
     const product = await Products.find({categories})
     res.status(200).json(product);
  }catch(error){
    console.log(error)
    res.status(500).json(error)
  }
})







// Update the product after the order successfull ...

// Here we will get the cart by the userId ... then in the cart we will we will lopp thorough each product (forEach loop) then it (loop) will take one product(id of the product) and will use query
// findById and then will deduct the countInStock with the quantity of the item inside the cart.
// and the whole thing will return a promises from multiple products that are present inside the cart.We will push the promises in an empty array named promises.At the end we will resolve them togather by
// PromiseAll(). 

// Use Promise.all(promises) to wait for all promises to resolve, ensuring that all products' countInStock are updated successfully.

router.put("/update", async (req, res) => {
  const { userId } = req.body;
  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(400).json({ message: "Cart not found" });
    }

    const productItems = cart.cartProducts;

    // Create an array of promises to handle the async operations
    const promises = [];

    productItems.forEach((item) => {
      const productId = item.product.toString();
      const orderedQuantity = item.quantity;

      promises.push(
        Products.findById(productId).then((product) => {
          if (!product) {
            throw new Error("Product not found");
          }

          const availableQuantity = product.countInStock;

          if (orderedQuantity <= availableQuantity) {
            // Deduct the ordered quantity from the available quantity
            product.countInStock -= orderedQuantity;

            // Save the updated product quantity to the database
            return product.save();
          } else {
            throw new Error("Not enough stock for the order");
          }
        })
      );
    });

    // Wait for all promises to resolve before sending the response
    Promise.all(promises)
      .then(() => {
        // Remove all cart products after processing the order
        cart.cartProducts = [];
        return cart.save();
      })
      .then(() => {
        return res.status(200).json({ message: "Product quantities updated " });
      })
      .catch((error) => {
        res.status(500).json({ message: error.message || "Internal server error" });
      });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});



// Update the product when the order  is cancelled...

// Here we will get the cart by the userId ... then in the cart we will we will lopp thorough each product (forEach loop) then it (loop) will take one product(id of the product) and will use query
// findById and then will deduct the countInStock with the quantity of the item inside the cart.
// and the whole thing will return a promises from multiple products that are present inside the cart.We will push the promises in an empty array named promises.At the end we will resolve them togather by
// PromiseAll(). 

// Use Promise.all(promises) to wait for all promises to resolve, ensuring that all products' countInStock are updated successfully.

// router.put("/update", async (req, res) => {
//   const { userId } = req.body;
//   try {
//     const cart = await Cart.findOne({ userId });

//     if (!cart) {
//       return res.status(400).json({ message: "Cart not found" });
//     }

//     const productItems = cart.cartProducts;

//     // Create an array of promises to handle the async operations
//     const promises = [];

//     productItems.forEach((item) => {
//       const productId = item.product.toString();
//       const orderedQuantity = item.quantity;

//       promises.push(
//         Products.findById(productId).then((product) => {
//           if (!product) {
//             throw new Error("Product not found");
//           }

//           const availableQuantity = product.countInStock;

//           if (orderedQuantity <= availableQuantity) {
//             // Deduct the ordered quantity from the available quantity
//             product.countInStock -= orderedQuantity;

//             // Save the updated product quantity to the database
//             return product.save();
//           } else {
//             throw new Error("Not enough stock for the order");
//           }
//         })
//       );
//     });

//     // Wait for all promises to resolve before sending the response
//     Promise.all(promises)
//       .then(() => {
//         // Remove all cart products after processing the order
//         cart.cartProducts = [];
//         return cart.save();
//       })
//       .then(() => {
//         return res.status(200).json({ message: "Product quantities updated " });
//       })
//       .catch((error) => {
//         res.status(500).json({ message: error.message || "Internal server error" });
//       });
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error" });
//   }
// });


  // Get product by nameor categories

  router.get('/get/autocomplete', async (req, res) => {
    try {
      const searchTerm = req.query.term;
      console.log( "Term" + searchTerm);
      const regex = new RegExp(searchTerm, 'i');  //i->case -sensitive , RegExp is object created by new 
  
      const products = await Products.find({ productname: regex }, { productname: 1 })


  
      res.status(200).json(products);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  
  // router.get('/autocomplete', async (req, res) => {
  //   try {
  //     // const searchTerm = req.params.term;
  //     const searchTerm = req.query.name;

  //     // const searchTerm1 = req.query;
  //     // console.log(searchTerm1)

  //     // const regex = new RegExp(searchTerm, 'i');
  //     console.log('Search term:', searchTerm);
  
  //     // const products = await Products.find({ productname: regex }, { productname: 1 })
  //     //   .limit(10)
  //     //   .exec();
  
  //     // console.log('Found products:', products);
  
  //     // res.status(200).json(products);
  //   } catch (error) {
  //     console.error('Error:', error);
  //     res.status(500).json({ error: 'Server error' });
  //   }
  // });

// Schedule the cron job to run every second
cron.schedule("* * * * * *", async () => {
  try {
    // Find and delete products with countInStock = 0
    const deletedProducts = await Products.deleteMany({ countInStock: 0 });
    if (deletedProducts.deletedCount > 0) {
      console.log(`${deletedProducts.deletedCount} products deleted.`);
    } else {
      console.log("No products to delete.");
    }
  } catch (error) {
    console.error("Error deleting products:", error);
  }
});

  

module.exports  = router;