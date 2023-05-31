import React from "react"
import { Container } from "react-bootstrap"

import { Tooltip } from "./Tooltip/Tooltip"

const Fotter = (props) => (
    <Container className={props.className} fluid>
        <Container className="footer-container">
            <p>Веб-приложение было разработано в ходе практики</p>
        </Container>
    </Container>
)

export default Fotter;