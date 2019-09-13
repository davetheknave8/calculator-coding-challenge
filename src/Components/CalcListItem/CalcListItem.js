import React, {Component} from 'react';

class CalcListItem extends Component{
    state = {
        total: 0
    }

    componentDidMount = () => {
        this.getTotal();
    }

    getTotal = () => {
        if(this.props.calc.operator === '+'){
            this.setState({total: (this.props.calc.num_one + this.props.calc.num_two)})
        } else if (this.props.calc.operator === '-') {
            this.setState({ total: (this.props.calc.num_one - this.props.calc.num_two) })
        } else if (this.props.calc.operator === '*') {
            this.setState({ total: (this.props.calc.num_one * this.props.calc.num_two) })
        } else if (this.props.calc.operator === '/') {
            this.setState({ total: (this.props.calc.num_one / this.props.calc.num_two) })
        }
    }

    render(){
        return(
            <>
                <p>{this.props.calc.num_one} {this.props.calc.operator} {this.props.calc.num_two} = {this.state.total}</p>
            </>
        )
    }
}

export default CalcListItem;