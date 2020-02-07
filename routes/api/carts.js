const express = require("express");
const router = express.Router();
const uuid = require("uuid/v4");
const app = express();
// Stripe Middleware:
const stripe = require("stripe")("sk_test_0XQb2SgTnVlKehrZ1FDP8lcA00yFcgaoDL");

app.use(require("body-parser").text());



//*NOTE* This wipes all carts from DB every X time:
// router.get("/killCarts", (req, res) => {
//     collection.drop().then(console.log("Cart Collections DELETED!"))
//     .catch(console.log("Failed to drop Cart Collection..."))
// })

// cart Model:
const Cart = require("../../models/Cart");

// Test
router.get('/test', (req, res) => res.json({ success: 'Cart API Works!' }));

// @ desc    Kill Bcakend Session:
// @ route    GET api/carts/kill
// @ access   Public
router.get("/kill", (req, res) => {
    // console.log("Current Session ID: ", req.session.cart_id)
    // Check for session first:
    if(req.session){
        req.session.destroy()
            // console.log("BACKEND SESSION ENDING")
            console.log("Backend Session Removed!")
            // wipeCollection()
        }else{
            return res.status(404).json({ message: "No Backend Session"});
    }
})

// @ desc    Get most recent cart Get most recent cart by Session:
// @ route    GET api/carts
// @ access   Public
router.get("/", (req, res) => {
    // Check for session first:
    // console.log("HITTING HERE IN GRAB RECENT CART REQ.session", req.session.cart_id)
    if(req.session.cart_id){
        let cartID = req.session.cart_id;
        // console.log("CART ID IN SESSION, CartID: ", cartID)
        Cart.findById(cartID)
        .then(cart =>  res.status(200).json({ message: "success", data: cart.products }))
        .catch(err => res.status(404).json({ message: 'Error', error: err }));
    }else{
        return res.status(404).json({ message: "Cart Is Empty"});
    }
});

// @ desc    Create A New cart
// @ route    POST api/carts
// @ access   Public
router.post("/", (req, res) => {
    // Check if cartID is in session, if so, then push product into already created cart:
    if (req.session.cart_id) {
        // console.log("Hitting session", req.body)
        const { price, itemID, name, _id, quantity, total, desiredQuantity, description, image, qtySold } = req.body;
        Cart.findById(req.session.cart_id)
            .then(cart => {
                const newProduct = {
                    itemID: itemID,
                    desiredQuantity: desiredQuantity,
                    name: name,
                    price: price,
                    total: total,
                    quantity: quantity,
                    description,
                    image,
                    qtySold
                }
                // Add to products array:
                cart.products.push(newProduct);

                // Save
                cart.save().then(cart => res.json(cart))
                    .catch(err => res.status(404).json({ message: 'Error', data: 'Could Not Save' }));
            });
        // Return statement below to stop the condition:
        return
    } else { // Else, cart doesnt exist, create new cart and populate its first products array with inputted product info:
        // const { price, _id, name, quantity, total, desiredQuantity } = req.body.products[0]
        const { price, _id, itemID, name, quantity, total, desiredQuantity, description, image, qtySold } = req.body
        // CreateCart:

        const newCart = new Cart({
            products: [
                {
                    itemID: itemID,
                    desiredQuantity: desiredQuantity,
                    name: name,
                    price: price,
                    total: total,
                    quantity: quantity,
                    description,
                    image,
                    qtySold
                }
            ],

        });
        // SaveCart to DB:
        newCart.save().then(cart => res.status(200).json({ message: "success", data: cart }))
            .catch(err => res.status(400).json({ message: "Error", error: err }))

        // Store cart ID inside of session:
        req.session.cart_id = newCart._id
        console.log("New Cart Session Created :", req.session.cart_id)
    }
});





// @ route    POST api/carts/charge
// @ desc     Confirm Purchase With Stripe:
// @ access   Public
// router.post("/charge", async (req, res) => {
//     try {
//       let {status} = await stripe.charges.create({
//         amount: 200,
//         currency: "usd",
//         description: "An example charge2",
//         source: req.body
//       });
  
