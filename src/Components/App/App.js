import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import CalcListItem from '../CalcListItem/CalcListItem';
import axios from 'axios';

//Material-UI
import Fab from '@material-ui/core/Fab';
import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';


//To determine which step of the Calculation the user is at
let calcLevel = 0;

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    disabled: true
  },
  allBtn: {

  },
  calculator: {
    width: '20%',
    margin: 'auto',
    display: 'inline-block',
  },
  history: {
    width: '20%',
    height: '50%',
    border: 'solid',
    float: 'right',
    marginRight: '18%'
  }
})

class App extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: `https://calm-atoll-64797.herokuapp.com/49185`

      ///
      history: [],
      newCalculation: {
        numOne: null,
        numTwo: null,
        operator: null
      }, 
      calculation: '',
      total: 0
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
  //Sets num in state( newCalculation), checking the calclevel to see which number should be changed in state
  setNum = (num) => {
    if(calcLevel === 3){
      this.clear();
      return
    }
    this.setState({total: 0})
    if(this.state.newCalculation.numOne === null && calcLevel === 0 && num !== '0'){
      this.setState({ newCalculation: {...this.state.newCalculation, numOne: num}, calculation: this.state.calculation + num })
    } else if (this.state.newCalculation.numOne && calcLevel === 0) {
      this.setState({ newCalculation: { ...this.state.newCalculation, numOne: this.state.newCalculation.numOne + num }, calculation: this.state.calculation + num})
    } else if (this.state.newCalculation.numTwo === null && calcLevel === 1 && num !== '0'){
      this.setState({ newCalculation: { ...this.state.newCalculation, numTwo: num }, calculation: this.state.calculation + num })
    } else if (this.state.newCalculation.numTwo && calcLevel === 1){
      this.setState({ newCalculation: { ...this.state.newCalculation, numTwo: this.state.newCalculation.numTwo + num }, calculation: this.state.calculation + num })
    }
  }

  //Sets operator in state (newCalculation);
  setOp = (op) => {
    if(!this.state.newCalculation.operator && this.state.newCalculation.numOne){
      this.setState({newCalculation: {...this.state.newCalculation, operator: op}, calculation: this.state.calculation + op})
      calcLevel = 1;
    }
  }

  //Submits user calculation to the database to be shown instantly to all users
  submitCalculation = () => {
    calcLevel = 3;
    axios.post('/calculate', this.state.newCalculation)
      .then(response => {
        const socket = socketIOClient(this.state.endpoint);
        socket.emit('get_history')
      })
    if(this.state.newCalculation.operator === '+'){
      this.setState({total: (Number(this.state.newCalculation.numOne) + Number(this.state.newCalculation.numTwo))})
    } else if (this.state.newCalculation.operator === '-') {
      this.setState({ total: (Number(this.state.newCalculation.numOne) - Number(this.state.newCalculation.numTwo)) })
    } else if (this.state.newCalculation.operator === '*') {
      this.setState({ total: (Number(this.state.newCalculation.numOne) * Number(this.state.newCalculation.numTwo)) })
    } else if (this.state.newCalculation.operator === '/') {
      this.setState({ total: (Number(this.state.newCalculation.numOne) / Number(this.state.newCalculation.numTwo)) })
    }
  }


  //Resets Calculator without sending to database
  clear = () => {
    this.setState({newCalculation: {numOne: null, numTwo: null, operator: null}, calculation: '', total: 0})
    calcLevel = 0;
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
    console.log(this.state.newCalculation);
    return (
      <div style={{ textAlign: "center" }}>
        <h1>Calculator</h1>
        <div className={classes.calculator}>
          <TextField disabled variant="outlined" style={{width: '70%'}}
          value={
            this.state.total !== 0 ? this.state.total : this.state.calculation
          } />
          <Fab onClick={() => this.clear()} size="small" className={classes.button}>C</Fab>
          <div className={classes.allBtn}>
            <Fab onClick={() => this.setNum('7')} className={classes.button}>7</Fab>
            <Fab onClick={() => this.setNum('8')} className={classes.button}>8</Fab>
            <Fab onClick={() => this.setNum('9')} className={classes.button}>9</Fab>
            <Fab onClick={() => this.setOp('+')} className={classes.button}>+</Fab>
            <br />
            <Fab onClick={() => this.setNum('4')} className={classes.button}>4</Fab>
            <Fab onClick={() => this.setNum('5')} className={classes.button}>5</Fab>
            <Fab onClick={() => this.setNum('6')} className={classes.button}>6</Fab>
            <Fab onClick={() => this.setOp('-')} className={classes.button}>-</Fab>
            <br />
            <Fab onClick={() => this.setNum('1')} className={classes.button}>1</Fab>
            <Fab onClick={() => this.setNum('2')} className={classes.button}>2</Fab>
            <Fab onClick={() => this.setNum('3')} className={classes.button}>3</Fab>
            <Fab onClick={() => this.setOp('*')} className={classes.button}>*</Fab>
            <br />
            <Fab onClick={() => this.setNum('0')} className={classes.button}>0</Fab>
            <Fab onClick={() => this.setNum('.')} className={classes.button}>.</Fab>
            <Fab onClick={() => this.submitCalculation()} className={classes.button}>=</Fab>
            <Fab onClick={() => this.setOp('/')} className={classes.button}>/</Fab>

          </div>
        </div>
        <div className={classes.history}>
          <h2>History</h2>
          {this.state.history.map((calc, i) => <CalcListItem key={i} calc={calc} />)}
        </div>
      </div>
    )
  }
}
export default withStyles(styles)(App);
