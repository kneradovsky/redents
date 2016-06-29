import React, { Component, PropTypes } from 'react';
import { Button, FormControl } from 'react-bootstrap';

export class Fruit extends Component {
  static propTypes = {
    value: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
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
        <FormControl type="text" addonBefore="Name" value={this.state.name} onChange={this.OnChange}/>
        <Button bsStyle="info" onClick={()=>this.props.onUpdate(this.state)}>Update</Button>
        <Button bsStyle="danger" onClick={()=>this.props.onDelete(this.state)}>Delete</Button>
      </form>
    );
  }
 }

 export default Fruit;
