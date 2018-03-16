import React, { Component } from 'react';
import { Timeline, TimelineEvent } from 'react-event-timeline'
import FontAwesome from 'react-fontawesome';
// import Card, { CardContent } from 'material-ui/Card';
import { Card, CardHeader, CardBody } from 'reactstrap';


class TimelineStream extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }
    render() {
        return (
            <div className="timeline">
                <Card>
                    <CardHeader>
                        <h5>Activity</h5>
                    </CardHeader>
                    <CardBody>
                        <Timeline>
                            <TimelineEvent title="Block Added"
                                createdAt="2017-03-19 09:08 PM"
                                icon={<FontAwesome name="cube" />}
                            >
                                <div className="timeline-items">
                                    <h5>Block 1</h5>
                                    <p>1 Tx</p>
                                    <p> datahash:b9868fa6530d95c5b6f2c64f83cd5661a.. </p>
                                </div>
                            </TimelineEvent>
                            <TimelineEvent
                                title="Block Added"
                                createdAt="2017-03-19 09:06 AM"
                                icon={<FontAwesome name="cube" />}>
                                <div className="timeline-items">
                                    <h5>Block 0</h5>
                                    <p>1 Tx</p>
                                    <p> datahash:b9868fa6530d95c5b6f2c64f83cd5661a.. </p>
                                </div>
                            </TimelineEvent>
                        </Timeline>
                    </CardBody>
                </Card>
            </div>
        );
    }
};
export default TimelineStream;