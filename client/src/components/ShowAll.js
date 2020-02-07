import React, { Component } from "react";
// import ShowItemModal from "./ShowItemModal.js";
// import Cart from "./Cart.js";
import { withRouter} from "react-router-dom";
import {
	Container, ModalFooter, ListGroup, ListGroupItem, Button, Card, CardImg, CardBody, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Alert
} from "reactstrap";
import { CSSTransition, TransitionGroup } from "react-transition-group";
// import uuid from "uuid/v4";
import { connect } from "react-redux";
import { getItems, deleteItem, getItem} from "../actions/itemActions";
import PropTypes from 'prop-types';
import Spinner from "./common/Spinner";
import Axios from "axios";


//---
class ShowAll extends Component {
	constructor(props) {
        super(props);
        this.state = {
			products: [],
			total: "",
			desiredQuantity: "",
			prevName: "",
			prevDescription: "",
			prevPrice: "",
			prevImage: "",
			prevQuantity: "",
			itemID: "",
			name: "",
			description: "",
			price: "",
			image: "",
			quantity: "",
			qtySold: ""
		}
	}

	refreshPage() {
		window.location.reload(false);
	}

	// When submit button is pressed, populate state with whats entered:
	onChange = (e) => {
		this.setState({
			id: this.id,
			[e.target.name]: e.target.value,
		});
		// console.log("HERE", e.target.value )
	}

	// MODAL FUNCTIONS ------------
	toggle = () => {
		this.setState({
			modal: !this.state.modal
		})
	}

	// NESTED NOT BEING USED YET:
	toggleNested = () => {
		this.setState({
			nestedModal: !this.state.nestedModal
		})
	}

	toggleEditModal = () => {
		this.setState({
			editModal: !this.state.editModal
		})
	}
	//END OF MODALS: -------

	componentDidMount() {
		this.props.getItems();
	}
	onDeleteClick = (id) => {
		this.props.deleteItem(id);
	}

