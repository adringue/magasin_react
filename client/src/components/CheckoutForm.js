import React, {Component, Fragment} from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import { Button, Container } from "reactstrap";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom"

class CheckoutForm extends Component {
  constructor(props) {  
    super(props);
    this.state = {complete: false};
    this.submit = this.submit.bind(this);
  }

  async submit(e) {
    let {token} = await this.props.stripe.createToken({name: "Name"});
    try{
        let response = await fetch("/api/carts/charge", {
        method: "POST",
        headers: {"Content-Type": "text/plain"},
        body: token.id
        });
    
        if (response.ok) this.setState({complete: true});
    }catch{
        return console.log("Failed")
    }
  }

  render() {
    // if(this.state.complete) console.log("HERE TEST", this.props)
        if(this.state.complete) this.props.history.push("/orderSuccess");

        return (
            <Fragment>
                <Container>
                    <center>
                        <p>Would you like to complete the purchase?</p>
                        <CardElement />
                        <Button color="info" onClick={this.submit}>Purchase</Button>
                    </center>
                </Container>
                <br/><br/><br/><br/><br/><br/><br/><br/><br/>
          </Fragment>
          
        );
  }
}

CheckoutForm.propTypes = {

    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});


export default injectStripe(withRouter(connect(mapStateToProps, { })(CheckoutForm)));