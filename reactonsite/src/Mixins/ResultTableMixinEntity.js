import React from "react"
import { Table } from "react-bootstrap"

import { NumToFormatStr } from "../FunctionalClasses/GeneralFunctions";

export const ResultTableMixinEntity = {
    renderResultTable() {
        const tdRows = (data) => {
            let content = [];
            const rowsCount = data.tanksRecordGroups.length;
            let firstRow = true;

            let tanksRecordGroups = data.tanksRecordGroups;

            for (let group of tanksRecordGroups) {
                let tanksGroup = group.requiredTanksGroup;

                for (let record of tanksGroup) {
                    content.push(
                        <tr>
                            {firstRow ? < td rowSpan={rowsCount}>{NumToFormatStr(data.settlingTimeHour)}</td> : null}
                            {firstRow ? <td rowSpan={rowsCount}>{NumToFormatStr(data.requiredVolume)}</td> : null}
                            {firstRow ? <td rowSpan={rowsCount}>{NumToFormatStr(data.usefulVolume)}</td> : null}
                            <td>{NumToFormatStr(record.nominalVolume)}</td>
                            <td>{NumToFormatStr(record.needCountForWork)}</td>
                            <td>{NumToFormatStr(record.cisternPrice)}</td>
                            <td>{NumToFormatStr(record.cisternPrice * record.needCountForWork)}</td>
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
                        <th style={{width: '50px'}}>Время отстоя, хранения, час</th>
                        <th style={{width: '50px'}}>Требуемая  емкость РВС и отстойников, м3</th>
                        <th style={{width: '50px'}}>Полезный объем (коэф.заполнения)</th>
                        <th style={{width: '50px'}}>Номинальный объем РВС  (отстойников), м3</th>
                        <th style={{width: '50px'}}>Необход. кол-во в работе, шт.</th>
                        <th style={{width: '100px'}}>Цена за штуку, руб.</th>
                        <th style={{width: '100px'}}>Общая цена, руб.</th>
                    </tr>
                </tbody>
                <tbody>
                    {tdRows(this.state.loadedResult)}
                </tbody>
            </Table>
        );
    }
}

export default ResultTableMixinEntity;