	// Grab data for ONE ITEM:--
	// Utiliing aync/await functionality to wait on setting state before rendering the modal to ensure data is properly populated:
	async showOneModal(id) {
		await this.setState({ itemID: id });
		let itemID = this.state.itemID;

		console.log("Grabbing data for item...")

		Axios.get(`/api/items/${itemID}`)
			.then(res => {
				let newData = res.data.data;
				this.setState({
					id: newData.itemID,
					name: newData.name,
					description: newData.description,
					price: newData.price,
					quantity: newData.quantity,
					image: newData.image,
					qtySold: newData.qtySold
				});
				console.log("State after data return SHOWONE COMP: ", this.state)
			}).catch(err => console.log("IT HIT AN ERROR!: ", err))

		// Close modal:
		this.toggle();
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
					id: currData.id,
					prevName: currData.name,
					prevDescription: currData.description,
					prevPrice: currData.price,
					prevImage: currData.Image,
					prevQuantity: currData.quantity,
					name: currData.name,
					description: currData.description,
					price: currData.price,
					quantity: currData.quantity,
					qtySold: currData.qtySold,
					image: currData.image
				});
				console.log("State after data return: ", this.state)
			}).catch(err => console.log("Failed to grab data!: ", err))

		// Close Modal:
		this.toggleEditModal()
	}

	// Edit Submit Functionality:
	onEditSubmit = (e) => {
		e.preventDefault();
		const itemID = this.state.itemID
		const updatedObject = {
			name: this.state.name,
			description: this.state.description,
			price: this.state.price,
			quantity: this.state.quantity,
			image: this.state.image
		}
		// Sending new data to the backend to repalce the old data:
		Axios.put(`/api/items/${itemID}`, updatedObject)
			.then((res) => {
				console.log(res.data)
				console.log('Item successfully updated')
			}).catch((error) => {
				console.log("FAILED: ", error)
			})
		// Having issues with component refreshing after new data was submited, this is a temporary "Work around" for now:
		// Basically is checking if the new data entered is different from any of the old data originally pulled, if so, then obviously something has changed, and window/component is forced to refresh:
		this.toggleEditModal();
		if (this.state.name !== this.state.prevName || this.state.description !== this.state.prevDescription || this.state.price !== this.state.prevPrice || this.state.image !== this.state.prevImage ||  this.state.quantity !== this.state.prevQuantity) {
			console.log("REFRESHING COMPONENT")
			this.refreshPage();
		}
	}

	validate = (e) => {
		let numbersREGEX = /^\d+$/;
		let qtyError = "Desired Quantity Cannot Be Empty...";
		let qtyError2 = "Desired Quantity Must Be A Number!";
		let qtyError3 = "Desired Quantity Cannot Be More Than Whats Available..."
	
		// console.log("HITTING HERE", this.state)
		if(this.state.desiredQuantity.length === 0){
		  this.setState({ qtyError: qtyError });
		  return false;
		}
		if(!this.state.desiredQuantity.match(numbersREGEX)){
			this.setState({ qtyError: qtyError2 });
			return false;
		  }

		  if(this.state.desiredQuantity > this.state.quantity){
			this.setState({ qtyError: qtyError3 });
			return false;
		  }

		return true;
	  }

	async addToCart(){
		const itemID = this.state.itemID;
		const totalAm = (this.state.price * this.state.desiredQuantity);
		const cartObject = {
			itemID: itemID,
			desiredQuantity: this.state.desiredQuantity,
			name: this.state.name,
			price: this.state.price,
			total: totalAm,
			quantity: this.state.quantity,
			description: this.state.description,
			qtySold: this.state.qtySold,
			image: this.state.image,
		}
		console.log("Cart object", cartObject)

		const isValid = this.validate();
		if(isValid){
			console.log("Entries Valid", this.state)
			// Sending new data to the backend to cart, and nesting an array of objects under "products":
			Axios.post("/api/carts/", cartObject)
			.then((res) => {
				console.log('Item Added To Cart!')
			}).catch((error) => {
				console.log("FAILED: ", error)
			})
			// Close modal
			this.toggle();	
		}	
	}

	onSubmit = (e) => {
		// Close Modal:
		// this.refreshPage();
		this.toggle();
		this.toggleEditModal();
	}
	render() {

		// const guestLink = (<div><p>GUEST</p></div>);
		// const editButton = <Button onClick={() => this.editItemModal(_id)}>EDIT</Button>
		// const { match, location, history } = this.props
		let itemContent;

		const { items, loading } = this.props.item;
		if (loading === true) {
			itemContent = <Spinner />
		} else {
			itemContent =
				<TransitionGroup className="shopping-list">
					{/* Iterate through items/state: */}
					{items.map(({ _id, name, description, price, quantity, image  }) => (
						<CSSTransition key={_id} timeout={500} classNames="fade">
							<ListGroupItem sm="12" md={{ size: 6, offset: 3 }}>
								{/* Bootstrap Card Latout for each item: */}
								<div className="whole">
									<Card className="card" xs="3" className="col">
										<CardBody>
											<center><p className="font-weight-bold">{name}</p></center>
												<CardImg className="Image" src={require('../../src/images/shirt1.jpg')} />
											<center>
												<p className="font-italic ">${price}</p>
											</center>

											<center>
												<Button color="success" onClick={() => this.showOneModal(_id)}>View Details</Button><br />
												{/*<Button color="info" onClick={() => this.editItemModal(_id)}>Edit</Button>{' '}*/}
											</center>
											
											{/* Show One Item modal*/}
											<div>
												<Modal className="modal-xlg float-xlg-left"
													isOpen={this.state.modal}
													toggle={this.toggle}>
													<ModalHeader
														toggle={this.toggle}>
														<h2 className="modal-item-name ">{this.state.name}</h2>
													</ModalHeader>
													<ModalBody className="showItem-modal ">
														<img className="modalImage float-sm-left" src={require('../../src/images/shirt1.jpg')} />
														{/* <p>Image: {this.state.image}</p> */}
														<h5 className="modal-price-header">Price:</h5>
														<p className="modal-price font-italic">$ {this.state.price}</p>
														<h5 className="modal-description-header">Available Amount:</h5>
														<p className="modal-price font-italic"> {this.state.quantity}</p>
														<h5 className="modal-description-header">Description:</h5>
														<p className="modal-description-body font-weight-light">{this.state.description}</p>
													</ModalBody>
													
													<ModalFooter>
													{this.state.qtyError ? <center><Alert color="danger" style={{fontSize: 12}}>{this.state.qtyError}</Alert></center> : null}
														<Label className="font-weight-bold" for="desiredQuantity">How Many?</Label>
														<Input className="quantityInput" type="text" name="desiredQuantity" id="desiredQuantity" value={this.state.desiredQuantity} onChange={this.onChange} />
														<Button color="success" onClick={() => this.addToCart(_id)}>Add To Cart</Button>
														<Button color="secondary" onClick={() => this.toggle()}>Cancel</Button>
													</ModalFooter>
												</Modal>
											</div>
											{/* END OF Show One Item modal*/}

											{/* EDIT Item modal*/}
											<div>
												<Modal
													isOpen={this.state.editModal}
													toggle={this.toggleEditModal}>
													<ModalHeader
														toggle={this.toggleEditModal}>
														Editing Item
													</ModalHeader>
													<ModalBody className="showItem-modal">
														{/*  FORM ----------------*/}
														<Form onSubmit={this.onEditSubmit}>
															<FormGroup>
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
															<Button color="primary">Submit Changes</Button>
															<Button color="secondary" onClick={() => this.toggleEditModal()}>Cancel</Button>
														</Form>
														{/*  END FORM ----------------*/}
													</ModalBody>
												</Modal>
											</div>
											{/* END END Item modal*/}

										</CardBody>
									</Card>
								</div>
							</ListGroupItem>
						</CSSTransition>
					))}
				</TransitionGroup>
		}
		return (
			<Container>
				<ListGroup>
					{itemContent}
				</ListGroup>
			</Container>
		)
	}
}
ShowAll.propTypes = {
	getItems: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	item: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
}
const mapStateToProps = (state) => ({
	auth: state.auth,
	item: state.item
});
export default withRouter(connect(mapStateToProps, { getItem, getItems, deleteItem })(ShowAll));