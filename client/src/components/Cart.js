import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import {
    Container, Table, ListGroup, Button, Form, FormGroup, Label, Input, Row, Col, Alert, ModalFooter, Modal, ModalHeader, ModalBody
} from "reactstrap";

import { CSSTransition, TransitionGroup } from "react-transition-group";
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import Spinner from "./common/Spinner";
import Axios from "axios";
import { deleteItem } from "../actions/itemActions";
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CheckoutReact from "./CheckoutReact";

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            grandTotal: "",
            products: [],
            total: "",
            desiredQuantity: "",
            orderID: "",
            itemID: "",
            name: "",
            quantity: "",
            price: "",
            firstNameError: "",
            lastNameError: "",
            emailError: "",
            addressError: "",
            cityError: "",
            stateError: "",
            zipCodeError: "",
            cardError: "",
            securityCodeError: "",
            expirtationError: "",
            productsError: "",
            qtySold: "",
            orderDetails: [],
            orderValid: false,
            paidInfull: false
        }
    }

    async checkStatusPurchase(){
        await console.log("TEST PIAD IN FULL?", this.state.paidInFull)
        if(this.state.paidInFull === true){
            console.log("MY PONCHO ASS HOLE")
            await this.purchaseOnSubmit()
            // this.refreshPage()
        }
    }
    componentDidMount() {
        // this.killSession()
        // console.log("tEST lOCAL STORAGE OF STATUS: ", localStorage.getItem('status'))
        // *note* If STRIPE PAYMENT WAS A SUCCESS, THEN DO FINAL PURCHASE FUNCTIONALITY AND CREATING OF ORDER: THEN/ELSE HIT DB FOR ALL CARTS/ITEMS IN CART:
        let newStatus = localStorage.getItem('status');
        if(newStatus === undefined || newStatus === null) {newStatus = ""}
        // console.log("HERE TEST LOCAL STORAGE:", newStatus)
        if(newStatus.toString() === "success") {
            this.toggle()
            // this.setState({paidInFull: true})
           
            // Sent through Creat order to the backend:

            
              toast("Success! Check email for details", { type: "success" });
        }
            else {
                toast("Something went wrong", { type: "error" });
              }
        
        Axios.get("/api/carts")
            .then(res => {
                let currData = res.data.data;
                // if current data for products is an array of objects, then add it to state:
                Array.from(currData) ? this.setState({ products: currData, isLoading: true }) : console.log("Data Was not an array, Nothing added to state... ")
            })
    }
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    updateTotal(value) {
        if (this.state.grandTotal !== value) {
            this.setState({ grandTotal: value });
        }
    }

    onSubmit = (e) => {
        e.preventDefault();

        const isValid = this.validate();
        if (isValid) {
            console.log("Entries Valid", this.state)
            this.toggle()
        }
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        })
    }

    refreshPage() {
        window.location.reload(false);
    }

    onDeleteClick(itemID) {
        console.log("ID", itemID)
        Axios.delete(`api/carts/delete/${itemID}`)
            .then(res => {
                console.log("Item Successfully Deleted From Cart ", itemID);
                this.refreshPage()
            }).catch(err => console.log("Failed to Delete!: ", err))
    }


    validate = (e) => {
        let emailREGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        let expirationREGEX = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/; // FORMAT MM/YY
        let numbersREGEX = /^[0-9]*$/;
        let productsError = "Cart Cannot Be Empty..."
        let products = this.state.products;
        let lastNameError = "Last Name Cannot Be Empty...";
        let emailError = "Email Cannot Be Empty...";
        let emailError2 = "Email Must Be Valid...";
        let addressError = "Address Cannot Be Empty...";
        let cityError = "City Cannot Be Empty...";
        let stateError = "State Cannot Be Empty...";
        let zipCodeError = "Zip Code Cannot Be Empty...";
        let cardError = "Card Cannot Be Empty...";
        let cardError2 = "Card Information Must Be Numbers...";
        let securityCodeError = "Security Cannot Be Empty...";
        let securityCodeError2 = "Security Code Information Must Be Numbers...";
        let expirationError = "Experation Cannot Be Empty...";
        let expirationError2 = "Expiration Information Must Be Format MM/YY...";
        let firstNameError = "Name Cannot Be Empty";

        // console.log("HERE HERE", products)
        if (products.length === 0) {
            this.setState({ cartError: productsError });
            return false;
        }

        if (this.state.firstName === undefined) {
            this.setState({ cartError: firstNameError });
            return false;
        }
        if (this.state.lastName === undefined) {
            this.setState({ cartError: lastNameError });
            return false;
        }
        if (this.state.email === undefined) {
            this.setState({ cartError: emailError });
            return false;
        }
        if (!this.state.email.match(emailREGEX)) {
            console.log("DIDNT MATCHMatched Regex, continue");
            this.setState({ cartError: emailError2 });
        }
        if (this.state.address === undefined) {
            this.setState({ cartError: addressError });
            return false;
        }
        if (this.state.city === undefined) {
            this.setState({ cartError: cityError });
            return false;
        }
        if (this.state.state === undefined) {
            this.setState({ cartError: stateError });
            return false;
        }
        if (this.state.zipCode === undefined) {
            this.setState({ cartError: zipCodeError });
            return false;
        }
        if (this.state.card === undefined) {
            this.setState({ cartError: cardError });
            return false;
        }
        if (!this.state.card.match(numbersREGEX)) {
            this.setState({ cartError: cardError2 });
        }
        if (this.state.securityCode === undefined) {
            this.setState({ cartError: securityCodeError });
            return false;
        }
        if (!this.state.securityCode.match(numbersREGEX)) {
            console.log('HELLOitting here')
            this.setState({ cartError: securityCodeError2 });
        }
        if (this.state.experation === undefined) {
            this.setState({ cartError: expirationError });
            return false;
        }
        if (!this.state.experation.match(expirationREGEX)) {
            this.setState({ cartError: expirationError2 });
            return false;
        }
        return true;
    }
    killSession(){
        // Query Backend to kill ALL session:
        Axios.get("api/carts/kill")
            .then(res => {
                console.log("Querrying Backend to end session...")
            }).catch(err => console.log("Failed To End Backend Session!: ", err))

            // Kill Front end session/ local storage:
            localStorage.clear();

            //Close modal:
            // this.toggle()      
    }

    async sendEmailBackend(newOrd){
        await Axios.post("api/orders/confirm", newOrd)
        .then(res => {
            console.log("Hitting DB for email Confirm...")
        })
        .catch(err => console.log("Failed To Send Email...:", err))
    }
    async sendOrdersBackend(newOrd){
        await Axios.post("/api/orders", newOrd)
            .then(res => {
                console.log("Order Successfully Placed!")
                // Redirect to Successful orders page:
                this.props.history.push('/orderSuccess');
            }).catch(err => console.log("Failed To Create Order!: ", err))
    }
    

    purchaseOnSubmit = () => {
        // console.log("Hitting here DUDE ORDER IS GOING!")
        const newOrder = {
            // firstName: this.state.firstName,
            // lastName: this.state.lastName,
            // email: this.state.email,
            // address: this.state.address,
            // address2: this.state.adress2,
            // city: this.state.city,
            // state: this.state.state,
            // zipCode: this.state.zipCode,
            total: this.state.grandTotal,
            orderDetails: this.state.products,
            status: "ORDER IN",
        }
        // console.log("HERE TEST1", this.state.products);

        // Iterate through products, and make adjustments to each quantity and qtySold IN THE BACKEND:
        let theItems = this.state.products;
        console.log("PRODUCTS: ", theItems)

        // ****NOTE NOTE MAKE IS VALID CHECK IF ORDER WAS ACTUALLY CREATED< THEN DO THIS FOR LOOP...
        for (let i = 0; i < theItems.length; i++) {
            let item_ID = theItems[i].itemID;
            console.log("ITEM ID", item_ID)

            const updateQuantities = {
                name: theItems[i].name,
                description: theItems[i].description,
                price: theItems[i].price,
                quantity: theItems[i].quantity - theItems[i].desiredQuantity,
                image: theItems[i].image,
                qtySold: theItems[i].qtySold += theItems[i].desiredQuantity
            }

            // NOTE NOTE NOTE!!!!!!**** DO  CHECK IF QUANTITY IS LESS THAN DESIRED QUANTITY. OR MAKE IT TO WHERE ONE CANT CHOOSE HIGHER THAN WHATs AVAILABLE.
            // console.log("HERE updated Quantaties", updateQuantities);

            // Send updated quantities to the backend FOR ITEM:
            Axios.put(`/api/items/${item_ID}`, updateQuantities)
                .then(res => {
                    console.log("Quantities Successfully Updated!")
                }).catch(err => console.log("Failed To Update Quantities...: ", err))
        }

        // Send Order to DB and save:
        this.sendOrdersBackend(newOrder);

        // Send email to buyer from backend:
        this.sendEmailBackend(newOrder)

        // Query Backend to kill ALL session:
        Axios.get("api/carts/kill")
            .then(res => {
                console.log("Querrying Backend to end session...")
            }).catch(err => console.log("Failed To End Backend Session!: ", err))

            // Kill Front end session/ local storage:
            localStorage.clear();

            //Close modal:

        this.toggle()

        // Delete cart collection from DB:
        // Axios.get("api/carts/killCarts")
        // .then(res => {
        //     console.log("Trying to remove collection, No errors so far...")
        //   }).catch(err => console.log("Failed To Delete Collection!: ", err))

        

        // Handler function for stripe:
        async function onToken(token, addresses) {
            console.log("TES HERE", this.state);
            const response = await Axios.post("api/carts/checkout", { token, products: this.products, grandTotal: this.state.grandTotal });
            const { status } = response.data;
            console.log("Response:", response.data);
        
            if (status === "success") {
                // this.purchaseOnSubmit()
              toast("Success! Check email for details", { type: "success" });
            } else {
              toast("Something went wrong", { type: "error" });
            }
          }

    }

    

    render() {
        let cartProducts;
        let grandTotal = 0;
        let productsCount = 0;
        let buttonCheck = true;

        const { products, loading } = this.state;

        if (loading === true) {
            cartProducts = <Spinner />
        } else {
            cartProducts = <Fragment>
                <center><h1>Shopping Cart</h1></center>
                <Table striped>
                    <thead>
                        <tr>
                            <th># </th>
                            <th>Item Name </th>
                            <th>Desired Quantity </th>
                            <th>Subtotal </th>
                            <th>Action </th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length ? products.map((product, i) => (
                            <tr>
                                <th key={product.itemID} scope="row">{i + 1}</th>
                                <div style={{ display: 'none' }}>Grand Total: $ {grandTotal += product.total}</div>
                                {/*<td><Link to="/showAll">{product.name}</Link></td>*/}
                                <td><Link to={{ pathname: `/showItem`, state: { itemID: product.itemID } }}>{product.name}</Link></td>
                                <td>{product.desiredQuantity}</td>
                                <td>{product.total}</td>
                                <td><Button size="sm" color="danger" onClick={() => this.onDeleteClick(product.itemID)}>Remove Item</Button></td>
                            </tr>)) : (console.log("CART IS EMPTY"))}
                    </tbody>
                </Table>
                {!products.length ? <center><h3>Cart Is Empty...</h3></center> : console.log("CART IS NOT EMPTY")}
                {grandTotal ? <center><h5>Grand Total: $ {grandTotal.toFixed(2)}</h5></center> : <center><h5>Grand Total: $ {grandTotal}</h5></center>}
                {this.updateTotal(grandTotal)} 
                {productsCount = products.length}
                

                {this.state.cartError ? <center><Alert color="danger" style={{ fontSize: 12 }}>{this.state.cartError}</Alert></center> : null}

                <Container>

                {/* Starting of stripe form: */}
                <CheckoutReact grandTotal={grandTotal} products={products} productsCount={productsCount} />
                        
                {/* Ending of stripe form: */}

                <hr/>

                    {/* Show One Item modal*/}
                    <div>
                        <Modal className="modal-xlg float-xlg-left"
                            isOpen={this.state.modal}
                            toggle={this.toggle}
                            onClosed={this.purchaseOnSubmit}>
                            <ModalHeader
                                toggle={this.toggle}>
                                <h2 className="modal-item-name ">Review Order</h2>
                                
                            </ModalHeader>
                            <ModalBody className="showItem-modal ">
                                <Container>
                                    <Row>
                                        <Col>
                                            <img className="modalImagetwo" src={require('../../src/images/shirt1.jpg')} />
                                            <h2> What You Ordered:  </h2>
                                            <Row>
                                                <p style={{ fontSize: 24 }} className="modal-description-header">Grand Total:</p>
                                                <p style={{ fontSize: 24 }} className="modal-price font-italic">${parseFloat(this.state.grandTotal).toFixed(2)}</p>
                                            </Row>

                                            <Row>
                                                {this.state.products ?
                                                    <Table striped>
                                                        <thead>
                                                            <tr>
                                                                <th># </th>
                                                                <th>Item Name </th>
                                                                <th>Desired Quantity </th>
                                                                <th>Subtotal </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {products.length ? products.map((product, i) => (
                                                                <tr>
                                                                    <th key={product.itemID} scope="row">{i + 1}</th>
                                                                    <div style={{ display: 'none' }}>Grand Total: $ {grandTotal += product.total}</div>
                                                                    {/*<td><Link to="/showAll">{product.name}</Link></td>*/}
                                                                    <td><Link to={{ pathname: `/showItem`, state: { itemID: product.itemID } }}>{product.name}</Link></td>
                                                                    <td>{product.desiredQuantity}</td>
                                                                    <td>{product.total}</td>
                                                                </tr>)) : (console.log("CART IS EMPTY"))}
                                                        </tbody>
                                                    </Table>
                                                    : console.log("NO PRODUCTS")}
                                            </Row>
                                        </Col>
                                        <Col>
                                            {/* <p>Image: {this.state.image}</p> */}

                                            <h5 className="modal-price-header">Address:</h5>
                                            <p className="modal-price font-italic">{this.state.address + " " + this.state.city + " " + this.state.state + " " + this.state.zipCode}</p>


                                            <h5 className="modal-price-header">Name:</h5>
                                            <p className="modal-price font-italic">{this.state.firstName + " " + this.state.lastName}</p>

                                            <h5 className="modal-description-header">Email:</h5>
                                            <p className="modal-price font-italic"> {this.state.email}</p>


                                        </Col>
                                    </Row>
                                </Container>
                            </ModalBody>
                            <ModalFooter>
                                
                                {this.state.qtyError ? <center><Alert color="danger" style={{ fontSize: 12 }}>{this.state.qtyError}</Alert></center> : null}
                                <Button color="success" onClick={() => this.purchaseOnSubmit()}>Ok</Button>
                                <Button color="secondary" onClick={() => this.purchaseOnSubmit()}>Cancel</Button>
                            </ModalFooter>
                        </Modal>
                    </div>
                    {/* END OF Show One Item modal*/}


                    <br /><br /><br /><br /><br />
                </Container>
            </Fragment>
        }
        return (
            <Container>
                <ListGroup>
                    {cartProducts}
                </ListGroup>
            </Container>
        )
    }
}

Cart.propTypes = {

    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default withRouter(connect(mapStateToProps, { deleteItem })(Cart));