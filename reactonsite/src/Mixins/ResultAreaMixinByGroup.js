import React from "react"
import { Table, Form } from "react-bootstrap"

import { NumToFormatStr } from "../FunctionalClasses/GeneralFunctions";

export const ResultAreaMixinByGroup = {
    renderResultArea() {
        const tdRows = (data) => {
            let content = [];
            let num = 1;

            let tanksRecordGroups = data.tanksRecordGroups;

            for (let group of tanksRecordGroups) {
                let tanksGroup = group.requiredTanksGroup;
                const currentNum = num;
                const recordsCount = tanksGroup.length;
                let generalPrice = 0;
                let firstRecord = true;

                for (let record of tanksGroup) {
                    generalPrice += record.cisternPrice * record.needCountForWork;
                }

                for (let record of tanksGroup) {
                    content.push(
                        <tr>
                            {firstRecord ? <td rowSpan={recordsCount}>{currentNum}</td> : null}
                            <td>{NumToFormatStr(record.nominalVolume)}</td>
                            <td>{NumToFormatStr(record.needCountForWork)}</td>
                            <td>{NumToFormatStr(record.cisternPrice)}</td>
                            <td>{NumToFormatStr(record.cisternPrice * record.needCountForWork)}</td>
                            {firstRecord ? <td rowSpan={recordsCount}>{generalPrice}</td> : null}
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
                        <Form.Label>Время отстоя, хранения, час: {this.state.loadedResult.settlingTimeHour }</Form.Label>
                        <Form.Label>Требуемая емкость РВС и отстойников, м³: {this.state.loadedResult.requiredVolume }</Form.Label>
                        <Form.Label>Полезный объем (коэф. заполнения): {this.state.loadedResult.usefulVolume }</Form.Label>
                    </Form.Group>
                </Form>

                <Table striped bordred hover>
                    <tbody>
                        <tr>
                            <th style={{ width: '50px' }}>№ выборки</th>
                            <th style={{ width: '50px' }}>Номинальный объем РВС  (отстойников), м3</th>
                            <th style={{ width: '50px' }}>Необход. кол-во в работе, шт.</th>
                            <th style={{ width: '100px' }}>Цена за штуку, руб.</th>
                            <th style={{ width: '100px' }}>Общая цена, руб.</th>
                            <th style={{ width: '100px' }}>Итого цена, руб.</th>
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
