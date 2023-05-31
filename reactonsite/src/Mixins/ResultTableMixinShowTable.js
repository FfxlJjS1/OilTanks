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
            tooltipWindowText += tooltip.radius != -1 ? "Радиус: " + tooltip.radius + " м<br/>" : "";
            tooltipWindowText += "Ширина листа металла: " + tooltip.metalSheetWidth + " м<br/>";
            tooltipWindowText += "Плотность нефти: " + tooltip.oilDensity + " кг/м³<br/>";

            tooltipWindowText += "Площадь дна: " + tooltip.bottomArea + " м²<br/>";
            tooltipWindowText += "Площадь стен: " + tooltip.wallSquire + " м²<br/>";
            tooltipWindowText += "Вес стен: " + tooltip.wallSteelWeight + " кг<br/>";
            tooltipWindowText += "Вес дна: " + tooltip.bottomSteelWeight + " кг<br/>";
            tooltipWindowText += "Вес крыши: " + tooltip.roofSteelWeight + " кг<br/>";
            tooltipWindowText += "Плотность металла: " + tooltip.metalDensityKgPerCubicMetr + " кг/м³<br/>";
            tooltipWindowText += "Стоимость тонны метала: " + tooltip.metalCostPeTon + " руб.<br/>";

            // belts
            tooltipWindowText += "Пояса: <br/>";
            tooltipWindowText += tooltip.beltInfos.map((belt) => "&nbsp; Пояс №" + belt.beltNumber + ": " + belt.thickness + " м<br/>").join("");

            
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
            let windowForOpen = window.open("", "", "width=350, height=400");

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
                        let f = identification.toString();

                        return (
                            <tr identification={ f} onClick={ handleClickForOpenTheDescription}>
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
