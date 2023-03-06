import { Component } from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'

type TopNavProps = {}

type TopNavState = {}

class TopNav extends Component<TopNavProps, TopNavState> {
  state = {}

  render() {
    return (
        <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand>Youtube Downloader</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#download">Download</Nav.Link>
              <Nav.Link href="#history">History</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
  }
}

export {TopNav}; export type {TopNavProps};