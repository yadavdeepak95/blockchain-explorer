import React, { Component } from 'react';
// import Card, { CardContent } from 'material-ui/Card';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { PieChart, Pie, Tooltip, Legend } from 'recharts';

class OrgPieChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                { value: 40, name: "Org1", fill: "#0353A4" },
                { value: 60, name: "Org2", fill: "#7C7C7C" }
            ]

        }
    }
    componentDidMount() {
    }
    render() {
        return (
            <div className="chart-stats">
                <Card>
                    <CardHeader>
                        <h5>Organization Transactions</h5>
                    </CardHeader>
                    <CardBody>
                        <PieChart width={535} height={310}>
                            <Legend align="right" height={15} />
                            <Pie data={this.state.data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} label fill="fill" />
                            <Tooltip />
                        </PieChart>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default OrgPieChart;