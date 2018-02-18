import React, { Component } from 'react';
import BlockChart from '../Charts/BlocksChart';
import TransactionChart from '../Charts/TransactionsChart';
import { Alert } from 'reactstrap';
class DashboardView extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <div className="dashboard" >
                <h4></h4>
                <Alert color="primary">
                    Sample Graphs .. Coming Soon
                </Alert>
                <BlockChart />
                <TransactionChart />
            </div>
        );
    }
}

export default DashboardView;
