import React, { Component } from "react"
import { Navbar, Nav, Container } from 'react-bootstrap'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import logo from './logo.png'

import {Home} from "../Pages/Home"
import {Cistern} from "../Pages/Cistern"
import {Calculator} from "../Pages/Calculator"
import {Park} from "../Pages/Park"
import {CalculatorV2} from "../Pages/CalculatorV2"
import {ParkV2} from "../Pages/ParkV2"
import { StructuralAnalysis } from "../Pages/StructuralAnalysis"

export default class Header extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.className}>
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
                                <Nav.Link href="/cistern"> Резервуар </Nav.Link>
                                <Nav.Link href="/calculator"> Онлайн калькулятор </Nav.Link>
                                <Nav.Link href="/park"> Расчет по парку </Nav.Link>
                                <Nav.Link href="/calculator_v2"> Онлайн калькулятор В2 </Nav.Link>
                                <Nav.Link href="/parkv2"> Расчет по парку В2 </Nav.Link>
                                <Nav.Link href="/structural_analysis"> Расчет конструкции </Nav.Link>

                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <Router>
                    <Routes>
                        <Route exact path="/" element={<Home />} />
                        <Route exact path="/cistern" element={<Cistern />} />
                        <Route exact path="/calculator" element={<Calculator />} />
                        <Route exact path="/park" element={<Park />} />
                        <Route exact path="/calculator_v2" element={<CalculatorV2 />} />
                        <Route exact path="/parkv2" element={<ParkV2 />} />
                        <Route exact path="/structural_analysis" element={<StructuralAnalysis />} />
                    </Routes>
                </Router>
            </div>
        );
    }
}