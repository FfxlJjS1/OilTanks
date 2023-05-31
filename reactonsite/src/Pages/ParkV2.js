import React, { Component }  from "react"
import { Button, Container, Form } from "react-bootstrap"

import { CommunicationWithServer } from "../FunctionalClasses/CommunicationWithServer";
import ResultAreaMixinByGroup from "../Mixins/ResultAreaMixinByGroup";

export class ParkV2 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            productParkId: null, cisternPurposeId: null,
            loadedResult: null, resultIsLoading: false,
            productParks: null, loadingProductParks: false,
            cisternPurposes: null, loadingCisternPurposes: false,
            countForCalculate: 20,
            resultArea: null, columnBySorted: [-1, true]
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

            if (data != null) {
                this.setState({ productParkId: data[0].productParkId });
            }
        }
        else {
            this.setState({ productParks: null, loadingProductParks: false });
        }
    }

    async loadCisternPurposes() {
        this.setState({ cisternPurposes: null, cisternPurposeId: null, loadingCisternPurposes: true });

        const data = await CommunicationWithServer.GetCisternPurposeList();

        if (data != null) {
            this.setState({ cisternPurposes: data });

            if (data != null) {
                this.setState({ cisternPurposeId: data[0].purposeCisternId });
            }
        }

        this.setState({ loadingCisternPurposes: false });
    }

    async enterAndLoadServerCalculation() {
        this.setState({ loadedResult: null, resultIsLoading: true });

        const data = await CommunicationWithServer.GetCalculationResultByProductPark(
            this.state.productParkId,
            this.state.cisternPurposeId,
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
        let productParksSelect = !this.state.loadingProductParks && this.state.productParks != null
            ? this.state.productParks.map(productPark =>
                <option value={productPark.productParkId}>{productPark.name}</option>)
            : null;
        let cisternPurposesSelect = !this.state.loadingCisternPurposes && this.state.cisternPurposes != null
            ? this.state.cisternPurposes.map(cisternPurpose => <option value={cisternPurpose.purposeCisternId}>{cisternPurpose.name}</option>)
            : null;

        const handleClick = () => this.enterAndLoadServerCalculation();

        return (
            <Container className="mt-2" style={{ width: this.props.containerWidth }}>
                <Container style={{ width: '600px' }}>
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
                            <Form.Select disabled={this.state.cisternPurposes == null}>
                                {cisternPurposesSelect}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label>Диапазон выборки (полнота вычислений): {this.state.countForCalculate > 0 ? this.state.countForCalculate : "Все (не рекомендуется)"}</Form.Label>
                            <Form.Range defaultValue={this.state.countForCalculate}
                                onChange={e => {
                                    this.setState({ countForCalculate: e.target.value });
                                }}
                            />
                        </Form.Group>
                        <Button className="mt-3 mb-3" variant="primary" type="button"
                            disabled={this.state.resultIsLoading || this.state.cisternPurposes == null}
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

Object.assign(ParkV2.prototype, ResultAreaMixinByGroup);