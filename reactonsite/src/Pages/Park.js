import React, { Component }  from "react"
import { Button, Container, Form } from "react-bootstrap"
import { Table } from "react-bootstrap"
import { CommunicationWithServer } from "../FunctionalClasses/CommunicationWithServer";

export class Park extends Component {
    constructor(props) {
        super(props);

        this.state = {
            productParkId: null, cisternPurposeId: null,
            loadedResult: null, resultIsLoading: false,
            productParks: null, loadingProductParks: false,
            CisternPurposes: null, loadingCisternPurposes: false
        };
    }

    componentDidMount() {
        this.loadProductParks();
        this.loadCisternPurposes();
    }

    async loadProductParks() {
        this.setState({ loadingProductParks: true });

        const data = await CommunicationWithServer.GetProductParks();

        if (data != null) {
            this.setState({ productParks: data, loadingProductParks: false });

            if (this.state.productParks != null) {
                this.state.productParkId = this.state.productParks[0].productParkId;
            }
        }
        else {
            this.setState({ productParks: null, loadingProductParks: false });
        }
    }

    async loadCisternPurposes() {
        this.setState({ CisternPurposes: null, CisternPurposeId: null, loadingCisternPurposes: true });

        const data = await CommunicationWithServer.GetCisternPurposeList();

        if (data != null) {
            this.setState({ CisternPurposes: data });

            if (this.state.CisternPurposes != null) { // Problem with loading
                this.state.cisternPurposeId = this.state.CisternPurposes[0].purposeCisternId;
            }
        }

        this.setState({ loadingCisternPurposes: false });
    }

    async enterAndLoadServerCalculation() {
        this.setState({ loadedResult: null, resultIsLoading: true });

        const data = await CommunicationWithServer.GetCalculationResultByProductPark(
            this.state.productParkId,
            this.state.cisternPurposeId
        );

        if (data != null) {
            this.setState({ loadedResult: data});
        }

        this.setState({ resultIsLoading: false });
    }

    renderResultTable() {
        const tdRows = (data) => {
            let content = [];
            const rowsCount = data.length;
            let firstRow = true;

            for (let row of data) {
                content.push(
                    <tr>
                        {firstRow ? < td rowSpan={rowsCount}>{row.settlingTimeHour}</td> : null}
                        {firstRow ? <td  rowSpan={rowsCount}>{row.requiredVolume}</td> : null}
                        {firstRow ? <td rowSpan={rowsCount}>{row.usefulVolume}</td> : null}
                        <td>{row.nominalVolume}</td>
                        <td>{row.needCountForWork}</td>
                        <td>{row.cisternPrice}</td>
                        <td>{row.cisternPrice * row.needCountForWork}</td>
                    </tr>);

                firstRow = false;
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
        let CisternPurposesSelect = !this.state.loadingCisternPurposes && this.state.CisternPurposes != null
            ? this.state.CisternPurposes.map(CisternPurpose => <option value={CisternPurpose.purposeCisternId}>{CisternPurpose.name}</option>)
            : null;
        let resultTable = !this.state.resultIsLoading && this.state.loadedResult != null
            ? this.renderResultTable()
            : null;

        const handleClick = () => this.enterAndLoadServerCalculation();

        return (
            <Container style={{ width: '1000px' }}>
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
                        onChange={e => this.setState({ cisternPurposeId: e.target.value })}>
                        <Form.Label>Назначение резервуара</Form.Label>
                        <Form.Select disabled={this.state.CisternPurposes == null}>
                            {CisternPurposesSelect}
                        </Form.Select>
                    </Form.Group>
                    <Button variant="primary" type="button"
                        disabled={this.state.resultIsLoading || this.state.CisternPurposes == null}
                        onClick={!this.state.resultIsLoading ? handleClick : null}>
                        {!this.state.resultIsLoading ? "Вычислить" : "Загружается"}
                    </Button>
                </Form>

                {resultTable}
            </Container>
        )
    }
}