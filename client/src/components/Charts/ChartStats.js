import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import TimeChart from './TimeChart';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import {
    getBlocksPerMin as getBlocksPerMinCreator,
    getTxPerMin as getTxPerMinCreator,
    getBlocksPerHour as getBlocksPerHourCreator,
    getTxPerHour as getTxPerHourCreator
} from '../../store/actions/charts/action-creators'; import classnames from 'classnames';

class ChartStats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: '1',
            loading: false,
        }
        this.toggle = this.toggle.bind(this);

    }
    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }
    componentDidMount() {
        setInterval(() => {
                this.props.getBlocksPerMin(this.props.channel.currentChannel);
                this.props.getBlocksPerHour(this.props.channel.currentChannel);
                this.props.getTxPerMin(this.props.channel.currentChannel);
                this.props.getTxPerHour(this.props.channel.currentChannel);
        }, 6000)
    }
    render() {
        return (
            <div className="chart-stats" >
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '1' })}
                            onClick={() => { this.toggle('1'); }}>
                            BLOCKS / MIN
                     </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '2' })}
                            onClick={() => { this.toggle('2'); }}>
                            BLOCKS / HOUR
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '3' })}
                            onClick={() => { this.toggle('3'); }}>
                            TX / MIN
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '4' })}
                            onClick={() => { this.toggle('4'); }}>
                            TX / HOUR
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                        <TimeChart chartData={this.props.blockPerMin.blockPerMin} />
                    </TabPane>
                    <TabPane tabId="2">
                        <TimeChart chartData={this.props.blockPerHour.blockPerHour} />
                    </TabPane>
                    <TabPane tabId="3">
                        <TimeChart chartData={this.props.txPerMin.txPerMin} />
                    </TabPane>
                    <TabPane tabId="4">
                        <TimeChart chartData={this.props.txPerHour.txPerHour} />
                    </TabPane>
                </TabContent>

            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    getBlocksPerMin: (curChannel) => dispatch(getBlocksPerMinCreator(curChannel)),
    getBlocksPerHour: (curChannel) => dispatch(getBlocksPerHourCreator(curChannel)),
    getTxPerMin: (curChannel) => dispatch(getTxPerMinCreator(curChannel)),
    getTxPerHour: (curChannel) => dispatch(getTxPerHourCreator(curChannel))
});
const mapStateToProps = state => ({
    blockPerMin: state.blockPerMin,
    blockPerHour: state.blockPerHour,
    txPerMin: state.txPerMin,
    txPerHour: state.txPerHour,
    channel: state.channel.channel
});
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(ChartStats);