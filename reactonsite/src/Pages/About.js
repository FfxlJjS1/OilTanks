import React, { Component }  from "react"
import { Button, Container, Form } from "react-bootstrap"
import { Table } from "react-bootstrap"

export class About extends Component {
    constructor(props) {
        super(props);

        this.apiUrl = props.apiUrl;

        this.state = {
            purposeCisternId: null, oilType: null, oilValue: 0, waterValue: 0,
            purposeCisterns: null, loadingPurposeCisterns: false,
            oilTypes: null, loadingOilTypes: false,
            loadedResult: null, resultIsLoading: false
        };
    }

    componentDidMount() {
        this.loadPurposeCisterns();
        this.loadOilTypes();
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

    async loadOilTypes() {
        this.setState({ oilTypes: null, oilType: null, loadingOilTypes: true });

        const response = await fetch(this.apiUrl + "/OilTypes");

        if (response.ok) {
            const data = await response.json();

            this.setState({ oilTypes: data });

            if (this.state.oilTypes != null) { // Problem with loading
                this.state.oilType = this.state.oilTypes[0];
            }
        }

        this.setState({ loadingOilTypes: false });
    }

    async enterAndLoadServerCalculation() {
        this.setState({ loadedResult: null, resultIsLoading: true });

        const response = await fetch(this.apiUrl + "/CalculateByValues?" +
            "purposeCisternId=" + this.state.purposeCisternId + "&" +
            "oilType=" + this.state.oilType + "&" +
            "oilValue=" + this.state.oilValue + "&" +
            "waterValue=" + this.state.waterValue);

        if (response.ok) {
            const data = await response.json();

            this.setState({ loadedResult: data });
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
        let purposeCisternsSelect = !this.state.loadingPurposeCisterns && this.state.purposeCisterns != null
            ? this.state.purposeCisterns.map(purposeCistern => <option value={purposeCistern.purposeCisternId }>{purposeCistern.name}</option>)
            : null;
        let oilTypesSelect = !this.state.loadingOilTypes && this.state.oilTypes != null
            ? this.state.oilTypes.map(oilType => <option>{oilType}</option>)
            : null;
        let resultTable = !this.state.resultIsLoading && this.state.loadedResult != null
            ? this.renderResultTable()
            : null;

        const handleClick = () => this.enterAndLoadServerCalculation();

        return (
            <Container style={{ width: '500px' }}>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail"
                        value={this.state.purposeCisternId}
                        onChange={e => this.setState({ purposeCisternId: e.target.value })}>
                        <Form.Label>Тип резервуара</Form.Label>
                        <Form.Select disabled={this.state.purposeCisterns == null}>
                            {purposeCisternsSelect}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail"
                        value={this.state.oilType}
                        onChange={e => this.setState({ oilType: e.target.value })}>
                        <Form.Label>Тип нефти</Form.Label>
                        <Form.Select disabled={this.state.oilTypes == null}>
                            {oilTypesSelect}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Нефть</Form.Label>
                        <Form.Control type="text" placeholder="обьём м³"
                            value={this.state.oilValue}
                            onChange={e => this.setState({ oilValue: e.target.value })} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Вода</Form.Label>
                        <Form.Control type="text" placeholder="обьём м³"
                            value={this.state.waterValue}
                            onChange={e => this.setState({ waterValue: e.target.value })} />
                    </Form.Group>
                    <Button variant="primary" type="button"
                        disabled={this.state.resultIsLoading ||
                            this.state.oilTypes == null || this.state.purposeCisternId == null}
                        onClick={!this.state.resultIsLoading ? handleClick : null}>
                        {!this.state.resultIsLoading ? "Вычислить" : "Загружается"}
                    </Button>
                </Form>

                {resultTable}
            </Container>
        )
    }
}