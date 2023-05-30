import React from "react"
import { Table, Form } from "react-bootstrap"

import { NumToFormatStr, IsNumeric } from "../FunctionalClasses/GeneralFunctions";

export const ResultAreaMixinByGroup = {
    renderResultArea() {
        const columns = ["№ выборки", "Номинальный объем РВС  (отстойников), м³",
            "Необход. кол-во в работе, шт.", "Цена за штуку, руб.",
            "Общая цена, руб.", "Итого цена, руб.",
            "Итого объема, м³"];

        const handleClickForSortingByColumn = (e) => {
            console.log(this.state.loadedResult);
            let columnClickedText = e.target.childNodes[0].data;
            let thIndexInColumns = -1;
            let data = this.state.loadedResult.samples;
            let columnBySorted = this.state.columnBySorted;

            thIndexInColumns = columnClickedText == columns[5]
                ? 5
                : (columnClickedText == columns[6]
                    ? 6
                    : -1);

            if (thIndexInColumns == -1) {
                return;
            }

            // Sorting
            if (columnBySorted[0] == thIndexInColumns && columnBySorted[1] == true) {
                columnBySorted[1] = false;
            }
            else {
                columnBySorted = [thIndexInColumns, true];
            }

            if (columnBySorted[1] == true) {
                if (thIndexInColumns == 5) {
                    data.sort((a, b) => {
                        return parseFloat(a.totalPrice) - parseFloat(b.totalPrice) >= 0 ? 1 : -1;
                    });
                }
                else if (thIndexInColumns == 6) {
                    data.sort((a, b) => {
                        return parseFloat(a.totalVolume) - parseFloat(b.totalVolume) >= 0 ? 1 : -1;
                    });
                }
            }
            else {
                if (thIndexInColumns == 5) {
                    data.sort((a, b) => {
                            return parseFloat(b.totalPrice) - parseFloat(a.totalPrice) >= 0 ? 1 : -1;
                    });
                }
                else if (thIndexInColumns == 6) {
                    data.sort((a, b) => {
                        return parseFloat(b.totalVolume) - parseFloat(a.totalVolume) >= 0 ? 1 : -1;
                    });
                }
            }

            this.setState({
                resultArea: this.renderResultArea(),
                columnBySorted: columnBySorted
            });
        }

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
                        <Form.Label>Время отстоя, хранения, час: {NumToFormatStr(this.state.loadedResult.settlingTimeHour)}</Form.Label>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Требуемая емкость РВС и отстойников, м³: {NumToFormatStr(this.state.loadedResult.requiredVolume)} ({NumToFormatStr(Math.ceil(this.state.loadedResult.requiredVolume / this.state.loadedResult.usefulVolume))})</Form.Label>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Полезный объем (коэф. заполнения): {this.state.loadedResult.usefulVolume}</Form.Label>
                    </Form.Group>
                </Form>

                <Table striped bordred hover>
                    <tbody>
                        <tr>
                            <th style={{ width: '50px' }}>{columns[0]}</th>
                            <th style={{ width: '50px' }}>{columns[1]}</th>
                            <th style={{ width: '50px' }}>{columns[2]}</th>
                            <th style={{ width: '100px' }}>{columns[3]}</th>
                            <th style={{ width: '100px' }}>{columns[4]}</th>
                            <th style={{ width: '100px', cursor: 'pointer' }}
                                onClick={handleClickForSortingByColumn}>{columns[5]}</th>
                            <th style={{ width: '100px', cursor: 'pointer' }}
                                onClick={handleClickForSortingByColumn}>{columns[6]}</th>
                        </tr>
                    </tbody>
                    <tbody>
                        {tdRows(this.state.loadedResult) }
                    </tbody>
                </Table>
            </>
        );
    }
}

export default ResultAreaMixinByGroup;
