import React, { Component } from "react"
import { Navbar, Nav, FormControl, Container, Form, Button  } from 'react-bootstrap'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import logo from './logo.png'

import {Home} from "../Pages/Home"
import {Tank} from "../Pages/Tank"
import {About} from "../Pages/About"
import {Park} from "../Pages/Park"

export default class Header extends Component{
    render() {
        return (
            <>
                <Navbar collapseOnSelect expand="md" bg="dark" variant="dark" >
                    <Container>
                        <Navbar.Brand hrefs="/">
                            <img
                                src={logo}
                                height="40"
                                width="40"
                                className="d-inline-block align-top"
                                alt="Logo"
                            />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav" >
                            <Nav className="me-auto">
                                <Nav.Link href="/"> Главное меню </Nav.Link>
                                <Nav.Link href="/tank"> Резервуар </Nav.Link>
                                <Nav.Link href="/about"> Онлайн калькулятор </Nav.Link>
                                <Nav.Link href="/park"> Расчет по парку </Nav.Link>
                            </Nav>
                            <Form country-info-list="true">
                                <FormControl
                                    type="text"
                                    placeholder="Search"
                                    className="me-sm-3" />
                            </Form>
                            <Button variant="outline-info"> Search </Button>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <Router>
                    <Routes>
                        <Route exact path="/" element={<Home />} />
                        <Route exact path="/tank" element={<Tank apiUrl="api/Cistern" />} />
                        <Route exact path="/about" element={<About apiUrl="api/Calculator" />} />
                        <Route exact path="/park" element={<Park apiUrl="api/Calculator" />} />
                    </Routes>
                </Router>
            </>
        );
    }
}