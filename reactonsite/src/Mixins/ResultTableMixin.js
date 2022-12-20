import React from "react"
import { Table } from "react-bootstrap"

import { NumToFormatStr } from "../FunctionalClasses/GeneralFunctions";

export const ResultTableMixin = {
    renderResultTable() {
        const tdRows = (data) => {
            let content = [];
            const rowsCount = data.length;
            let firstRow = true;

            for (let row of data) {
                content.push(
                    <tr>
                        {firstRow ? < td rowSpan={rowsCount}>{NumToFormatStr(row.settlingTimeHour)}</td> : null}
                        {firstRow ? <td rowSpan={rowsCount}>{NumToFormatStr(row.requiredVolume)}</td> : null}
                        {firstRow ? <td rowSpan={rowsCount}>{NumToFormatStr(row.usefulVolume)}</td> : null}
                        <td>{NumToFormatStr(row.nominalVolume)}</td>
                        <td>{NumToFormatStr(row.needCountForWork)}</td>
                        <td>{NumToFormatStr(row.cisternPrice)}</td>
                        <td>{NumToFormatStr(row.cisternPrice * row.needCountForWork)}</td>
                    </tr>);

                firstRow = false;
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

export default ResultTableMixin;
