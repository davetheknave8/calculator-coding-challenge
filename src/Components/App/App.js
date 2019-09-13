import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import CalcListItem from '../CalcListItem/CalcListItem';
import axios from 'axios';

//Material-UI
import Fab from '@material-ui/core/Fab';
import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({
  buttons: {
    margin: theme.spacing.unit
  }
})

class App extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: "localhost:4001",

      ///
      history: [],
      color: 'white'
      ///

    };
  }

  // sending sockets
  send = () => {
    const socket = socketIOClient(this.state.endpoint);
    socket.emit('get_history') // change 'red' to this.state.color
  }
  ///

  // adding the function
  setColor = (color) => {
    this.setState({ color })
  }

  componentDidMount = () => {
      const socket = socketIOClient(this.state.endpoint);
      setInterval(this.send(), 1000)
      socket.on('get_history', (response) => {
          this.setState({history: response})
          
      })
  }

  render() {
    // testing for socket connections
    const {classes} = this.props;
    const socket = socketIOClient(this.state.endpoint);
    console.log(this.state.history);
    return (
      <div style={{ textAlign: "center" }}>
        <button onClick={() => this.send() }>Send Test</button>
        <div className={classes.calculator}>
          <div className={classes.buttons}></div>
          <Fab className={classes.buttons}>7</Fab>
          <Fab className={classes.buttons}>8</Fab>
          <Fab className={classes.buttons}>9</Fab>
          <br />
          <Fab className={classes.buttons}>4</Fab>
          <Fab className={classes.buttons}>5</Fab>
          <Fab className={classes.buttons}>6</Fab>
          <br />
          <Fab className={classes.buttons}>1</Fab>
          <Fab className={classes.buttons}>2</Fab>
          <Fab className={classes.buttons}>3</Fab>
        </div>
        {this.state.history.map((calc, i) => <CalcListItem key={i} calc={calc} />)}
      </div>
    )
  }
}
export default withStyles(styles)(App);
