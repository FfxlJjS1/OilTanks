import React, { Component }  from "react"
import { Button, Container, Form } from "react-bootstrap"
import { Table } from "react-bootstrap"


export class Park extends Component {
    constructor(props) {
        super(props);

        this.apiUrl = props.apiUrl;

        this.state = {
            productParkId: null, purposeCisternId: null,
            loadedResult: null, resultIsLoading: false,
            productParks: null, loadingProductParks: false,
            purposeCisterns: null, loadingPurposeCisterns: false
        };
    }

    componentDidMount() {
        this.loadProductParks();
        this.loadPurposeCisterns();
    }

    async loadProductParks() {
        this.setState({ loadingProductParks: true });

        const response = await fetch(this.apiUrl + "/ProductParks");

        if (response.ok) {
            const data = await response.json();

            this.setState({ productParks: data, loadingProductParks: false });

            if (this.state.productParks != null) {
                this.state.productParkId = this.state.productParks[0].productParkId;
            }
        }
        else {
            this.setState({ productParks: null, loadingProductParks: false });
        }
    }

    async loadPurposeCisterns() {
        this.setState({ purposeCisterns: null, purposeCisternId: null, loadingPurposeCisterns: true });

        const response = await fetch(this.apiUrl + "/PurposeCisterns");

        if (response.ok) {
            const data = await response.json();

            this.setState({ purposeCisterns: data });

            if (this.state.purposeCisterns != null) { // Problem with loading
                this.state.purposeCisternId = this.state.purposeCisterns[0].purposeCisternId;
            }
        }

        this.setState({ loadingPurposeCisterns: false });
    }

    async enterAndLoadServerCalculation() {
        this.setState({ loadedResult: null, resultIsLoading: true });

        const response = await fetch(this.apiUrl + "/CalculateByProductPark?" +
            "productParkId=" + this.state.productParkId + "&" +
            "purposeCisternId=" + this.state.purposeCisternId);

        if (response.ok) {
            const data = await response.json();

            this.setState({ loadedResult: data});
        }

        this.setState({ resultIsLoading: false });
    }

    renderResultTable() {
        const tdRows = (data) => {
            let content = [];

            for (let row of data) {
                content.push(
                    <tr>
                        <td>{row.settlingTimeHour}</td>
                        <td>{row.requiredVolume}</td>
                        <td>{row.usefulVolume}</td>
                        <td>{row.nominalVolume}</td>
                        <td>{row.needCountForWork}</td>
                        <td>{row.cisternPrice}</td>
                        <td>{row.cisternPrice * row.needCountForWork}</td>
                    </tr>);
            }

            return content;
        }

        return (
            <Table striped bordred hover>
                <tbody>
                    <tr>
                        <th>Время отстоя, хранения, час</th>
                        <th>Требуемая  емкость РВС и отстойников, м3</th>
                        <th>Полезный объем (коэф.заполнения)</th>
                        <th>Номинальный объем РВС  (отстойников), м3</th>
                        <th>Необход. кол-во в работе, шт.</th>
                        <th>Цена за штуку, руб.</th>
                        <th>Общая цена, руб.</th>
                    </tr>
                </tbody>
                <tbody>
                    {tdRows(this.state.loadedResult)}
                </tbody>
            </Table>
        );
    }

    render() {
        let productParksSelect = !this.state.loadingProductParks && this.state.productParks != null
            ? this.state.productParks.map(productPark =>
                <option value={productPark.productParkId}>{productPark.name}</option>)
            : null;
        let purposeCisternsSelect = !this.state.loadingPurposeCisterns && this.state.purposeCisterns != null
            ? this.state.purposeCisterns.map(purposeCistern => <option value={purposeCistern.purposeCisternId}>{purposeCistern.name}</option>)
            : null;
        let resultTable = !this.state.resultIsLoading && this.state.loadedResult != null
            ? this.renderResultTable()
            : null;

        const handleClick = () => this.enterAndLoadServerCalculation();

        return (
            <Container style={{ width: '500px' }}>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail"
                        value={this.state.productParkId}
                        onChange={e => this.setState({ productParkId: e.target.value })}>
                        <Form.Label> Товарный парк </Form.Label>
                        <Form.Select disabled={this.state.productParks == null}>
                            {productParksSelect}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail"
                        value={this.state.tankType}
                        onChange={e => this.setState({ purposeCisternId: e.target.value })}>
                        <Form.Label>Тип резервуара</Form.Label>
                        <Form.Select disabled={this.state.purposeCisterns == null}>
                            {purposeCisternsSelect}
                        </Form.Select>
                    </Form.Group>
                    <Button variant="primary" type="button"
                        disabled={this.state.resultIsLoading || this.state.purposeCisterns == null}
                        onClick={!this.state.resultIsLoading ? handleClick : null}>
                        {!this.state.resultIsLoading ? "Вычислить" : "Загружается"}
                    </Button>
                </Form>

                {resultTable}
            </Container>
        )
    }
}