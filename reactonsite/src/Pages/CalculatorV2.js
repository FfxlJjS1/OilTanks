import React, { Component }  from "react"
import { Button, Container, Form, Row, Col } from "react-bootstrap"

import { CommunicationWithServer } from "../FunctionalClasses/CommunicationWithServer";
import ResultAreaMixinByGroup from "../Mixins/ResultAreaMixinByGroup";

export class CalculatorV2 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cisternPurposeId: null, oilType: null, oilValue: null, waterValue: null,
            cisternPurposes: null, loadingCisternPurposes: false,
            oilTypes: null, loadingOilTypes: false, countForCalculate: 20,
            loadedResult: null, resultIsLoading: false,
            resultArea: null, columnBySorted: [-1, true]
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
            this.state.waterValue,
            true,
            this.state.countForCalculate
        );

        if (data != null) {
            this.state.loadedResult = data;
        }

        this.state.resultIsLoading = false;

        if (!this.state.resultIsLoading && this.state.loadedResult != null) {
            this.setState({ resultArea: this.renderResultArea() });
        }
        else {
            this.setState({ resultArea: null });
        }
    }

    render() {
        let cisternPurposesSelect = !this.state.loadingCisternPurposes && this.state.cisternPurposes != null && this.state.oilType != null
            ? this.state.cisternPurposes.map(cisternPurpose => <option value={cisternPurpose.purposeCisternId}>{cisternPurpose.name}</option>)
            : null;
        let oilTypesSelect = !this.state.loadingOilTypes && this.state.oilTypes != null
            ? this.state.oilTypes.map(oilType => <option>{oilType}</option>)
            : null;

        const handleInputOilValue = (event) => {
            const value = (event.target.validity.valid) && event.target.value < 100000000000 ? event.target.value : this.state.oilValue;

            this.setState({ oilValue: value && value > 0 ? parseInt(value) : "" });
        };
        const handleInputWaterValue = (event) => {
            const value = (event.target.validity.valid) && event.target.value < 100000000000 ? event.target.value : this.state.waterValue;

            this.setState({ waterValue: value && value > 0 ? parseInt(value) : "" });
        };
        const handleClick = () => this.enterAndLoadServerCalculation();

        return (
            <Container className="mt-2" style={{ width: this.props.containerWidth }}>
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
                        <Form as={Row} className="mb-3">
                            <Col>
                                <Form.Label>Нефть</Form.Label>
                                <Form.Control type="text" placeholder="обьём м³"
                                    value={this.state.oilValue}
                                    onInput={e => handleInputOilValue(e)}
                                    pattern="[0-9]*" />
                            </Col>
                            <Col>
                                <Form.Label>Вода</Form.Label>
                                <Form.Control type="text" placeholder="обьём м³"
                                    value={this.state.waterValue}
                                    onInput={e => handleInputWaterValue(e)}
                                    pattern="[0-9]*"
                                />
                            </Col>
                        </Form>
                        <Form.Group>
                            <Form.Label>Диапазон выборки (полнота вычислений): {this.state.countForCalculate > 0 ? this.state.countForCalculate : "Все (не рекомендуется)"}</Form.Label>
                            <Form.Range defaultValue={this.state.countForCalculate}
                                onChange={e => {
                                    this.setState({ countForCalculate: e.target.value });
                                }}
                            />
                        </Form.Group>
                        <Button className="mt-3 mb-3" variant="primary" type="button"
                            disabled={this.state.resultIsLoading ||
                                this.state.oilTypes == null || this.state.cisternPurposeId == null
                                || this.state.oilValue <= 0 || this.state.waterValue <= 0}
                            onClick={!this.state.resultIsLoading ? handleClick : null}>
                            {!this.state.resultIsLoading ? "Вычислить" : "Загружается"}
                        </Button>
                    </Form>
                </Container>

                {this.state.resultArea}
            </Container>
        )
    }
}

Object.assign(CalculatorV2.prototype, ResultAreaMixinByGroup);