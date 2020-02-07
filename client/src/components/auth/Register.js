import React, { Component } from 'react';
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import TextFieldGroup from "../common/TextFieldGroup";
import { Alert } from 'reactstrap';


class Register extends Component {
  constructor() {
    super();
    this.state ={
      name: '',
      email: "",
      password: "",
      password2: "",
      code: "",
      nameError: "",
      emailError: "",
      passError: "",
      authError: '',
      errors: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this); // Form bind:
  }

  componentDidMount() {
    if(this.props.auth.isAuthenticated) {
      this.props.history.push("/adminView");
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.errors) {
      this.setState({errors: nextProps.errors});
    }
  }

  

onChange(e) { 
  this.setState({[e.target.name]: e.target.value});
}

onSubmit(e) {
  e.preventDefault();
  const newUser = {
    name: this.state.name,
    email: this.state.email,
    password: this.state.password,
    password2: this.state.password2,
    code: this.state.code,
    errors: {}
  };

  const isValid = this.validate();
    if(isValid) {
      console.log("Entries Valid", this.state)
    }else if (!isValid){
      setTimeout(this.refreshPage, 1000)
    }
  // console.log("HERE REGISTER TEST USER: ", newUser)
  this.props.registerUser(newUser, this.props.history);
}

refreshPage(){
  window.location.reload(false);
  // this.setState({initialState: initialState})
}


validate = (e) => {
  let emailError = "Email Cannot Be Empty...";
  let authError = "Authorization Code Cannot Be Empty...";
  let passError = "Passsword Cannot Be Empty";
  let passError2 = "Passsword Does Not Match.... Ya... it wont refresh... SIT HERE LIKE THE LOSER YOU ARE!!!";
  let passError3 = "Passsword Confirm Cannot Be Empty...";
  let passError4 = "Passsword And Password Confirm Dont Match!";
  let nameError = "Name Cannot Be Empty";
  let nameError2 = "Name Cannot be less than 3 Characters..."
  // console.log("HITTING HERE", this.state)

  if(this.state.code.length === 0){
    this.setState({ authError: authError });
    return false;
  }

  if(this.state.name.length === 0){
    this.setState({ nameError: nameError });
    return false;
  }
  if(this.state.name.length < 3){
    this.setState({ nameError: nameError2 });
    return false;
  }
  if(this.state.email.length === 0){
    this.setState({ emailError: emailError });
    return false;
  }
  
  if(this.state.password.length === 0){
    this.setState({ passError: passError });
    return false;
  }else if(this.state.password2.length === 0){
    this.setState({ passError: passError3 });
    return false;
  }else if(this.state.password !== this.state.password2) {
    this.setState({ passError: passError4 });
    return false;
  }
  return true;
}

  render() {
    const { errors } = this.state;
    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-4 m-auto">
              <h1 className="display-4 text-center">Admin Register</h1>
              {this.state.authError ? <center><Alert color="danger" style={{fontSize: 12}}>{this.state.authError}</Alert></center> : null}
              {this.state.nameError ? <center><Alert color="danger" style={{fontSize: 12}}>{this.state.nameError}</Alert></center> : null}
              {this.state.emailError ? <center><Alert color="danger" style={{fontSize: 12}}>{this.state.emailError}</Alert></center> : null}
              {this.state.passError ? <center><Alert color="danger" style={{fontSize: 12}}>{this.state.passError}</Alert></center> : null}
              {/* Binding this form above as well submit */}
              {/* noValidate onSubmit removes html5 validations to ensure my custom validations display instead */}
              <form noValidate onSubmit={this.onSubmit}>
              <center><TextFieldGroup 
                  placeholder="Authorization Code"
                  name="code"
                  value={this.state.code}
                  onChange={this.onChange}
                  error={errors.code}
                  info="Generated Code For Authorization Of Registration"
                /> </center>
              <TextFieldGroup 
                  placeholder="Name"
                  name="name"
                  value={this.state.name}
                  onChange={this.onChange}
                  error={errors.name}
                />

                <TextFieldGroup 
                  placeholder="Email Address"
                  name="email"
                  type="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                />

                <TextFieldGroup 
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors.password}
                />

                <TextFieldGroup 
                  placeholder="Confirm Password"
                  name="password2"
                  type="password"
                  value={this.state.password2}
                  onChange={this.onChange}
                  error={errors.password2}
                />

                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
});

export default withRouter(connect(mapStateToProps, { registerUser })(Register));