import React, { Component }  from "react"
import { Button, Container, Form } from "react-bootstrap"

import { CommunicationWithServer } from "../FunctionalClasses/CommunicationWithServer";
import ResultTableMixinEntity from "../Mixins/ResultTableMixinEntity";

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

            if (data != null) {
                this.setState({ productParkId: data[0].productParkId });
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
            this.state.cisternPurposeId
        );

        if (data != null) {
            this.setState({ loadedResult: data});
        }

        this.setState({ resultIsLoading: false });
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
            <Container className="mt-2" style={{ width: '1000px'}}>
                <Container style={{ width: '600px'}}> 
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail"
                        value={this.state.productParkId}
                        onChange={e => this.setState({ productParkId: e.target.value })}>
                        <Form.Label> Товарный парк </Form.Label>
                        <Form.Select disabled={this.state.productParks == null}>
                            {productParksSelect}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-4" controlId="formBasicEmail"
                        value={this.state.tankType}
                        onChange={e => this.setState({ cisternPurposeId: e.target.value })}>
                        <Form.Label>Назначение резервуара</Form.Label>
                        <Form.Select disabled={this.state.CisternPurposes == null}>
                            {CisternPurposesSelect}
                        </Form.Select>
                    </Form.Group>
                    <Button className="mb-3" variant="primary" type="button"
                        disabled={this.state.resultIsLoading || this.state.CisternPurposes == null}
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

Object.assign(Park.prototype, ResultTableMixinEntity);