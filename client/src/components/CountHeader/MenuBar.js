import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip';
import Typography from 'material-ui/Typography';
import PropTypes from 'prop-types';
import TransactionView from "../View/TransactionView";
import ChaincodeView from "../View/ChaincodeView";
import BlockView from "../View/BlockView";
import PeerView from "../View/PeerView";
import ChannelView from "../View/ChannelView";
import Peers from '../Lists/Peers';
import Blocks from '../Lists/Blocks';
import Transactions from '../Lists/Transactions';
import Channels from '../Lists/Channels';
import { getBlockList as getBlockListCreator } from '../../store/actions/block/action-creators';
import { getLatestBlock as getLatestBlockCreator } from '../../store/actions/latestBlock/action-creators';
import { getHeaderCount as getCountHeaderCreator } from '../../store/actions/header/action-creators';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

const styles = theme => ({
  card: { minWidth: 250, height: 100, },
  media: { height: 30, },
  title: {
    marginBottom: 16, fontSize: 16, color: theme.palette.text.secondary,
    position: 'absolute', right: 10, top: 10
  },
  pos: {
    marginBottom: 5,
    color: theme.palette.text.secondary,
    position: 'absolute',
    right: 10,
    top: 60,
    fontSize: 18,
  },

});

class MenuBar extends Component {
  constructor(props) {
    super(props);
    this.state = { activeView: 'ChaincodeView' }
    this.state = {
      countHeader: { countHeader: this.props.getCountHeader() }
      //json structure  {chaincodeCount: 0, txCount: 0, latestBlock: 0, peerCount: 0 }
    };

    this.handleClickChaincodeView = this.handleClickChaincodeView.bind(this);
    this.handleClickTransactionView = this.handleClickTransactionView.bind(this);
    this.handleClickBlockView = this.handleClickBlockView.bind(this);
    this.handleClickChannelView = this.handleClickChannelView.bind(this);
    this.handleClickPeerView = this.handleClickPeerView.bind(this);
  }

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.countHeader) !== JSON.stringify(this.props.countHeader)) {
      console.log('nextProps.countHeader !== this.props.countHeader')
      this.setState({ countHeader: nextProps.countHeader });
    }
  }


  componentDidMount() {
    //TODO isolate interval
    setInterval(() => {
      this.props.getCountHeader();
      this.props.getLatestBlock();
      // console.log(this.props.countHeader.countHeader.latestBlock);
      // console.dir(this.props.blockList);
      this.props.getBlockList(this.props.countHeader.countHeader.latestBlock);
      // .then(data =>
      //   this.props.getBlockList(data.latestBlock)
      // ).catch(err => {
      //   // logger.error(err)
      // });
    }, 3000)

  }

  componentDidUpdate(prevProps, prevState) {
  }


  handleClickChaincodeView() {
    //TODO add constants for activeView
    this.setState({ activeView: 'ChaincodeView' });
  }
  handleClickTransactionView() {
    this.setState({ activeView: 'TransactionView' });
  }
  handleClickBlockView() {
    this.setState({ activeView: 'BlockView' });
  }
  handleClickChannelView() {
    this.setState({ activeView: 'ChannelView' });
  }
  handleClickPeerView() {
    this.setState({ activeView: 'PeerView' });
  }


  render() {
    const { classes } = this.props;
    const { countHeader } = this.props.countHeader;

    let currentView = null;
    /* could be routed */
    switch (this.state.activeView) {
      case 'ChaincodeView':
        currentView = <ChaincodeView />;
        break;
      case 'TransactionView':
        currentView = <Transactions transactionList={this.props.transactionList} />;
        break;
      case 'BlockView':
        currentView = <Blocks blockList={this.props.blockList.rows} />;
        break;
      case 'ChannelView':
        currentView = <Channels channelList={this.props.channelList} />;
        break;
      case 'PeerView':
        currentView = <Peers peerList={this.props.peerList} />;
        break;
      default:
        currentView = <PeerView />;
        break;
    }

    return (
      <div>
        <div className="menuItems">
          <Navbar color="faded" light expand="md">
            <Nav className="ml-auto" navbar>
              <NavItem onClick={this.handleClickPeerView}>NETWORK </NavItem>
              <NavItem onClick={this.handleClickBlockView}>BLOCKS </NavItem>
              <NavItem onClick={this.handleClickTransactionView}>TRANSACTIONS </NavItem>
              <NavItem onClick={this.handleClickChannelView}>CHANNEL </NavItem>
            </Nav>
          </Navbar>
        </div>


        <div style={{ position: 'absolute', top: 210, left: 30, zIndex: 1000 }}>
          {currentView}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  getCountHeader: () => dispatch(getCountHeaderCreator()),
  getLatestBlock: () => dispatch(getLatestBlockCreator()),
  getBlockList: () => dispatch(getBlockListCreator())
});


const mapStateToProps = state => ({
  countHeader: state.countHeader,
  peerList: state.peerList.peerList,
  blockList: state.blockList.blockList,
  transactionList: state.transactionList.transactionList,
  channelList: state.channelList.channelList
});



export default compose(
  withStyles(styles, { name: 'CountHeader' }),
  connect(mapStateToProps, mapDispatchToProps),
)(MenuBar);
