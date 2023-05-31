import React from "react"
import { Table, Form } from "react-bootstrap"

import {TooltipTr} from "../Components/Tooltip/Tooltip"
import { IsNumeric, NumToFormatStr } from "../FunctionalClasses/GeneralFunctions";

export const ResultTableMixinShowTable = {
    renderResultTable() {
        this.state.updateAfterSorting = false;

        const handleClickForSortingByColumn = (e) => {
            let columnClickedText = e.target.childNodes[0].data;
            let thIndexInColumns = -1;
            let data = this.state.loadedResult;
            let columnBySorted = this.state.columnBySorted;

            for (var index = 0; index < data.columns.length; index++) {
                const columnByIndex = data.columns[index];
                const columnTextByIndex = columnByIndex.name;

                if (columnTextByIndex == columnClickedText) {
                    thIndexInColumns = index;

                    break;
                }
            }

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
                data.rows.sort((a, b) => {
                    if (IsNumeric(a.cells[thIndexInColumns]) && IsNumeric(b.cells[thIndexInColumns])) {
                        return parseFloat(a.cells[thIndexInColumns]) - parseFloat(b.cells[thIndexInColumns]) >= 0 ? 1 : -1;
                    }
                    else {
                        return a.cells[thIndexInColumns] > b.cells[thIndexInColumns] ? 1 : -1;
                    }
                });
            }
            else {
                data.rows.sort((a, b) => {
                    if (IsNumeric(a.cells[thIndexInColumns]) && IsNumeric(b.cells[thIndexInColumns])) {
                        return parseFloat(b.cells[thIndexInColumns]) - parseFloat(a.cells[thIndexInColumns]) >= 0 ? 1 : -1;
                    }
                    else {
                        return a.cells[thIndexInColumns] < b.cells[thIndexInColumns] ? 1 : -1;
                    }
                });
            }

            this.setState({
                resultTable: this.renderResultTable(),
                columnBySorted: columnBySorted
            });
        }

        const columnsShowing = () => (
            <tr>
                {this.state.loadedResult.columns.map((column) =>
                    <th
                        style={{
                            width: column.width,
                            cursor: 'pointer'
                        }}
                        onClick={handleClickForSortingByColumn}
                    >{column.name}</th>
                )}
            </tr>);

        const rowShowing = (row) => {
            let content = [];

            //console.log(row);

            const tooltip = row.tooltipInfo;
            let tooltipText = "Ширина листа металла: " + tooltip.metalSheetWidth + "\n";
            tooltipText += "Плотность нефти: " + tooltip.oilDensity + "\n";

            // belts
            tooltipText += tooltip.beltInfos.map((belt) => "Пояс №" + belt.beltNumber + ": " + belt.thickness + "\n").join("");

            tooltipText += "Площадь дна: " + tooltip.bottomArea + "\n";
            tooltipText += "Площадь стен: " + tooltip.wallSquire + "\n";
            tooltipText += "Вес стен: " + tooltip.wallSteelWeight + "\n";
            tooltipText += "Вес дна: " + tooltip.bottomSteelWeight + "\n";
            tooltipText += "Вес крыши: " + tooltip.roofSteelWeight + "\n";
            tooltipText += "Плотность металла: " + tooltip.metalDensityKgPerCubicMetr + "\n";
            tooltipText += "Стоимость тонны метала: " + tooltip.metalCostPerTon + "\n";

            console.log(tooltipText);

            for (let cell of row.cells) {
                content.push(
                    <td>
                        {cell != "-1" ? NumToFormatStr(cell) : "---"}
                    </td>
                );
            }

            return [tooltipText, content];
        }

        return (
            <>
                <Table striped bordred hover>
                    <tbody>
                        {columnsShowing()}
                    </tbody>
                    <tbody>
                        {this.state.loadedResult.rows.map(row => {
                            const res = rowShowing(row);

                            return (
                                <TooltipTr position="right"
                                    tooltipText={res[0]}>
                                    {res[1]}
                                </TooltipTr>);
                        })}
                    </tbody>
                </Table>
            </>
        );
    }
}

export default ResultTableMixinShowTable;
