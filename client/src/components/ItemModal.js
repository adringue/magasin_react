import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Alert } from "reactstrap";
import { connect } from "react-redux";
import { addItem } from "../actions/itemActions";



class ItemModal extends Component {
  state = {
    modal: false,
    name: "",
    description: "",
    price: "",
    quantity: "",
    image: ""
  }
  /*  Event paramater onChange, setting name to value. Doing this can ensure e.target.value can be used in a diff name rather than making multiple onChange for every paramater, name, lastname, date, etc..*/
  
  toggle = () => {
    this.setState({
      modal: !this.state.modal
    })
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  refreshPage() {
		window.location.reload(false);
	}

  onSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      name: this.state.name,
      description: this.state.description,
      price: this.state.price,
      quantity: this.state.quantity,
      image: this.state.image,
      qtySold: 0
    }
    // Add Item Via addItem Action:
    console.log("HERE", newItem)
    const isValid = this.validate();
		if(isValid) {
			console.log("Entries Valid", this.state)
      this.props.addItem(newItem)
    //Close Modal:
      // this.toggle();
      // Refresh page to reset state to add product:
      this.refreshPage()
    }
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
		if(this.state.name.length === 0){
		  this.setState({ itemError: nameError });
		  return false;
		}

		if(this.state.description.length === 0){
		  this.setState({ itemError: descriptionError });
		  return false;
    }
    
    if(this.state.price.length === 0){
      this.setState({ itemError: priceError });
      return false;
    }
    if(!this.state.price.match(decimalREGEX)){
      this.setState({ itemError: priceFormatError });
		  return false;
    }

		if(this.state.quantity.length === 0){
		  this.setState({ itemError: quantityError });
      return false;
    }
    if(!this.state.quantity.match(numberREGEX)){
      this.setState({ itemError: quantityError2 });
		  return false;
    }

    if(this.state.image.length === 0){
		  this.setState({ itemError: imageError });
		  return false;
    }

		return true;
	  }

  render() {
    return (
      <div>
        <Button
          color="dark"
          style={{marginBottom: '2rem'}}
          onClick={this.toggle}>
          Add Product
        </Button>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}>
          <ModalHeader
            toggle={this.toggle}>
            Add Product
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <center><h1>Enter Item Information Below</h1></center>
                {this.state.itemError ? <center><Alert color="danger" style={{fontSize: 12}}>{this.state.itemError}</Alert></center> : null}
                <Label for="name">Item Name:</Label>
                <Input type="text" name="name" id="name" placeholder="Enter Item Name Here" onChange={this.onChange} />
                <Label for="description">Item Description</Label>
                <Input type="textarea" name="description" id="description" placeholder="Enter A Description Info Here" onChange={this.onChange} />
                <Label for="price">Item Price</Label>
                <Input type="text" name="price" id="price" placeholder="Enter Item Price Here .00 Format" onChange={this.onChange} />
                <Label for="quantity">Quantity</Label>
                <Input type="text" name="quantity" id="quantity" placeholder="Add Available Quantity" onChange={this.onChange} />
                <Label for="image">Item Image</Label>
                <Input type="text" name="image" id="image" placeholder="Enter Image Here" onChange={this.onChange} />
                <Button color="dark"style={{marginTop:"2rem"}}block>Add Item</Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>

      </div>
    )
  }
}

const mapStateToProps = state => ({
  item: state.item
});

export default connect(mapStateToProps, {addItem} )(ItemModal);