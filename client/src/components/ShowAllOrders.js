import React from 'react';
import { Table, Container, Row, Col } from 'reactstrap';
const Example = (props) => {
  return (
    <Container className="container">
              <row><center><h1>All Orders</h1></center> </row>
      <Row  >
        <Col className="show-order-container">
          <Table striped dark hover responsive className="showordertable">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Billing Address</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">100</th>
                <td>Bob</td>
                <td>9/6/2014</td>
                <td>123 dojo way Bellvue WA 98005</td>
                <td>$149.99</td>
                <td>Shipped</td>
              </tr>
              <tr>
                <th scope="row">99</th>
                <td>Red</td>
                <td>9/6/2014</td>
                <td>123 dojo way Bellvue WA 98005</td>
                <td>$149.99</td>
                <td>Shipped</td>
              </tr>
              <tr>
                <th scope="row">98</th>
                <td>Vanessa</td>
                <td>9/6/2014</td>
                <td>123 dojo way Bellvue WA 98005</td>
                <td>$149.99</td>
                <td>Shipped</td>
              </tr>
              <tr>
                <th scope="row">97</th>
                <td>Steve</td>
                <td>9/6/2014</td>
                <td>123 dojo way Bellvue WA 98005</td>
                <td>$149.99</td>
                <td>Shipped</td>
              </tr>
              <tr>
                <th scope="row">96</th>
                <td>Richard</td>
                <td>9/6/2014</td>
                <td>123 dojo way Bellvue WA 98005</td>
                <td>$19.99</td>
                <td>Complete</td>
              </tr>
              <tr>
                <th scope="row">95</th>
                <td>Michael</td>
                <td>9/6/2014</td>
                <td>123 dojo way Bellvue WA 98005</td>
                <td>$14.99</td>
                <td>Shipped</td>
              </tr>
              <tr>
                <th scope="row">94</th>
                <td>Larry</td>
                <td>9/6/2014</td>
                <td>123 dojo way Bellvue WA 98005</td>
                <td>$77.99</td>
                <td>Shipped</td>
              </tr>
              <tr>
                <th scope="row">93</th>
                <td>Sherryl</td>
                <td>9/6/2014</td>
                <td>123 dojo way Bellvue WA 98005</td>
                <td>$99.99</td>
                <td>Cancelled</td>
              </tr>
              <tr>
                <th scope="row">92</th>
                <td>Hank</td>
                <td>9/6/2014</td>
                <td>123 dojo way Bellvue WA 98005</td>
                <td>$149.99</td>
                <td>Shipped</td>
              </tr>
              <tr>
                <th scope="row">91</th>
                <td>Blue</td>
                <td>9/6/2014</td>
                <td>123 dojo way Bellvue WA 98005</td>
                <td>$149.99</td>
                <td>Order in progress</td>
              </tr>
              <tr>
                <th scope="row">90</th>
                <td>Mack</td>
                <td>9/6/2014</td>
                <td>123 dojo way Bellvue WA 98005</td>
                <td>$149.99</td>
                <td>Cancelled</td>
              </tr>
              <tr>
                <th scope="row">89</th>
                <td>Roger</td>
                <td>9/5/2014</td>
                <td>123 dojo way Bellvue WA 98005</td>
                <td>$99.99</td>
                <td>Shipped</td>
              </tr>
              <tr>
                <th scope="row">88</th>
                <td>Cameron</td>
                <td>9/6/2014</td>
                <td>123 dojo way Bellvue WA 98005</td>
                <td>$149.99</td>
                <td>Shipped</td>
              </tr>
              <tr>
                <th scope="row">87</th>
                <td>Ning</td>
                <td>9/6/2014</td>
                <td>123 dojo way Bellvue WA 98005</td>
                <td>$19.99</td>
                <td>In Progress</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}
export default Example;