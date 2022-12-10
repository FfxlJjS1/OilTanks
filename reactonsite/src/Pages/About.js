import React, { Component }  from "react"
import { Button, Container, Form } from "react-bootstrap"
import { Table } from "react-bootstrap"

export class About extends Component {
    constructor(props) {
        super(props);

        this.apiUrl = props.apiUrl;

        this.state = {
            tankType: null, oilType: null, oilValue: 0, waterValue: 0,
            tankTypes: null, loadingTankTypes: false,
            oilTypes: null, loadingOilTypes: false,
            loadedResult: null, resultIsLoading: false
        };
    }

    componentDidMount() {
        this.loadTankTypes();
        this.loadOilTypes();
    }

    async loadTankTypes() {
        this.setState({ tankTypes: null, tankType: null, loadingTankTypes: true });

        const response = await fetch(this.apiUrl + "/TankTypes");

        if (response.ok) {
            const data = await response.json();

            this.setState({ tankTypes: data });

            if (this.state.tankTypes != null) { // Problem with loading
                this.state.tankType = this.state.tankTypes[0];
            }
        }

        this.setState({ loadingTankTypes: false });
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
            "tankType=" + this.state.tankType + "&" +
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
                    </tr>
                </tbody>
                <tbody>
                    {tdRows(this.state.loadedResult)}
                </tbody>
            </Table>
        );
    }

    render() {
        let tankTypesSelect = !this.state.loadingTankTypes && this.state.tankTypes != null
            ? this.state.tankTypes.map(tankType => <option>{tankType}</option>)
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
                        value={this.state.oilType}
                        onChange={e => this.setState({ tankType: e.target.value })}>
                        <Form.Label>Тип резервуара</Form.Label>
                        <Form.Select disabled={this.state.tankTypes == null}>
                            {tankTypesSelect}
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
                            this.state.oilTypes == null || this.state.tankType == null}
                        onClick={!this.state.resultIsLoading ? handleClick : null}>
                        {!this.state.resultIsLoading ? "Вычислить" : "Загружается"}
                    </Button>
                </Form>

                {resultTable}
            </Container>
        )
    }
}