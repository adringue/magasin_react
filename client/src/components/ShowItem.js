import React, { Component, Fragment } from 'react';
import {
    Row, Col, Table, Jumbotron, Container, ModalFooter, ListGroup, ListGroupItem, Button, Card, CardImg, CardBody, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input
} from "reactstrap";
import PropTypes from 'prop-types';
import { logoutUser } from "../actions/authActions";
import { connect } from 'react-redux';
import Axios from "axios";
import Spinner from "./common/Spinner";
import Dropdown from "react-dropdown";
import { Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
class ShowItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemInfo: ""
        }
    }
    componentDidMount() {
        // const { productID } = this.props.location.state
        const { itemID } = this.props.location.state
        this.showItem(itemID)
    }
    async showItem(id) {
        await this.setState({ itemID: id });
        let itemID = id;
        Axios.get(`/api/items/${itemID}`)
            .then(res => {
                let newData = res.data.data;
                this.setState({
                    id: itemID,
                    name: newData.name,
                    description: newData.description,
                    price: newData.price,
                    quantity: newData.quantity,
                    image: newData.image
                });
                console.log("State after data return SHOWONE COMP: ", this.state)
            }).catch(err => console.log("IT HIT AN ERROR!: ", err))
    }
    render() {
        return (
            <Fragment>
                <Container>
                    <Row>
                        <center>
                        <Col className="col-12 col-lg-8">
                            <center>
                                <Jumbotron>
                                    <CardImg className="col-4 col-lg-6 block " src={require('../../src/images/shirt1.jpg')} />
                                    {/* <p>Item ID: {this.state.itemID}</p> */}
                                    {/* <h5 >Image description:{this.state.image}</h5> */}
                                    <h1 >{this.state.name}</h1>
                                    <hr className="my-2" />
                                    <h4 className="text-primary">{this.state.description}</h4>
                                    <h5 className="text-primary">Price: ${this.state.price}</h5>
                                    <h5 className="text-primary">Available Quantity: {this.state.quantity}</h5>
                                    <hr className="my-2" />
                                    <p className="lead">
                                        {console.log("HERE TEST", this.props.history)}
                                        <Button color="primary" onClick={() => this.props.history.goBack()}>Go Back</Button>
                                    </p>
                                </Jumbotron>
                            </center>
                        </Col>
                        </center>
                    </Row>
                </Container>
            </Fragment>
        );
    }
}
ShowItem.propTypes = {
    history: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth
});
export default withRouter(connect(mapStateToProps, {})(ShowItem))