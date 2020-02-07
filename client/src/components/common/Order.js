import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextFieldGroup from './common/TextFieldGroup';
import { withRouter} from "react-router-dom";
import { FormGroup, Label, Input, Jumbotron, Button} from "reactstrap";

class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {
        orderID: "",
        firstName: "",
        lastName: "",
        date: "",
        address: "",
        address2: "",
        city: "",
        state: "",
        zipcode: "",
        total: "",
        card: "",
        securityCode: "",
        expDate: "",
        status: ""
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {

    }

  onChange(e) {
    this.setState({ [e.target.firstName]: e.target.value });
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="login">
            <div className="container">
            <center>
            <Jumbotron>
            <h1 className="display-3">Order</h1>
            <p className="lead">This is a sample.</p>
            <hr className="my-2" />
            <p>Orders and item info will be here</p>
        </Jumbotron></center>
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Purchase</h1>
              <p className="lead text-center">
                Shipping Information:
              </p>
              <form onSubmit={this.onSubmit}>
              <TextFieldGroup 
                  placeholder="First Name"
                  name="firstName"
                  value={this.state.firstName}
                  onChange={this.onChange}
                  
                />

                <TextFieldGroup 
                  placeholder="Last Name"
                  name="lastName"
                  value={this.state.lastName}
                  onChange={this.onChange}
                  
                />

                <TextFieldGroup 
                  placeholder="Address"
                  name="address"
                  value={this.state.address}
                  onChange={this.onChange}
                  
                />

                <TextFieldGroup 
                  placeholder="Apt, Unit, Suite"
                  name="address"
                  value={this.state.address}
                  onChange={this.onChange}
                 
                />

                <TextFieldGroup 
                  placeholder="City"
                  name="city"
                  value={this.state.city}
                  onChange={this.onChange}
                  
                />

                <TextFieldGroup 
                  placeholder="State"
                  name="state"
                  value={this.state.state}
                  onChange={this.onChange}
                  
                />
                <br/>
                <p className="lead text-center">
                Billing Information:
                </p>
                <FormGroup check disabled>
                    <Label check>
                        <Input type="radio" name="radio1" disabled />
                        Same As Shipping
                    </Label>
                </FormGroup>
                <TextFieldGroup 
                  placeholder="Card Number"
                  name="card"
                  value={this.state.card}
                  onChange={this.onChange}
                  
                />

                <TextFieldGroup 
                  placeholder="Security Code"
                  name="securityCode"
                  value={this.state.securityCode}
                  onChange={this.onChange}
                  
                />

                <TextFieldGroup 
                  placeholder="Expiration (MM)/(Year)"
                  name="securityCode"
                  value={this.state.securityCode}
                  onChange={this.onChange}
                  
                />
                

                <input type="Purchase" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Order.propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});
export default withRouter(connect(mapStateToProps, { })(Order));