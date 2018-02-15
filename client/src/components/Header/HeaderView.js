import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Avatar from 'material-ui/Avatar';
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

class HeaderView extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isOpen: false

    }
    this.toggle = this.toggle.bind(this);

  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  componentDidMount() {
    // this.props.actions.loadTrades();
  }
  componentWillReceiveProps(nextProps) {
    // console.log(nextProps.trades);
    // this.setState({loading:false});
  }
  render() {
    return (
      <div>
        <Navbar color="faded" light expand="md">
          <NavbarBrand href="/"> HYPERLEDGER EXPLORER</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Nav className="ml-auto" navbar>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                CURChannel
                </DropdownToggle>
              <DropdownMenu >
                <DropdownItem>
                  Option 1
                  </DropdownItem>
                <DropdownItem>
                  Option 2
                  </DropdownItem>
                <DropdownItem divider />
                <DropdownItem>
                  Reset
                  </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Navbar>
      </div>
    );
  }

}
function mapStateToProps(state, ownProps) {
  return {
    channelList: state.channelList.channelList,
    channel: state.channel.channel
  }
}
// function mapDispatchToProps(dispatch){
//   return {actions: bindActionCreators({...partActions,...secActions}, dispatch)}
// }
export default connect(mapStateToProps/*,mapDispatchToProps*/)(HeaderView);
// const styles = theme => ({
//   root: {
//     width: '100%',
//     backgroundColor: theme.palette.background.paper,
//   },

// });


// function Header(props) {
//   const { classes } = props;
//   return (
//     <div className={classes.root}>
//       <AppBar position="static" >
//         <Toolbar>
//           <Avatar src={process.env.PUBLIC_URL + '/favicon.ico'} alt='logoimage' className={classes.avatar} />
//           <Typography type="title" color="inherit" className={classes.flex}>
//           HYPERLEDGER EXPLORER
//           </Typography>
//         </Toolbar>
//       </AppBar>
//     </div>
//   );
// }

// Header.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

// export default withStyles(styles)(Header);
