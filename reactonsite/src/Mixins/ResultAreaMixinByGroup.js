import React from "react"
import { Table, Form } from "react-bootstrap"

import { NumToFormatStr } from "../FunctionalClasses/GeneralFunctions";

export const ResultAreaMixinByGroup = {
    renderResultArea() {
        const tdRows = (data) => {
            let content = [];
            let num = 1;

            let samples = data.samples;

            for (let sample of samples) {
                let cisternRecords = sample.selectCisternRecords;
                const recordsCount = cisternRecords.length;
                let totalPrice = 0, totalVolume = 0;
                let firstRecord = true;

                for (let record of cisternRecords) {
                    totalPrice += record.cistern.cisternPrice * record.cisternsNumber;
                    totalVolume += record.cistern.nominalVolume * record.cisternsNumber;
                }

                for (let record of cisternRecords) {
                    content.push(
                        <tr>
                            {firstRecord ? <td rowSpan={NumToFormatStr(recordsCount)}>{num}</td> : null}
                            <td>{NumToFormatStr(record.cistern.nominalVolume)}</td>
                            <td>{NumToFormatStr(record.cisternsNumber)}</td>
                            <td>{NumToFormatStr(record.cistern.cisternPrice)}</td>
                            <td>{NumToFormatStr(record.cistern.cisternPrice * record.cisternsNumber)}</td>
                            {firstRecord ? <td rowSpan={recordsCount}>{NumToFormatStr(totalPrice)}</td> : null}
                            {firstRecord ? <td rowSpan={recordsCount}>{NumToFormatStr(totalVolume)}</td> : null}
                        </tr>);

                    firstRecord = false;
                }

                num += 1;
            }

            return content;
        }

        return (
            <>
                <Form>
                    <Form.Group>
                        <Form.Label>Время отстоя, хранения, час: {NumToFormatStr(this.state.loadedResult.settlingTimeHour) }</Form.Label>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Требуемая емкость РВС и отстойников, м³: {NumToFormatStr(this.state.loadedResult.requiredVolume)} ({NumToFormatStr(Math.ceil(this.state.loadedResult.requiredVolume / this.state.loadedResult.usefulVolume ))})</Form.Label>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Полезный объем (коэф. заполнения): {this.state.loadedResult.usefulVolume }</Form.Label>
                    </Form.Group>
                </Form>

                <Table striped bordred hover>
                    <tbody>
                        <tr>
                            <th style={{ width: '50px' }}>№ выборки</th>
                            <th style={{ width: '50px' }}>Номинальный объем РВС  (отстойников), м³</th>
                            <th style={{ width: '50px' }}>Необход. кол-во в работе, шт.</th>
                            <th style={{ width: '100px' }}>Цена за штуку, руб.</th>
                            <th style={{ width: '100px' }}>Общая цена, руб.</th>
                            <th style={{ width: '100px' }}>Итого цена, руб.</th>
                            <th style={{ width: '100px' }}>Итого объема, м³</th>
                        </tr>
                    </tbody>
                    <tbody>
                        {tdRows(this.state.loadedResult)}
                    </tbody>
                </Table>
            </>
        );
    }
}

export default ResultAreaMixinByGroup;
