import React, { Component, PropTypes } from 'react';
import { Button, Input } from 'react-bootstrap';

export class Fruit extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }
  static propTypes = {
    value: PropTypes.object.isRequired,
    onFruitUpdate: PropTypes.function.isRequired,
    onFruitDelete: PropTypes.function.isRequired
  }
  state = {
    ...this.props.value
  }
  onChange(evt) {
    this.setState({name: evt.target.value});
  }
  render() {
    return(
      <form>
        <Input type="text" addonBefore="Name" value={this.state.name} onChange={this.OnChange}/>
        <Button bsStyle="info" onClick={()=>this.props.onFruitUpdate(this.state)}>Update</Button>
        <Button bsStyle="danger" onClick={()=>this.props.onFruitDelete(this.state)}>Delete</Button>
      </form>
    );
  }
 }
