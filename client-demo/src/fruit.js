import React, { Component, PropTypes } from 'react';
import { Button, FormControl } from 'react-bootstrap';

export class Fruit extends Component {
  static propTypes = {
    value: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onNameChange: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props);
    this.onNameChange = this.onNameChange.bind(this);
  }

  /*
  componentWillReceiveProps(newprops) {
    //this.setState
  }
  */
  onNameChange(evt) {
    this.props.onNameChange(evt.target.value);
  }
  render() {
    return(
      <div className="row">
        <div className="col-sm-4">
          <div className="panel panel-primary">
            <div className="panel-heading">Fruit</div>
            <div className="panel-body">
              <form>
                <FormControl type="text" addonBefore="Name" value={this.props.value.name || ""} onChange={this.onNameChange}/>
                <Button bsStyle="info" onClick={()=>this.props.onUpdate(this.props.value)}>Update</Button>
                <Button bsStyle="danger" onClick={()=>this.props.onDelete(this.props.value)}>Delete</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
              );
  }
 }

 export default Fruit;
