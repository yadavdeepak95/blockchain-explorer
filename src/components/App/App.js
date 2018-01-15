import React, { Component } from 'react';
import Header from '../Header/Header';
import Main from '../Main';
//import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

/*const muiTheme = createMuiTheme({
	palette: {
		primary: blueGrey,
		accent: amber,
		error: red,
		type: 'light',
	}
})*/

class App extends Component {
  render() {
    return (
      //<MuiThemeProvider>
      <div>
			<Header />
      <Main />      
			</div>
     // </MuiThemeProvider>
    );
  }
}

export default App;
