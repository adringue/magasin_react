import React, { Component, Fragment } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import { Button, Container } from "reactstrap";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom"
import StripeCheckout from "react-stripe-checkout";
import Axios from "axios";
import { toast } from "react-toastify"

class CheckoutReact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            purchMent: "Purchase Information", // Display message to the stripe form header:
            productTest: {
                itemName: "Tesla Roadster",
                itemPrice: 64998.67,
                itemDescription: "Cool car"
            }
        }
    }

    componentWillMount() {

    }


    render() {
        
        const productTest = this.state.productTest;
        let grandTotal = this.props.grandTotal;
        let productsCount = this.props.productsCount;
        // const products = this.props.products
        // console.log("test here Products", products)
        // console.log("test here grnad total:", grandTotal)
        // console.log("Test ProductTest: ", productTest)
        async function handleToken(token, addresses) {
            const response = await Axios.post("api/carts/checkout", { token, grandTotal, productsCount });
            const { status } = response.data;
            console.log("Response:", response.data);
            if (status === "success") {
                // Set success status in local storage:
                localStorage.setItem('status', status);
                console.log(localStorage.getItem('status'))
                // Reset window after successful card purchase, now verfiy shipping and billing for order into DB:
                window.location.reload(false);
                toast("Success! Check email for details", { type: "success" });
            } else {
                toast("Something went wrong", { type: "error" });
            }
        }


        return (
            <div className="container">
                <div className="product">
                    <h3>On Sale · ${this.props.grandTotal}</h3>
                </div>
                <StripeCheckout
                    stripeKey="pk_test_GuKEoSwdIr3SOG1wDhteerjE00XZisKgDs"
                    token={handleToken}
                    amount={this.props.grandTotal * 100}
                    name={this.state.purchMent}
                    billingAddress
                    shippingAddress
                    label="Pay with 💳"
                    
                    panelLabel="Total: {{amount}}"
                />
            </div>
        );
        
    }
}

CheckoutReact.propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});


export default withRouter(connect(mapStateToProps, {})(CheckoutReact));
