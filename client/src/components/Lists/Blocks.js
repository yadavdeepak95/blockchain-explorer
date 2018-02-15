import React from 'react';
import { Table, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
const Blocks = ({ blockList }) => {
    return (
        <div>
            <Table>
                <thead>
                    <th>Block Number</th>
                    <th>Number of Tx</th>
                </thead>
                <tbody>
                    {blockList.map(block=>
                    <tr key={block.blocknum}>
                        <td>{block.blocknum} </td>
                        <td>{block.txcount} </td>
                    </tr>)}
                </tbody>
            </Table>
            <Table>
                <thead>
                    <th>Block Number</th>
                    <th>Data</th>
                    <th>Previous Hash</th>
                    <th>Transactions</th>
                </thead>
                <tbody>
                    {blockList.map(block=>
                    <tr key={block.number}>
                        <td>{block.number} </td>
                        <td>{block.transaction} </td>
                    </tr>)}
                </tbody>
            </Table>
        </div>
    );
};
export default Blocks;