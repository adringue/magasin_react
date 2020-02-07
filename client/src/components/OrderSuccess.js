import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Container, Alert } from "reactstrap";
import Axios from "axios";
// import thanksGif from "./common/thanksGift.jpg"

class OrderSuccess extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        let newStatus = localStorage.getItem('status');
        if(newStatus === undefined || newStatus === null) {newStatus = ""}
        // console.log("HERE TEST LOCAL STORAGE:", newStatus)
        if(newStatus.toString() === "success") {
        this.killSession()
        }
    }

    killSession(){
        // Query Backend to kill ALL session:
        Axios.get("api/carts/kill")
            .then(res => {
                console.log("Querrying Backend to end session...")
            }).catch(err => console.log("There was no backend session to end...: ", err))

            // Kill Front end session/ local storage:
            localStorage.clear();   
    }

    render() {
        return (
            <Fragment>
                <Container className="jumbotron text-center">
                    <Alert>Please Check Email For Receipt!</Alert>
                    <h1 className="display-3">Thank You!</h1>
                    <p className="lead"><strong>Please check your email</strong> for further instructions and for your purchase details</p>
                  
                    <p>
                        Having trouble? <a href="">Contact us</a>
                    </p>
                    <p className="lead">
                        <a className="btn btn-primary btn-sm" href="/showAll" role="button">Continue to homepage</a>
                    </p>

                </Container>
            </Fragment>
        );
    }
}

OrderSuccess.propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default withRouter(connect(mapStateToProps, {}) (OrderSuccess));