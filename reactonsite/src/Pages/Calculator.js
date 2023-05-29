import React, { Component }  from "react"
import { Button, Container, Form } from "react-bootstrap"

import { CommunicationWithServer } from "../FunctionalClasses/CommunicationWithServer";
import ResultTableMixinEntity from "../Mixins/ResultTableMixinEntity";

export class Calculator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cisternPurposeId: null, oilType: null, oilValue: null, waterValue: null,
            cisternPurposes: null, loadingCisternPurposes: false,
            oilTypes: null, loadingOilTypes: false,
            loadedResult: null, resultIsLoading: false
        };
    }

    componentDidMount() {
        this.loadOilTypes();
    }

    async loadCisternPurposesByOilType(oilType) {
        this.setState({ CisternPurposes: null, cisternPurposeId: null, loadingCisternPurposes: true });

        const data = await CommunicationWithServer.GetCisternPurposesByOilType(oilType);

        if (data != null) {
            this.setState({ cisternPurposes: data });

            if (data != null) {
                this.setState({ cisternPurposeId: data[0].purposeCisternId });
            }
        }

        this.setState({ loadingCisternPurposes: false });
    }

    async loadOilTypes() {
        this.setState({ oilTypes: null, oilType: null, loadingOilTypes: true });

        const data = await CommunicationWithServer.GetOilTypes();

        if (data != null) {
            this.setState({ oilTypes: data });

            if (data != null) {
                this.setState({ oilType: data[0] });
                this.loadCisternPurposesByOilType(data[0]);
            }
        }

        this.setState({ loadingOilTypes: false });
    }

    async enterAndLoadServerCalculation() {
        this.setState({ loadedResult: null, resultIsLoading: true });

        const data = await CommunicationWithServer.GetCalculationResultByArguments(
            this.state.cisternPurposeId,
            this.state.oilType,
            this.state.oilValue,
            this.state.waterValue
        );

        if (data != null) {
            this.setState({ loadedResult: data });
        }

        this.setState({ resultIsLoading: false });
    }

    render() {
        let cisternPurposesSelect = !this.state.loadingCisternPurposes && this.state.cisternPurposes != null && this.state.oilType != null
            ? this.state.cisternPurposes.map(cisternPurpose => <option value={cisternPurpose.purposeCisternId}>{cisternPurpose.name}</option>)
            : null;
        let oilTypesSelect = !this.state.loadingOilTypes && this.state.oilTypes != null
            ? this.state.oilTypes.map(oilType => <option>{oilType}</option>)
            : null;
        let resultTable = !this.state.resultIsLoading && this.state.loadedResult != null
            ? this.renderResultTable()
            : null;

        const handleInputOilValue = (event) => {
            const value = (event.target.validity.valid) ? event.target.value : this.state.oilValue;

            this.setState({ oilValue: value && value > 0 ? parseInt(value) : "" });
        };
        const handleInputWaterValue = (event) => {
            const value = (event.target.validity.valid) ? event.target.value : this.state.waterValue;

            this.setState({ waterValue: value && value > 0 ? parseInt(value) : "" });
        };
        const handleClick = () => this.enterAndLoadServerCalculation();

        return (
            <Container className="mt-2" style={{ width: '1000px' }}>
                <Container style={{ width: '600px' }}>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail"
                            value={this.state.oilType}
                            onChange={e => {
                                this.setState({ oilType: e.target.value });
                                this.loadCisternPurposesByOilType(e.target.value)
                            }}>
                            <Form.Label>Тип нефти</Form.Label>
                            <Form.Select disabled={this.state.oilTypes == null}>
                                {oilTypesSelect}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail"
                            value={this.state.cisternPurposeId}
                            onChange={e => this.setState({ cisternPurposeId: e.target.value })}>
                            <Form.Label>Назначение резервуара</Form.Label>
                            <Form.Select disabled={this.state.cisternPurposes == null}>
                                {cisternPurposesSelect}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Нефть</Form.Label>
                            <Form.Control type="text" placeholder="обьём м³"
                                value={this.state.oilValue}
                                onInput={e => handleInputOilValue(e)}
                                pattern="[0-9]*" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Вода</Form.Label>
                            <Form.Control type="text" placeholder="обьём м³"
                                value={this.state.waterValue}
                                onInput={e => handleInputWaterValue(e)}
                                pattern="[0-9]*"
                            />
                        </Form.Group>

                        <Button className="mt-3" variant="primary" type="button"
                            disabled={this.state.resultIsLoading ||
                                this.state.oilTypes == null || this.state.cisternPurposeId == null
                                || this.state.oilValue <= 0 || this.state.waterValue <= 0}
                            onClick={!this.state.resultIsLoading ? handleClick : null}>
                            {!this.state.resultIsLoading ? "Вычислить" : "Загружается"}
                        </Button>
                    </Form>
                </Container>

                {resultTable}
            </Container>
        )
    }
}

Object.assign(Calculator.prototype, ResultTableMixinEntity);