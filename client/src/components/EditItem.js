import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getItem } from "../actions/itemActions";
import PropTypes from 'prop-types';
import axios from "axios";

const mapStateToProps = state => ({
    item: state.item
})


class EditItem extends Component {
    // Construct entries into state props:
    constructor(props) {
        super(props)
        this.onChangeItemName = this.onChangeItemName.bind(this);
        this.onChangeItemDescription = this.onChangeItemDescription.bind(this);
        this.onChangeItemPrice = this.onChangeItemPrice.bind(this);
        this.onChangeItemImage = this.onChangeItemImage.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        // State
        this.state = {
            name: '',
            description: '',
            price: '',
            image: ''
        }
    }

    // Grabing ID from the get go and populating the data into state:
    componentDidMount() {
        axios.get('http://localhost:5000/api/items/' + this.props.match.params.id)
            .then(res => {
                this.setState({
                    name: res.data.name,
                    description: res.data.description,
                    price: res.data.price,
                    image: res.data.image
                });
            })
            .catch((error) => {
                console.log(error);
            })
    }
    // Update all forms on character entry Live-Event/AJAX:
    onChangeItemName(e) {
        this.setState({ name: e.target.value })
    }
    
    onChangeItemDescription(e) {
        this.setState({ description: e.target.value })
    }
    
    
    onChangeItemPrice(e) {
        this.setState({ price: e.target.value })
    }
    
    onChangeItemImage(e) {
        this.setState({ image: e.target.value })
    }
    
    onSubmit(e) {
        e.preventDefault()
    
        const updatedObject = {
            name: this.state.name,
            description: this.state.description,
            price: this.state.price,
            image: this.state.image
        }
    
        // Put call to backend:
        axios.put('http://localhost:5000/api/items/' + this.props.match.params.id, updatedObject)
            .then((res) => {
                console.log(res.data)
                console.log('Item successfully updated')
            }).catch((error) => {
                console.log(error)
            })

    }

    //Utilizing how you set up redux:
    // onSubmit = (e) => {
    //     e.preventDefault();
    //     const updatedItem = {
    //       name: this.state.name,
    //       description: this.state.description,
    //       price: this.state.price,
    //       image: this.state.image
    //     }
    //     // Update Item Via editItem Action:
    //     this.props.editItem(updatedItem)
    //   }
    
    render() {
        return (<div className="form-wrapper">
      <Form onSubmit={this.onSubmit}>
        <Form.Group controlId="Name">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" value={this.state.name} onChange={this.onChangeItemtName} />
        </Form.Group>

        <Form.Group controlId="Description">
          <Form.Label>Description</Form.Label>
          <Form.Control type="text" value={this.state.description} onChange={this.onChangeItemDescription} />
        </Form.Group>

        <Form.Group controlId="Price">
          <Form.Label>Price</Form.Label>
          <Form.Control type="text" value={this.state.rollno} onChange={this.onChangeStudentRollno} />
        </Form.Group>

        <Form.Group controlId="Image">
          <Form.Label>Image</Form.Label>
          <Form.Control type="text" value={this.state.Image} onChange={this.onChangeItemImage} />
        </Form.Group>

        <Button variant="danger" size="lg" block="block" type="submit">
          Update Student
        </Button>
      </Form>
    </div>);
    }
}

export default connect(mapStateToProps, )(EditItem);