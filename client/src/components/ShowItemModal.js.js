import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody} from "reactstrap";
import { connect } from "react-redux";
import { getItem } from "../actions/itemActions";
import Axios from "axios";


class ShowItemModal extends Component {
  state = {
    modal: false,
    name: "",
    description: "",
    price: "",
    image: ""
  }
  // Runs when component is first rand (Mounted)
  // getItemDetails function will run which will grab all the item details and populate the state oobject with said data:
  componentDidMount() {
    //   this.getItmDetails();
    //   this.viewItem();
    }



  /*  Event paramater onChange, setting name to value. Doing this can ensure e.target.value can be used in a diff name rather than making multiple onChange for every paramater, name, lastname, date, etc..*/
  
  toggle = () => {
    this.setState({
      modal: !this.state.modal
    })
  }
  // Note we set up proxy alreadyy, so the "http://localhost:5000    is already there"
  getItemDetails() {
      console.log("Grabbing data for each item...")
    // let itemID = this.props.match.params.id;
    let itemID = "5dbf23b7c91957150406421f";
    Axios.get(`/api/items/${itemID}`)
    .then(res => {
        let newData = res.data.data;
        console.log("Returned data: ", newData)
        this.setState({
            id: newData.id,
            name: newData.name,
            description: newData.description,
            price: newData.price,
            image: newData.image
        });
        console.log("State after data return: ", this.state)
    }).catch(err => console.log("IT HIT AN ERROR!: ", err))
}

// When submit button is pressed, close the modal:
onSubmit = (e) => {
    // Close Modal:
    this.toggle();
}


// OTHER CODE DONT WORRY ABOUT TI FOR NOW:----
//   onSubmit = (e) => {
//     e.preventDefault();
//     const newItem = {
//       name: this.state.name,
//       description: this.state.description,
//       price: this.state.price,
//       image: this.state.image
//     }
//     // Add Item Via addItem Action:
//     this.props.addItem(newItem)

//     //Close Modal:
//     this.toggle();
//   }

  render() {
    return (
      <div>
        <Button
          color="dark"
          style={{marginBottom: '2rem'}}
          onClick={this.toggle}>
          View
        </Button>
        <Modal 
          isOpen={this.state.modal}
          toggle={this.toggle}>
          <ModalHeader
            toggle={this.toggle}>
            Viewing Item Details
          </ModalHeader>
          <ModalBody>
            <p>{this.props.itemID}</p>
            
            <p>Name: </p>
            <p>Description: </p>
            <p>Price: </p>
            <p>Image: </p>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  item: state.item
});

export default connect(mapStateToProps, {getItem} )(ShowItemModal);