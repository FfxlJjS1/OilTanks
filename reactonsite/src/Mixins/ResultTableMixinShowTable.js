import React from "react"
import { Table, Form } from "react-bootstrap"

import { NumToFormatStr, IsNumeric } from "../FunctionalClasses/GeneralFunctions";

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
                    if (IsNumeric(a[thIndexInColumns]) && IsNumeric(b[thIndexInColumns])) {
                        return parseFloat(a[thIndexInColumns]) - parseFloat(b[thIndexInColumns]) >= 0 ? 1 : -1;
                    }
                    else {
                        return a[thIndexInColumns] > b[thIndexInColumns] ? 1 : -1;
                    }
                });
            }
            else {
                data.rows.sort((a, b) => {
                    if (IsNumeric(a[thIndexInColumns]) && IsNumeric(b[thIndexInColumns])) {
                        return parseFloat(b[thIndexInColumns]) - parseFloat(a[thIndexInColumns]) >= 0 ? 1 : -1;
                    }
                    else {
                        return a[thIndexInColumns] < b[thIndexInColumns] ? 1 : -1;
                    }
                });
            }

            this.setState({
                resultTable: this.renderResultTable(),
                columnBySorted: columnBySorted
            });
        }

        return (
            <>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Минимальная площадь, м: {NumToFormatStr(this.state.minimalSquire)}</Form.Label>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Высота, м: {NumToFormatStr(this.state.height)}</Form.Label>
                    </Form.Group>
                </Form>

                <Table striped bordred hover>
                    <tbody>
                        <tr>
                            {this.state.loadedResult.columns.map((column) =>
                                <th
                                    style={{ width: column.width }}
                                    onClick={handleClickForSortingByColumn}
                                    style={{cursor: 'pointer'} }
                                >{column.name}</th>
                                )}
                        </tr>
                    </tbody>
                    <tbody>
                        {this.state.loadedResult.rows.map((item) =>
                            <tr>{item.map((item) => 
                                <td>{item != "-1" ? item : "---"}</td>
                                )}</tr>
                            )}
                    </tbody>
                </Table>
            </>
        );
    }
}

export default ResultTableMixinShowTable;
