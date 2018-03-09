import React from 'react';
import { Table } from 'reactstrap';
const Transactions = ({ transactionList }) => {
    return (
        <div>
            <Table>
                <thead>
                    <th>Tx Id</th>
                    <th>Timestamp</th>
                    <th>Channel </th>
                    <th>Type</th>
                </thead>
                <tbody>
                    {transactionList.map(transaction=>
                    <tr key={transaction.tx_id}>
                        <td>{transaction.tx_id} </td>
                        <td>{transaction.timestamp} </td>
                        <td>{transaction.channel_id} </td>
                        <td>{transaction.type} </td>
                    </tr>)}
                </tbody>
            </Table>
        </div>
    );
};
export default Transactions;