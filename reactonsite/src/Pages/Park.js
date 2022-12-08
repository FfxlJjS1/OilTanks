import React, { Component }  from "react"
import { Button, Container, Form } from "react-bootstrap"
import { Table } from "react-bootstrap"


export class Park extends Component {
    constructor(props) {
        super(props);

        this.apiUrl = props.apiUrl;

        this.state = {
            commodityParkId: null, tankType: null,
            loadedResult: null, resultIsLoading: false,
            commodityParks: null, loadingCommodityParks: false,
            tankTypes: null, loadingTankTypes: false
        };
    }

    componentDidMount() {
        this.loadCommodityPark();
        this.loadTankTypes();
    }

    async loadCommodityPark() {
        this.setState({ loadingCommodityParks: true });

        const response = await fetch(this.apiUrl + "/CommodityParks");

        if (response.ok) {
            const data = await response.json();

            this.setState({ commodityParks: data, loadingCommodityParks: false });

            if (this.state.commodityParks != null) {
                this.state.commodityParkId = this.state.commodityParks[0].tovpId;
            }
        }
        else {
            this.setState({ commodityParks: null, loadingCommodityParks: false });
        }
    }

    async loadTankTypes() {
        this.setState({ loadingOilTypes: true });

        const response = await fetch(this.apiUrl + "/TankTypes");

        if (response.ok) {
            const data = await response.json();

            this.setState({ tankTypes: data, loadingTankTypes: false });

            if (this.state.tankTypes != null) {
                this.state.tankType = this.state.tankTypes[0];
            }
        }
        else {
            this.setState({ tankTypes: null, loadingTankTypes: false });
        }
    }

    async enterAndLoadServerCalculation() {
        this.setState({ resultIsLoading: true });

        const response = await fetch(this.apiUrl + "/CalculateByCommodityPark?" +
            "commodityParkId=" + this.state.commodityParkId + "&" +
            "tankType=" + this.state.tankType);

        if (response.ok) {
            const data = await response.json();

            this.setState({ loadedResult: data, resultIsLoading: false });
        }
        else {
            this.setState({ loadedResult: null, resultIsLoading: false });
        }
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
        let commodityParksSelect = !this.state.loadingCommodityParks && this.state.commodityParks != null
            ? this.state.commodityParks.map(commodityPark =>
                <option value={commodityPark.tovpId}>{commodityPark.name}</option>)
            : null;
        let tankTypesSelect = !this.state.loadingTankTypes && this.state.tankTypes != null
            ? this.state.tankTypes.map(tankType => <option>{tankType}</option>)
            : null;
        let resultTable = !this.state.resultIsLoading && this.state.loadedResult != null
            ? this.renderResultTable()
            : null;

        const handleClick = () => this.enterAndLoadServerCalculation();

        return (
            <Container style={{ width: '500px' }}>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail"
                        value={this.state.commodityParkId}
                        onChange={e => this.setState({ commodityParkId: e.target.value })}>
                        <Form.Label> Товарный парк </Form.Label>
                        <Form.Select disabled={this.state.commodityParks == null}>
                            {commodityParksSelect}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail"
                        value={this.state.tankType}
                        onChange={e => this.setState({ tankType: e.target.value })}>
                        <Form.Label>Тип резервуара</Form.Label>
                        <Form.Select disabled={this.state.tankTypes == null}>
                            {tankTypesSelect}
                        </Form.Select>
                    </Form.Group>
                    <Button variant="primary" type="button"
                        disabled={this.state.resultIsLoading || this.state.tankTypes == null}
                        onClick={!this.state.resultIsLoading ? handleClick : null}>
                        {!this.state.resultIsLoading ? "Подробнее" : "Загружается"}
                    </Button>
                </Form>

                {resultTable}
            </Container>
        )
    }
}