import React, { Component } from "react"
import { Navbar, Nav, Container, DropdownButton } from 'react-bootstrap'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import logo from './logo.png'

import {Home} from "../Pages/Home"
import {Cistern} from "../Pages/Cistern"
import {Calculator} from "../Pages/Calculator"
import {Park} from "../Pages/Park"
import {CalculatorV2} from "../Pages/CalculatorV2"
import {ParkV2} from "../Pages/ParkV2"
import { StructuralAnalysis } from "../Pages/StructuralAnalysis"
import DropdownItem from "react-bootstrap/esm/DropdownItem"

export default class Header extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.className} >
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
                                
                                <DropdownButton collapseOnSelect expand="md" bg="dark" variant="dark" title="Онлайн калькулятор">
                                    <DropdownItem href="/calculator"> Расчет резервуара </DropdownItem>
                                    <DropdownItem href="/park"> Расчет по парку </DropdownItem>
                                    <DropdownItem href="/calculator_v2"> Оптимальный расчет резервуара </DropdownItem>
                                    <DropdownItem href="/parkv2"> Оптимальный расчет по парку  </DropdownItem>
                                    <DropdownItem href="/structural_analysis"> Расчет конструкции </DropdownItem>
                                </DropdownButton>
                               
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
                        <Route exact path="/calculator_v2" element={<CalculatorV2 containerWidth='1000px'/>} />
                        <Route exact path="/parkv2" element={<ParkV2 containerWidth='1000px'/>} />
                        <Route exact path="/structural_analysis" element={<StructuralAnalysis containerWidth='1200px'/>} />
                    </Routes>
                </Router>
            </div>
        );
    }
}