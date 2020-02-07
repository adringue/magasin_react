import PropTypes from 'prop-types';
import React, { Component, Fragment} from 'react';
import { Container, Button, Table, Row, Col, Card, CardText, CardBody,
  CardTitle, CardSubtitle } from "reactstrap";
import { connect } from 'react-redux';
import Axios from "axios";
import Spinner from "./common/Spinner";
import { Link } from 'react-router-dom';


class ShowOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isLoading: false,
        order: ""
      }
  }

  componentDidMount() {
    // console.log("props", this.props)
    const { orderID } = this.props.location.state
    // Qury DB for order details:
    Axios.get(`api/orders/${orderID}`)
      .then(res => {
        let currData = res.data.data;
 
        currData ? this.setState({ order: currData, isLoading: true }) : console.log("Data Was Found ")
      }).catch(err => console.log("Failed to grab data!: ", err))
      
  }

  render() {
    const order = this.state.order;
    const products = order.orderDetails;
    // console.log("TEST HERE", products)
    return (
      <Container>
      <Link style={{float:"left"}} to="/adminView">Orders</Link><p style={{float:"left"}}> | </p><Link style={{float:"left"}} to="/adminProducts">Products</Link><br/><br/>
      <Container className="container">
      <Row  >
        <Col>
          <Card inverse className="modal-description-card" style={{ backgroundColor: '#22', borderColor: '#333' }}>
            <CardBody>
              <CardTitle>Order ID: {order._id} </CardTitle>
              <CardText>Customer Shipping Info: </CardText>
              <CardSubtitle>Name: {order.firstName + order.lastName}</CardSubtitle>
              <CardSubtitle>Address: {order.address}</CardSubtitle>
              <br/>
              <CardText>Customer Billing Info: </CardText>
              <CardSubtitle>Name: {order.firstName + order.lastName}</CardSubtitle>
              <CardSubtitle>Address: {order.address}</CardSubtitle>
            </CardBody>
          </Card>
        </Col>
        <Col>
          <Card invert className="show-order-total">
            <CardBody>
              <CardText>Sub total: ${parseFloat(order.total).toFixed(2)}</CardText>
              <CardText>Shipping: $3.00</CardText>
              <CardText>Total Price: ${parseFloat(order.total + 3.00).toFixed(2)}</CardText>
            </CardBody>
          </Card>
          <br></br>
          <Card invert className="show-order-status">
            <CardBody>
              <CardText>Status: {order.status} </CardText>
            </CardBody>
          </Card>
        </Col>
<br></br>
        <Col className="show-order-container">
          <Table striped dark hover responsive className="showordertable">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
            {products ? products.map((product) => (
              <tr key={product._id}>
                <th scope="row">{product.name}</th>
                <td>${product.price}</td>
                <td>{product.desiredQuantity}</td>
                <td>${product.price * product.desiredQuantity}</td>
                </tr>)) : (console.log("NO ORDERS"))}
            </tbody>






          </Table>
        </Col>
      </Row>
    </Container>
    </Container>
    );
  }
}

ShowOrder.propTypes = {
  auth: PropTypes.object.isRequired,
  orderID: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    orderID: state.itemID

});

export default connect(mapStateToProps, { })(ShowOrder)