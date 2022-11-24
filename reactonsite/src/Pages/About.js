import React, { Component }  from "react"
import { Button, Container, Form } from "react-bootstrap"
import { Table } from "react-bootstrap"


export class About extends Component{
    render(){
        return (
            <Container style={{widrh: '500px'}}>
                <h2 className="text-center"> Введите данные </h2>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Нефть</Form.Label>
                        <Form.Control type="email" placeholder="обьём м³" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Вода</Form.Label>
                        <Form.Control type="email" placeholder="обьём м³" />
                    </Form.Group>
                    <Button variant="primary" type="submit">Подробнее</Button>
                </Form>

                <Table striped bordred hover>
                    <tbody>
                        <tr>
                            <th>№</th>
                            <th>Название объекта</th>
                            <th>Продукция  скважин</th>
                            <th>Кол-во, т/сутки</th>
                            <th>Назначение резервуара (отстойника)</th>
                            <th>Время отстоя, хранения, час</th>
                            <th>Требуемая  емкость РВС и отстойников, м3</th>
                            <th>Полезный объем (коэф.заполнения)</th>
                            <th>Номинальный объем РВС  (отстойников), м3</th>
                            <th>Полезный объем (коэф.заполнения)</th>
                            <th>Необход. кол-во в работе, шт.</th>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>2</td>
                            <td>3</td>
                            <td>4</td>
                            <td>5</td>
                            <td>6</td>
                            <td>7</td>
                            <td>8</td>
                            <td>9</td>
                            <td>10</td>
                            <td>11</td>
                        </tr>
                    </tbody>
                </Table>
            </Container>
        ) 
    }
}