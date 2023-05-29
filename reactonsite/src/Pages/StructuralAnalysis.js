import React, { Component }  from "react"
import { Button, Container, Form, Row, Col } from "react-bootstrap"

import { CommunicationWithServer } from "../FunctionalClasses/CommunicationWithServer";
import ResultTableMixinShowTable from "../Mixins/ResultTableMixinShowTable";

export class StructuralAnalysis extends Component {
    constructor(props) {
        super(props);

        this.state = {
            volumeValue: null, formType: null, limites: [1, 30, 1, 30],
            formTypes: null, loadingFormTypes: false,
            loadedResult: null, resultIsLoading: false,
            resultTable: null, columnBySorted: [-1, true]
        };
    }

    componentDidMount() {
        this.loadFormTypes();
    }

    async loadFormTypes() {
        this.setState({ formTypes: null, formType: null, loadingFromTypes: true });

        const data = await CommunicationWithServer.GetFormTypes();

        if (data != null) {
            this.setState({ formTypes: data });

            if (data != null) {
                this.setState({ formType: data[0] });
            }
        }

        this.setState({ loadingFormTypes: false });
    }

    async enterAndLoadServerCalculation() {
        this.setState({ loadedResult: null, resultIsLoading: true });

        const data = await CommunicationWithServer.GetStructuralAnalysisResultByForm(
            this.state.volumeValue,
            this.state.formType,
            this.state.limites.map(number => String(number)).join(';'),
        );

        if (data != null) {
            this.state.loadedResult = data.entityTable;
        }

        this.state.resultIsLoading = false;

        if (!this.state.resultIsLoading && this.state.loadedResult != null) {
            this.setState({ resultTable: this.renderResultTable() });
        }
        else {
            this.setState({ resultTable: null });
        }
    }

    render() {
        let formTypesSelect = !this.state.loadingFormTypes && this.state.formTypes != null
            ? this.state.formTypes.map(formType => <option>{formType}</option>)
            : null;

        const handleInputVolumeValue = (event) => {
            const value = (event.target.validity.valid) ? event.target.value : this.state.volumeValue;

            this.setState({ volumeValue: value && value > 0 ? parseInt(value) : "" });
        };
        const handleInputLimitValue = (event, index) => {
            const value = (event.target.validity.valid) ? event.target.value : this.state.oilValue;

            let limites = this.state.limites;

            limites[index] =
                index % 2 == 0
                    ? (value && value > 0
                        ? (parseInt(value) < limites[index + 1]
                            ? parseInt(value)
                            : limites[index + 1] - 1)
                        : 1)
                    : (value && value > 0
                        ? (parseInt(value) > limites[index - 1]
                            ? parseInt(value)
                            : limites[index - 1] + 1)
                        : 2);

            this.setState({ limites: limites });
        };
        const handleClick = () => this.enterAndLoadServerCalculation();

        return (
            <Container className="mt-2" style={{ width: this.props.containerWidth }}>
                <Container style={{ width: '600px' }}>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail"
                            value={this.state.formType}>
                            <Form.Label>Выберите форму</Form.Label>
                            <Form.Select disabled={this.state.formTypes == null}
                                onChange={e => this.setState({ formType: e.target.value })}>
                                {formTypesSelect}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Введите объем, м3</Form.Label>
                            <Form.Control type="text" placeholder="обьём м³"
                                value={this.state.volumeValue}
                                onInput={e => handleInputVolumeValue(e)}
                                pattern="[0-9]*" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Радиус резервуара (нижний и верхний предел)</Form.Label>
                            <Form as={Row} className="mb-3">
                                <Col>
                                    <Form.Control type="text"
                                        value={this.state.limites[0]}
                                        onInput={e => handleInputLimitValue(e, 0)}
                                        pattern="[0-9]*" />
                                </Col>
                                <Col>
                                    <Form.Control type="text"
                                        value={this.state.limites[1]}
                                        onInput={e => handleInputLimitValue(e, 1)}
                                        pattern="[0-9]*"
                                    />
                                </Col>
                            </Form>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Ширина стенки (нижний и верхний предел)</Form.Label>
                            <Form as={Row} className="mb-3">
                                <Col>
                                    <Form.Control type="text"
                                        value={this.state.limites[2]}
                                        onInput={e => handleInputLimitValue(e, 2)}
                                        pattern="[0-9]*" />
                                </Col>
                                <Col>
                                    <Form.Control type="text"
                                        value={this.state.limites[3]}
                                        onInput={e => handleInputLimitValue(e, 3)}
                                        pattern="[0-9]*"
                                    />
                                </Col>
                            </Form>
                        </Form.Group>
                        <Button className="mb-3" variant="primary" type="button"
                            disabled={this.state.resultIsLoading ||
                                this.state.formTypes == null || this.state.volumeValue <= 0}
                            onClick={!this.state.resultIsLoading ? handleClick : null}>
                            {!this.state.resultIsLoading ? "Вычислить" : "Загружается"}
                        </Button>
                    </Form>
                </Container>

                {this.state.resultTable}
            </Container>
        )
    }
}

Object.assign(StructuralAnalysis.prototype, ResultTableMixinShowTable);