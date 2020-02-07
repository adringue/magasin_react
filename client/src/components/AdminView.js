import React, { Component, Fragment} from 'react';
import { Container, Button, Table } from "reactstrap";
import PropTypes from 'prop-types';
import { logoutUser } from "../actions/authActions";
import { connect } from 'react-redux';
import Axios from "axios";
import Spinner from "./common/Spinner";
import Dropdown from "react-dropdown";
import { Link } from 'react-router-dom';
import Moment from "react-moment";

class AdminView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            orders: [],
            status: "",
            orderData: []
        }
        this.updateStatus = this.updateStatus.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    refreshPage() {
		window.location.reload(false);
	}

    onDeleteClick(orderID){
		Axios.delete(`api/orders/${orderID}`)
		.then( res => {
      console.log("Order Successfully Deleted ", orderID);
      this.refreshPage()
		}).catch(err => console.log("Failed to Delete!: ", err))
    }

    componentDidMount(){
        Axios.get("/api/orders")
      .then(res => {
        let currData = res.data;
        // if current data for orders is an array of objects, then add it to state:
        Array.from(currData) ? this.setState({ orders: currData, isLoading: true }) : console.log("Data Was not an array, Nothing added to state... ")
      }).catch(err => console.log("Failed to grab data!: ", err))
    }

    async updateStatus(val){
        await this.setState({newStatus: val.value})
        
        // First query DB to populate current state with current data in DB:
        Axios.get(`/api/orders/${this.state.orderID}`)
      .then(res => {
        let currData = res.data.data;
        // if current data was returned, then store it under the name "orderDetails", else, console.log(failed)
        currData ? this.setState({ orderData: currData, isLoading: true }) : console.log("Data Failed To Grab... ")
      }).catch(err => console.log("Failed to grab data!: ", err))
      const orderData = this.state.orderData
      // Prepare new object:
      const updatedOrder = {
          address: orderData.address,
          card: orderData.card,
          email: orderData.email,
          experation: orderData.experation,
          firstName: orderData.firstName,
          lastName: orderData.lastName,
          address: orderData.address,
          orderDetails: orderData.orderDetails,
          securityCode: orderData.securityCode,
          total: orderData.total,
          status: this.state.newStatus
      }
    //   console.log("New Order Object:", updatedOrder)
      
        //Save updated info to backend DB:
        await Axios.put(`/api/orders/${this.state.orderID}`, updatedOrder)
      .then(res => {
        console.log("Status Successfully updated!")
      })
      .catch(err => console.log("Failed To Update Status...:" , err))
      
      // State count down to refresh page: Refresh page after 1000 miliseconds (1 second)
      setTimeout(this.refreshPage(), 1000);
    }

    async addID(orderID) {
        await this.setState({orderID: orderID})   
    }

    onLogoutClick(e) {
        e.preventDefault();
        console.log("Admin Successfully Logged Out")
        this.props.logoutUser();
    }

    onChange = (e) => {
        this.setState({ selectValue: e.currentTarget.textContent });
    }

    
    render() {
        let options = [{label: 'Shipped', value: 'Shipped' }];
        let allOrders;
        const { isAuthenticated } = this.props.auth;

        const authLink = <Button onClick={this.onLogoutClick.bind(this)}
            className="nav-link">Logout</Button>
        // const test = logoutUser;

        const { orders, loading } = this.state;

        if (loading === true) {
        allOrders = <Spinner />
        } else {
        allOrders = <Fragment>
            
        <center>{isAuthenticated ? authLink : null} </center><br/>
        <Table striped>
            <thead>
                <tr>
                <th>Order ID </th>
                <th>Name </th>
                <th>Date </th>
                <th>Billing Address </th>
                <th>Total</th>
                <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {orders.length ? orders.map((order) => (
                <tr key={order._id}>
                    <th scope="row"><Link to={{ pathname: `/showOrder`, state: {orderID: order._id}}}>{order._id}</Link></th>
                    <td>{order.firstName + " " + order.lastName}</td>
                    <td><Moment format="MM/DD/YYYY">{order.date}</Moment></td>
                    <td>{order.address}</td>
                    <td>${parseFloat(order.total).toFixed(2)}</td>
                    <td><Button onClick={()=>this.addID(order._id)}><Dropdown options={options} value={order.status} placeholder="Select an option" onChange={this.updateStatus}  /> </Button></td>
                    {/* <td><Button size="sm" color="danger" onClick={() => this.onDeleteClick(order._id) }>Remove Order</Button></td> */}
                </tr>)) : (console.log("NO ORDERS"))}
            </tbody>
            </Table>
        </Fragment>
        }
        return (
            <center>
                <Container>
                    <div>
                    <Link style={{float:"left"}} to="/adminView">Orders</Link><p style={{float:"left"}}> | </p><Link style={{float:"left"}} to="/adminProducts">Products</Link><h1>Welcome Admin, Viewing All Orders...</h1>
                        {allOrders}
                    </div>
                </Container>
            </center>
        );
    }
}

AdminView.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logoutUser })(AdminView)