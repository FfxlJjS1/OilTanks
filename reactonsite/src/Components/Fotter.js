import React from "react"
import { Container } from "react-bootstrap"

 const Fotter = () => (
    <Container className="flex-column" fluid style={{ backgroundColor: '#212529', color: '#fff'}}>
        <Container style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
            <p>Веб приложение было разработано в ходе практики</p>
        </Container>
    </Container>
)
export default Fotter;