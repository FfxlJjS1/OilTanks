import React, { Component }  from "react"
import { Button, Container, Form } from "react-bootstrap"
import { Table } from "react-bootstrap"


export class About extends Component {
    constructor(props) {
        super(props);

        this.apiUrl = props.apiUrl;

        this.state = {
            oilValue: 0, waterValue: 0, oilType: null,
            loadedResult: null, resultIsLoading: false,
            oilTypes: null, loadingOilTypes: false
        };
    }

    componentDidMount() {
        this.loadOilTypes();
    }

    async loadOilTypes() {
        this.setState({ loadingOilTypes: true });

        const response = await fetch(this.apiUrl + "/OilTypes");

        if (response.ok) {
            const data = await response.json();

            this.setState({ oilTypes: data, loadingOilTypes: false });

            if (this.state.oilTypes != null) {
                this.state.oilType = this.state.oilTypes[0];
            }
        }
        else {
            this.setState({ oilTypes: null, loadingOilTypes: false });
        }
    }

    async enterAndLoadServerCalculation() {
        this.setState({ resultIsLoading: true });

        const response = await fetch(this.apiUrl + "?" +
            "oilType=" + this.state.oilType + "&" +
            "oilValue=" + this.state.oilValue + "&" +
            "waterValue=" + this.state.waterValue);

        if (response.ok) {
            const data = await response.json();

            this.setState({ loadedResult: data, resultIsLoading: false });
        }
        else {
            this.setState({ loadedResult: null, resultIsLoading: false });
        }
    }

    renderResultTable() {
        const storageTanksDestinationArr = Object.keys(this.state.loadedResult);

        const tdRows = (storageTanksDestinationArr, data) => {
            let content = [];

            for (let key of storageTanksDestinationArr) {
                let firstRow = true;
                const currentTankData = data[key];
                const rowsCount = currentTankData.length;

                for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
                    const currentRow = currentTankData[rowIndex];

                    content.push(
                        <tr>
                            {firstRow ? <td rowSpan={rowsCount}>{key}</td> : null}
                            <td>{currentRow.settlingTimeHour}</td>
                            <td>{currentRow.requiredVolume}</td>
                            <td>{currentRow.usefulVolume}</td>
                            <td>{currentRow.nominalVolume}</td>
                            <td>{currentRow.needCountForWork}</td>
                        </tr>);

                    firstRow = false;
                }
            }

            return content;
        }

        return (
            <Table striped bordred hover>
                <tbody>
                    <tr>
                        <th>Назначение резервуара (отстойника)</th>
                        <th>Время отстоя, хранения, час</th>
                        <th>Требуемая  емкость РВС и отстойников, м3</th>
                        <th>Полезный объем (коэф.заполнения)</th>
                        <th>Номинальный объем РВС  (отстойников), м3</th>
                        <th>Необход. кол-во в работе, шт.</th>
                    </tr>
                </tbody>
                <tbody>
                    {tdRows(storageTanksDestinationArr, this.state.loadedResult)}
                </tbody>
            </Table>
        );
    }

    render() {
        let resultTable = !this.state.resultIsLoading && this.state.loadedResult != null
            ? this.renderResultTable()
            : null;
        let oilTypesSelect = !this.state.loadingOilTypes && this.state.oilTypes != null
            ? this.state.oilTypes.map(oilType => <option>{oilType}</option>)
            : null;

        const handleClick = () => this.enterAndLoadServerCalculation();

        return (
            <Container style={{ widrh: '500px' }}>
                <h2 className="text-center"> Введите данные </h2>
                <Form>
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
                        disabled={this.state.resultIsLoading || this.state.oilTypes == null}
                        onClick={!this.state.resultIsLoading ? handleClick : null}>
                        {!this.state.resultIsLoading ? "Вычислить" : "Загружается"}
                    </Button>
                </Form>

                {resultTable}
            </Container>
        )
    }
}