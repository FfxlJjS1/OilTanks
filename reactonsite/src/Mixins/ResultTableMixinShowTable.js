import React from "react"
import { Table, Form } from "react-bootstrap"

import { IsNumeric, NumToFormatStr } from "../FunctionalClasses/GeneralFunctions";

export const ResultTableMixinShowTable = {
    renderResultTable() {
        if (this.state.descriptioWindows == null) {
            this.state.descriptioWindows = []; // [identification, description, window]

        }

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

            const tooltip = row.tooltipInfo;
            let tooltipWindowText = "<!DOCTYPE html>";
            tooltipWindowText += "<Table border=\"2\"  cellpadding=\"7px\">";
            tooltipWindowText += "<tbody>";
            tooltipWindowText += "    <th>Наименование</th>";
            tooltipWindowText += "    <th>Значение</th>";   
            tooltipWindowText += "    <th>Измерения</th>";
            tooltipWindowText += "</tbody>";
            tooltipWindowText += "<tbody>";
            if (tooltip.radius != -1) {
                tooltipWindowText += "<tr>";
                tooltipWindowText += "    <td>Радиус</td>";
                tooltipWindowText += "    <td>" + tooltip.radius + "</td>";
                tooltipWindowText += "    <td>м</td>";
                tooltipWindowText += "</tr>";
            }
            if (tooltip.width != -1) {
                tooltipWindowText += "<tr>";
                tooltipWindowText += "    <td>Длина</td>";
                tooltipWindowText += "    <td>" + tooltip.width + "</td>";
                tooltipWindowText += "    <td>м</td>";
                tooltipWindowText += "</tr>";
            }
            if (tooltip.length != -1) {
                tooltipWindowText += "<tr>";
                tooltipWindowText += "    <td>Ширина</td>";
                tooltipWindowText += "    <td>" + tooltip.length + "</td>";
                tooltipWindowText += "    <td>м</td>";
                tooltipWindowText += "</tr>";
            }
            tooltipWindowText += "<tr>";
            tooltipWindowText += "    <td>Ширина листа металла</td>";
            tooltipWindowText += "    <td>" + tooltip.metalSheetWidth + "</td>";
            tooltipWindowText += "    <td>м</td>";
            tooltipWindowText += "</tr>";
            tooltipWindowText += "<tr>";
            tooltipWindowText += "    <td>Плотность нефти</td>";
            tooltipWindowText += "    <td>" + tooltip.oilDensity + "</td>";
            tooltipWindowText += "    <td>кг/м³</td>";
            tooltipWindowText += "</tr>";
            tooltipWindowText += "<tr>";
            tooltipWindowText += "    <td>Площадь дна</td>";
            tooltipWindowText += "    <td>" + tooltip.bottomArea + "</td>";
            tooltipWindowText += "    <td>м²</td>";
            tooltipWindowText += "</tr>";
            tooltipWindowText += "<tr>";
            tooltipWindowText += "    <td>Площадь стен</td>";
            tooltipWindowText += "    <td>" + tooltip.wallSquire + "</td>";
            tooltipWindowText += "    <td>м²</td>";
            tooltipWindowText += "</tr>";
            tooltipWindowText += "<tr>";
            tooltipWindowText += "    <td>Вес стен</td>";
            tooltipWindowText += "    <td>" + tooltip.wallSteelWeight + "</td>";
            tooltipWindowText += "    <td>кг</td>";
            tooltipWindowText += "</tr>";
            tooltipWindowText += "<tr>";
            tooltipWindowText += "    <td>Вес дна</td>";
            tooltipWindowText += "    <td>" + tooltip.bottomSteelWeight + "</td>";
            tooltipWindowText += "    <td>кг</td>";
            tooltipWindowText += "</tr>";
            tooltipWindowText += "<tr>";
            tooltipWindowText += "    <td>Вес крыши</td>";
            tooltipWindowText += "    <td>" + tooltip.roofSteelWeight + "</td>";
            tooltipWindowText += "    <td>кг</td>";
            tooltipWindowText += "</tr>";
            tooltipWindowText += "<tr>";
            tooltipWindowText += "    <td>Плотность металла</td>";
            tooltipWindowText += "    <td>" + tooltip.metalDensityKgPerCubicMetr + "</td>";
            tooltipWindowText += "    <td>кг/м³</td>";
            tooltipWindowText += "</tr>";
            tooltipWindowText += "<tr>";
            tooltipWindowText += "    <td>Стоимость тонны метала</td>";
            tooltipWindowText += "    <td>" + tooltip.metalCostPeTon + "</td>";
            tooltipWindowText += "    <td>руб.</td>";
            tooltipWindowText += "</tr>";

            // belts
            tooltipWindowText += "<tr>";
            tooltipWindowText += "    <td><strong>Номер пояса</strong></td>";
            tooltipWindowText += "    <td><strong>Толщина</strong></td>";
            tooltipWindowText += "    <td><strong>Измерение</strong></td>";
            tooltipWindowText += "</tr>";

            for (let index = 0; index < tooltip.beltInfos.length; index++) {
                let belt = tooltip.beltInfos[index];

                tooltipWindowText += "<tr>";

                tooltipWindowText += "    <td>№" + belt.beltNumber + "</td>";
                tooltipWindowText += "    <td>" + belt.thickness + "</td>";
                tooltipWindowText += "    <td>м</td>";

                tooltipWindowText += "</tr>";
            }


            tooltipWindowText += "</tbody>";
            tooltipWindowText += "</Table>";


            for (let cell of row.cells) {
                content.push(
                    <td>
                        {cell != "-1" ? NumToFormatStr(cell) : "---"}
                    </td>
                );
            }

            return [tooltipWindowText, content];
        }

        const createNewWindow = (descriptions) => {
            let windowForOpen = window.open("", "", "width=600, height=600");

            windowForOpen.document.write(descriptions);

            return windowForOpen;
        }

        const handleClickForOpenTheDescription = (event) => {
            const identification = event.target.parentElement.attributes.identification.value;

            let findDescriptionWindow = null;

            for (var index = 0; index < this.state.descriptioWindows.length; index++) {
                var descriptionWindow = this.state.descriptioWindows[index];

                if (descriptionWindow[0] == identification) {
                    findDescriptionWindow = descriptionWindow;

                    break;
                }
            }

            if (findDescriptionWindow[2] == null) {
                let windowForOpen = createNewWindow(findDescriptionWindow[1]);

                findDescriptionWindow[2] = windowForOpen;
            }
            else {
                if (findDescriptionWindow[2].closed) {
                    let newWindow = createNewWindow(findDescriptionWindow[1]);

                    findDescriptionWindow[2] = newWindow;
                }
                else {
                    findDescriptionWindow[2].focus();
                }
            }
        }

        return (
            <Table striped bordred hover>
                <tbody>
                    {columnsShowing()}
                </tbody>
                <tbody>
                    {this.state.loadedResult.rows.map(row => {
                        const rowShow = rowShowing(row);
                        const identification = row.identification;
                        let isExists = false;

                        for (var index = 0; index < this.state.descriptioWindows.length; index++) {
                            let descriptionWindow = this.state.descriptioWindows[index];

                            if (descriptionWindow[0] == identification) {
                                isExists = true;

                                break;
                            }
                        }

                        if (!isExists) {
                            this.state.descriptioWindows.push([identification, rowShow[0], null]);
                        }

                        return (
                            <tr identification={identification.toString()} onClick={handleClickForOpenTheDescription}>
                                {rowShow[1]}
                            </tr>
                        );
                    }
                    )}
                </tbody>
            </Table>
        );
    }
}

export default ResultTableMixinShowTable;
