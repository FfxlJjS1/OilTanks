import React from "react"
import { Table, Form } from "react-bootstrap"

export const ResultTableMixinShowTable = {
    renderResultTable() {
        const tdColumns = (data) => {
            let content = [];

            for (let column of data.columns) {
                content.push(
                    <th style={{ width: column.width }}>{column.name}</th>
                );
            }

            content = [
                <tr>
                    {content}
                </tr>
            ];

            return content;
        }

        const tdRows = (data) => {
            let content = [];

            let rows = data.rows;

            for (let row of rows) {
                let rowContent = [];

                for (let value of row) {
                    rowContent.push(
                        <td>{value}</td>
                    );
                }

                rowContent = [
                    <tr>
                        {rowContent}
                    </tr>];

                content.push(rowContent);
            }

            return content;
        }

        return (
            <>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Минимальная площадь, м: {this.state.minimalSquire}</Form.Label>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Высота, м: {this.state.height}</Form.Label>
                    </Form.Group>
                </Form>

                <Table striped bordred hover>
                    <tbody>
                        {tdColumns(this.state.loadedResult)}
                    </tbody>
                    <tbody>
                        {tdRows(this.state.loadedResult)}
                    </tbody>
                </Table>
            </>
        );
    }
}

export default ResultTableMixinShowTable;
