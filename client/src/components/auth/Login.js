import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/authActions';
import TextFieldGroup from '../common/TextFieldGroup';
import { withRouter} from "react-router-dom";
import { Alert } from 'reactstrap';

const initialState = {
    email: '',
    password: '',
    emailError: "",
    passwordError: "",
    // errors: {}
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {initialState};

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    // const { match, location, history } = this.props
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/adminView');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/adminView');
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    const isValid = this.validate();
    // setTimeout(this.setState(initialState), 2000);
    if(isValid) {
      console.log("Entries Valid", this.state)
    }else if (!isValid){
      setTimeout(this.refreshPage, 1000)
    }
    
    this.props.loginUser(userData);
  }

  refreshPage(){
    window.location.reload(false);
    // this.setState({initialState: initialState})
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  validate = (e) => {
    let emailError = "Email Cannot Be Empty";
    let passError = "Passsword Cannot Be Empty";
    let passErrorTwo = "Passsword Does Not Match.... Ya... it wont refresh... SIT HERE LIKE THE LOSER YOU ARE!!!";
    
    if(this.state.email === undefined){
      this.setState({ emailError: emailError });
      return false;
    }
    if(this.state.password === undefined){
      this.setState({ passError: passError });
      return false;
    }else if(this.state.password !== undefined){
      this.setState({ passError: passErrorTwo });
      // return false;
    }
    return true;
  }

  render() {
    const { errors } = this.state;
    // console.log("Errors", errors)
    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-4 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">
                Sign Into Your Admin Account
              </p>
              {this.state.emailError ? <center><Alert color="danger" style={{fontSize: 12}}>{this.state.emailError}</Alert></center> : null}
              {this.state.passError ? <center><Alert color="danger" style={{fontSize: 12}}>{this.state.passError}</Alert></center> : null}
              <form onSubmit={this.onSubmit}>
              <div>
                <TextFieldGroup
                  placeholder="Email Address"
                  name="email"
                  type="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors}
                />
                
                </div>
              <div>
                <TextFieldGroup
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors}
                />
               
              </div>
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default withRouter(connect(mapStateToProps, { loginUser })(Login));