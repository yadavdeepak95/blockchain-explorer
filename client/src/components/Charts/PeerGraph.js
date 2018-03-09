import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { getBlocksPerMin as getBlocksPerMinCreator
 } from '../../store/actions/charts/action-creators';
import Tree from 'react-tree-graph';
import Card, { CardContent } from 'material-ui/Card';
import 'react-tree-graph/dist/style.css';
class PeerGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                name: "parent",
                children: [
                    { name: 'child1' },
                    { name: 'child2' },
                    { name: 'child3' },
                    { name: 'child4' }
                ]
            }

        }
    }
    componentDidMount() {
        var names = [];
        for (var i = 0; i < this.props.peerList.length; i++) {
            names[i] = { name: this.props.peerList[i].server_hostname };
        }
        this.setState({
            data: {
                name: this.props.channel.currentChannel,
                children: names
            }
        });
    }
    render() {
        return (
            <div className="peer-graph">
                <Card>
                    <CardContent>
                        <div className="custome-container" >
                            <Tree
                                data={this.state.data}
                                height={350}
                                width={1070}
                                svgProps={{ className: 'custom' }} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    getBlocksPerMin: () => dispatch(getBlocksPerMinCreator()),
});
const mapStateToProps = state => ({
    peerList: state.peerList.peerList,
    channel: state.channel.channel
});
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(PeerGraph);