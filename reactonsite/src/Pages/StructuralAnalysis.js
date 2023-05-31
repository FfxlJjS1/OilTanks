import React, { Component }  from "react"
import { Button, Container, Form, Row, Col } from "react-bootstrap"

import ResultTableMixinShowTable from "../Mixins/ResultTableMixinShowTable";

import { CommunicationWithServer } from "../FunctionalClasses/CommunicationWithServer";

export class StructuralAnalysis extends Component {
    constructor(props) {
        super(props);

        this.state = {
            volumeValue: null, formTypeIndex: null, limites: [1, 20, 1, 30],
            formTypes: null, loadingFormTypes: false,
            loadedResult: null, resultIsLoading: false,
            resultTable: null, columnBySorted: [-1, true],
            descriptioWindows: null
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
                this.setState({ formTypeIndex: data[0].index });
            }
        }

        this.setState({ loadingFormTypes: false });
    }

    async enterAndLoadServerCalculation() {
        this.setState({ loadedResult: null, resultIsLoading: true });

        const data = await CommunicationWithServer.GetStructuralAnalysisResultByForm(
            this.state.volumeValue,
            this.state.formTypeIndex,
            this.state.limites.map(number => String(number)).join(';'),
        );

        if (data != null) {
            this.state.loadedResult = data.entityTable;
        }

        this.state.resultIsLoading = false;

        if (this.state.descriptioWindows != null) {
            const descriptioWindows = this.state.descriptioWindows;

            for (let index = 0; index < descriptioWindows.length; index++) {
                let descriptioWindow = descriptioWindows[index];

                if (descriptioWindow[2] != null) {
                    descriptioWindow[2].close();
                }
            }

            this.state.descriptioWindows = null;
        }

        if (!this.state.resultIsLoading && this.state.loadedResult != null) {
            this.setState({ resultTable: this.renderResultTable() });
        }
        else {
            this.setState({ resultTable: null });
        }
    }

    render() {
        let formTypesSelect = !this.state.loadingFormTypes && this.state.formTypes != null
            ? this.state.formTypes.map(formType => <option value={formType.index}>{formType.name}</option>)
            : null;

        let isCorrentLimitesForRadius = (this.state.limites[0] != "" && this.state.limites[1] != "" && this.state.limites[0] > 0 && this.state.limites[0] < this.state.limites[1]);
        let isCorrentLimitesForParallepiped = (this.state.limites[2] != "" && this.state.limites[3] != "" && this.state.limites[2] > 0 && this.state.limites[2] < this.state.limites[3]);

        let isCorrectLimites = (
            (this.state.formTypeIndex == 0 && isCorrentLimitesForRadius && isCorrentLimitesForParallepiped)
            || (this.state.formTypeIndex == 1 && isCorrentLimitesForRadius)
            || (this.state.formTypeIndex == 2 && isCorrentLimitesForParallepiped));

        const handleInputVolumeValue = (event) => {
            const value = (event.target.validity.valid) && event.target.value < 1000000000 ? event.target.value : this.state.volumeValue;

            this.setState({ volumeValue: value && value > 0 ? parseInt(value) : "" });
        };
        const handleInputLimitValue = (event, index) => {
            const value = (event.target.validity.valid) && event.target.value < 10000000 ? event.target.value : this.state.limites[index];

            let limites = this.state.limites;

            limites[index] = value == "" ? "" : parseInt(value);

            this.setState({ limites: limites });
        };
        const handleClick = () => this.enterAndLoadServerCalculation();

        return (
            <Container className="mt-2" style={{ width: this.props.containerWidth }}>
                <Container style={{ width: '600px' }}>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail"
                            value={this.state.formTypeIndex}>
                            <Form.Label>Выберите форму</Form.Label>
                            <Form.Select disabled={this.state.formTypes == null}
                                onChange={e => this.setState({ formTypeIndex: e.target.value })}>
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

                        {this.state.formTypeIndex == 0 || this.state.formTypeIndex == 1
                            ? <Form.Group>
                                <Form.Label>Диапазон радиуса резервуара (цилиндр)</Form.Label>
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
                                            pattern="[0-9]*" />
                                    </Col>
                                </Form>
                            </Form.Group>
                            : null}

                        {this.state.formTypeIndex == 0 || this.state.formTypeIndex == 2
                            ? <Form.Group>
                                <Form.Label>Диапазон длины (параллепипед)</Form.Label>
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
                                            pattern="[0-9]*" />
                                    </Col>
                                </Form>
                            </Form.Group>
                            : null}

                        <Button className="mb-3" variant="primary" type="button"
                            disabled={this.state.resultIsLoading ||
                                this.state.formTypes == null || this.state.volumeValue <= 0
                                || !isCorrectLimites}
                            onClick={handleClick}>
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