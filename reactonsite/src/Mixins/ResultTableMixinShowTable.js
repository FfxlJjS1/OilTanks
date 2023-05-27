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
            //console.log(data);
            if (columnBySorted[0] == thIndexInColumns && columnBySorted[1] == true) {
                columnBySorted[1] = false;
            }
            else {
                columnBySorted = [thIndexInColumns, true];
            }

            data.rows.sort((a, b) => {
                if (columnBySorted[1] == true) {
                    if (IsNumeric(a[thIndexInColumns]) && IsNumeric(b[thIndexInColumns])) {
                        return a[thIndexInColumns] - b[thIndexInColumns];
                    }
                    else {
                        return a[thIndexInColumns] > b[thIndexInColumns];
                    }
                }
                else {
                    if (IsNumeric(a[thIndexInColumns]) && IsNumeric(b[thIndexInColumns])) {
                        return b[thIndexInColumns] - a[thIndexInColumns];
                    }
                    else {
                        return a[thIndexInColumns] < b[thIndexInColumns];
                    }
                }
            });

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
                                <td>{item}</td>
                                )}</tr>
                            )}
                    </tbody>
                </Table>
            </>
        );
    }
}

export default ResultTableMixinShowTable;
