import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { Table, Container, Button, ModalFooter, ListGroup, ListGroupItem, Card, CardImg, CardBody, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Alert } from "reactstrap";
import { connect } from 'react-redux';
import Axios from "axios";
import Spinner from "./common/Spinner";
import { Link } from 'react-router-dom';
import { getItems, getItem, deleteItem } from "../actions/itemActions";
import ItemModal from "./ItemModal";
import { logoutUser } from "../actions/authActions";


class AdminProducts extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			id: "",
			prevName: "",
			prevDescription: "",
			prevPrice: "",
			prevImage: "",
			prevQuantity: "",
			name: "",
			description: "",
			price: "",
			quantity: "",
			qtySold: "",
			image: ""
		}
	}

	refreshPage() {
		window.location.reload(false);
	}
	onLogoutClick(e) {
		e.preventDefault();
		console.log("Admin Successfully Logged Out")
		this.props.logoutUser();
	}
	componentDidMount() {
		// Qury DB for order details:
		this.props.getItems();
	}

	onDeleteClick = (id) => {
		this.props.deleteItem(id);
	}

	toggleEditModal = () => {
		this.setState({
			editModal: !this.state.editModal
		})
	}

	onChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		});
		// console.log("HERE", e.target.value )
	}

	validate = (e) => {
		let numberREGEX = /^[0-9]*$/;
		let decimalREGEX = /^\d+\.\d{0,2}$/;
		let nameError = "Item Name Cannot Be Empty...";
		let descriptionError = "Item Description Cannot Be Empty...";
		let priceError = "Item Price Cannot Be Empty";
		let quantityError = "Item Quantity Cannot Be Empty...";
		let imageError = "Item Image Cannot Be Empty...";
		let priceFormatError = "Price Me Be In '.00' Format! Example: 2.00";
		let quantityError2 = " Quantity Must Be A Number!"

		// console.log("HITTING HERE", this.state)
		if (this.state.name.length === 0) {
			this.setState({ editError: nameError });
			return false;
		}

		if (this.state.description.length === 0) {
			this.setState({ editError: descriptionError });
			return false;
		}

		if (this.state.price.length === 0) {
			this.setState({ editError: priceError });
			return false;
		}
		if (!this.state.price.toString().match(decimalREGEX)) {
			this.setState({ editError: priceFormatError });
			return false;
		}

		if (this.state.quantity.length === 0) {
			this.setState({ editError: quantityError });
			return false;
		}
		if (!this.state.quantity.toString().match(numberREGEX)) {
			this.setState({ editError: quantityError2 });
			return false;
		}

		if (this.state.image.length === 0) {
			this.setState({ editError: imageError });
			return false;
		}

		return true;
	}


	// Edit Item Modal - Grab Data from item and populate under Previous AND Current - After modal is closed, the rest 
	// Of the functionality is sent/finished by the editOnSubmit:
	async editItemModal(id) {
		// await this.setState({ itemID: id });
		// console.log("EDIT MODAL, STATE BEOFRE", this.state)

		let itemID = id;

		// Get data from item:
		console.log("Grabbing data for item...")

		Axios.get(`/api/items/${itemID}`)
			.then(res => {
				let currData = res.data.data;
				// console.log("HERE TEST ", currData)
				this.setState({
					_id: currData._id,
					prevName: currData.name,
					prevDescription: currData.description,
					prevPrice: currData.price,
					prevImage: currData.Image,
					prevQuantity: currData.quantity,
					name: currData.name,
					description: currData.description,
					price: currData.price,
					quantity: currData.quantity,
					image: currData.image,
					qtySold: currData.qtySold
				});
				console.log("State after data return: ", this.state)
			}).catch(err => console.log("Failed to grab data!: ", err))

		// Close Modal:
		this.toggleEditModal()
	}
	// Edit Submit Functionality:
	onEditSubmit = (e) => {
		e.preventDefault();
		const itemID = this.state._id
		const updatedObject = {
			name: this.state.name,
			description: this.state.description,
			price: this.state.price,
			quantity: this.state.quantity,
			image: this.state.image,
			qtySold: this.state.qtySold
		}
		// console.log("ITEM ID", itemID)

		const isValid = this.validate();
		if (isValid) {
			console.log("Entries Valid", this.state)
			// Sending new data to the backend to repalce the old data:
			Axios.put(`/api/items/${itemID}`, updatedObject)
				.then((res) => {
					if (res.data.message !== "Error") { console.log('Item successfully updated') }
				}).catch((error) => {
					console.log("FAILED: ", error)
				})
			this.refreshPage();
		}
	}
	render() {
		const { isAuthenticated } = this.props.auth;
		const authLink = <Button onClick={this.onLogoutClick.bind(this)}
			className="nav-link">Logout</Button>
		let allItems;
		const { items, loading } = this.props.item;
		if (loading === true) {
			allItems = <Spinner />
		} else {
			allItems = <Fragment>

				<Table striped>
					<thead>
						<tr>
							<th>Picture</th>
							<th>Item ID </th>
							<th>Name </th>
							<th>Inventory Count </th>
							<th>Quantity Sold</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{items.length ? items.map((item) => (
							<tr key={item._id}>
								<th scope="row"><img src={require("../../src/images/shirt1.jpg")} alt="Clothing Pic" height="42" width="42" /></th>
								<td><Link to={{ pathname: `/showItem`, state: { itemID: item._id } }}>{item._id}</Link></td>
								<td>{item.name}</td>
								<td>{item.quantity}</td>
								<td>{item.qtySold}</td>
								<td><Button color="danger" onClick={() => this.onDeleteClick(item._id)}>Delete</Button><br /></td>
								<td><Button color="info" onClick={() => this.editItemModal(item._id)}>Edit</Button>{' '}</td>

								{/* <td><Button size="sm" color="danger" onClick={() => this.onDeleteClick(item._id) }>Remove Order</Button></td> */}
							</tr>)) : (console.log("NO ITEMS"))}
					</tbody>

				</Table>


				{/* EDIT Item modal*/}
				<div>
					<Modal className="col-4"
						isOpen={this.state.editModal}
						toggle={this.toggleEditModal}>
						<ModalHeader
							toggle={this.toggleEditModal}>
							Editing Item
													</ModalHeader>
						<ModalBody>
							{/*  FORM ----------------*/}
							<Form onSubmit={this.onEditSubmit}>
								<FormGroup>
									{this.state.editError ? <center><Alert color="danger" style={{ fontSize: 12 }}>{this.state.editError}</Alert></center> : null}
									<Label for="name">Name:</Label>
									<Input type="text" name="name" id="name" value={this.state.name} onChange={this.onChange} />
								</FormGroup>
								<FormGroup>
									<Label for="description">Description</Label>
									<Input type="text" name="description" id="description" value={this.state.description} onChange={this.onChange} />
								</FormGroup>
								<FormGroup>
									<Label for="price">Price</Label>
									<Input type="text" name="price" id="price" value={this.state.price} onChange={this.onChange} />
								</FormGroup>
								<FormGroup>
									<Label for="price">Available Quantity</Label>
									<Input type="text" name="quantity" id="quantity" value={this.state.quantity} onChange={this.onChange} />
								</FormGroup>
								<FormGroup>
									<Label for="image">Image</Label>
									<Input type="text" name="image" id="image" value={this.state.image} onChange={this.onChange} />
								</FormGroup>
								<Button color="primary">Submit Changes</Button> {" "}
								<Button color="secondary" onClick={() => this.toggleEditModal()}>Cancel</Button>
							</Form>
							{/*  END FORM ----------------*/}
						</ModalBody>
					</Modal>
				</div>
				{/* END END Item modal*/}

			</Fragment>
		}
		return (
			<Fragment>
				<Container>
					<Link style={{ float: "left" }} to="/adminView">Orders</Link><p style={{ float: "left" }}> | </p><Link style={{ float: "left" }} to="/adminProducts">Products</Link><br /><br /><center><ItemModal /></center>
					<center>{isAuthenticated ? authLink : null} </center><br />
					<center><h2>Products Dashboard</h2></center>
					{allItems}
				</Container>
			</Fragment>


		);
	}
}

AdminProducts.propTypes = {
	auth: PropTypes.object.isRequired,
	item: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	getItems: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	orderID: state.itemID,
	item: state.item
});

export default connect(mapStateToProps, { getItems, deleteItem, getItem, logoutUser })(AdminProducts)