import React from 'react';
import { Table, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
const Peers = ({ peerList }) => {
    return (
        <div>
            <Table>
                <thead>
                    <th>Peer Name</th>
                </thead>
                <tbody>
                    {peerList.map(peer=>
                    <tr key={peer.server_hostname}>
                        <td>{peer.server_hostname} </td>
                    </tr>)}
                </tbody>
            </Table>
        </div>
    );
};
export default Peers;