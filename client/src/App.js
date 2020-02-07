import React, { Fragment } from 'react';
import { Container } from "reactstrap";
import { Router, Route, Switch } from "react-router-dom";
import history from './history';
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken"
import { setCurrentUser, logoutUser } from "./actions/authActions";
import {Elements, StripeProvider} from 'react-stripe-elements';


// Components:
import AppNavbar from "./components/AppNavbar";
import PrivateRoute from "./components/common/PrivateRoute";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import ItemModal from "./components/ItemModal";
import ShowItem from "./components/ShowItem";
import ShowAll from "./components/ShowAll";
import AdminView from "./components/AdminView";
import Cart from "./components/Cart";
import ShowOrder from "./components/ShowOrder";
import ShowAllOrders from "./components/ShowAllOrders";
import CheckoutForm from './components//CheckoutForm';

// import EditItem from "./components/EditItem";

import { Provider } from "react-redux";
import store from "./store";

import "bootstrap/dist/css/bootstrap.min.css";
// import 'bootstrap/dist/css/bootstrap.css';

import './App.css';
import OrderSuccess from './components/OrderSuccess';
import AdminProducts from './components/AdminProducts';

// This section is for verifying jwt session. If logged in, then admin info is reset when
// coming back to the page, otherwise if session has expired, force user/admin logout:
// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated

  // HERE BITCH!!!!--------------
  store.dispatch(setCurrentUser(decoded));
  // HERE BITCH!!!!--------------

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());

    // *NOTE* CURRENTLY COMMENTED OUT BECUASE THERE WILL ONLY BE A FEW ADMINS USING THESE FUNCTIONALITES AND ISNT NEEDED. 
    // wE DO NOT WANT TO FORCE THE USER TO GO TO OUT SUPPOSED "SECRET" ADMIN PAGE:
    // Redirect to login
    window.location.href = "/login";
  }
}


function App() {
  return (
    <Provider store={store}>
    <Router history={history}>
      <AppNavbar />
      
        <Switch>
        
          <PrivateRoute exact path="/adminView" exact component={AdminView} />
    
          <PrivateRoute exact path="/showOrder" exact component={ShowOrder} />

          <PrivateRoute exact path="/adminProducts" exact component={AdminProducts} />
            
          <Route path="/showItem"><ShowItem /></Route>

          <Route path="/cart">
            <Cart />
          </Route>

          <Route path="/login">
            <Login />
          </Route>
          
          <Route path="/register">
            <Register />
          </Route>

          <Route path="/showOrder">
            <ShowOrder />
          </Route>
          
          <Route path="/showAllOrders">
            <ShowAllOrders/>
          </Route>

          <Route path="/orderSuccess">
            <OrderSuccess/>
          </Route>

          <Route path="/showAll">
          <Fragment>
            <Container>
              
              <ShowAll />
            </Container>
          </Fragment>
          </Route>
          
          <Fragment>
            <Container>
              
              <ShowAll />
            </Container>
          </Fragment>
        </Switch>
        
    </Router>
    </Provider>
  );
}

export default App;