//       res.json({status});
//     } catch (err) {
//       console.log(err);
//       res.status(500).end();
//     }
//   });




// @ route    POST api/carts/checkout
// @ desc     Confirm Purchase With Stripe:
// @ access   Public
router.post("/checkout", async (req, res) => {
    // console.log("Request req.body:", req.body);
  
    let error;
    let status;
    try {
      const { products, token, grandTotal, productsCount } = req.body;

    //   console.log("test1 products", products)
    //   console.log("test2 total", grandTotal)
    //   console.log("test2 token", token)
  
      const customer = await stripe.customers.create({
        email: token.email,
        source: token.id
      });
  
      // ******NOTE*****  Put address and possibly card info below ex: "token.card.adress_line1", etc.. into session and store/save under Create Orders Component

      const idempotency_key = uuid();
      const charge = await stripe.charges.create(
        {
          amount: grandTotal * 100,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: `Purchased ${productsCount} Assorted Item/items`,
          shipping: {
            name: token.card.name,
            address: {
              line1: token.card.address_line1,
              line2: token.card.address_line2,
              city: token.card.address_city,
              country: token.card.address_country,
              postal_code: token.card.address_zip,
            }
          }
        },
        {
          idempotency_key
        }
      );
    //   console.log("Charge:", { charge });
      status = "success";




      // Put address and billing info into session:
      addressInfo = charge.billing_details.address
    //   console.log("TEST HERE address:" , addressInfo)
      req.session.city = addressInfo.city;
      req.session.country = addressInfo.country;
      req.session.address1 = addressInfo.line1;
      req.session.address2 = addressInfo.line2;
      req.session.zipCode = addressInfo.postal_code;
      req.session.state = addressInfo.state;
      req.session.firstName = charge.billing_details.name.split(" ")[0];
      req.session.lastName = charge.billing_details.name.split(" ")[1];
      req.session.email = charge.receipt_email
      req.session.grandTotal = grandTotal;
    //   console.log("REQ.SESSION: ", req.session)
        // console.log("New Cart Session Created :", req.session.cart_id)




    } catch (error) {
      console.error("Error:", error);
      status = "failure";
    }
  
    res.json({ error, status });
  });




// @ route    POST api/carts/:id
// @ desc     Delete Cart by ID:
// @ access   Public
router.delete("/:id", (req, res) => {
    Cart.findById(req.params.id)
        .then(cart => cart.remove().then(() => res.status(200).json({ message: "Successfully Removed Cart!" })))
        .catch(err => res.status(404).json({ message: "Error", error: err }))
})

// @ route    POST api/carts/delete/:itemID
// @ desc    Delete a product within the cart:
// @ access   Public
router.delete("/delete/:itemID", (req, res) => {
    // console.log("TEST HER EIN BACKEND ", req.params.itemID)
    Cart.findById(req.session.cart_id)
        .then(cart => {
            // Check to see if product with ID
            if (cart.products.filter(product => product.itemID.toString() === req.params.itemID).length === 0) {
                return res.status(404).json({ message: "Error", data: 'Item does not exist' });
            }

            // Get remove index
            const removeIndex = cart.products
                .map(product => product._id.toString())
                .indexOf(req.params.itemID);

            // Splice product/item out of array
            cart.products.splice(removeIndex, 1);

            // Save cart:
            cart.save().then(cart => res.status(200).json({message: "Item Successfully Removed", data: cart}))
        })
        .catch(err => res.status(404).json({ message: 'Error', error: err }));
    }
);

// @ route    GET api/carts/ID
// @ desc    Show one cart by ID
// @ access   Private
router.get("/:id", (req, res) => {
    Cart.findById(req.params.id, (err, cart) => {
        if (err) {
            return res.json({ message: "Error", error: "I.D. doesn't exist..." });
        }
        else {
            // extra check as sometimes cart will send a success with null data as cart:
            if (cart === null) {
                return res.json({ message: "Error", error: "I.D. doesn't exist..." });
            }
            return res.json({ message: "Success", data: cart });
        }
    });
});

module.exports = router;