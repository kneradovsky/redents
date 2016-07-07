import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Input } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import {createEntityOperation} from 'redux-redents';
import dataEntities from './entities';
import Fruit from './fruit';

export class Fruits extends Component {
  static propTypes = {
    currentFruit: PropTypes.object.isRequired,
    fruits: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props);
    this.onFruitUpdate = this.onFruitUpdate.bind(this);
    this.onFruitSelect = this.onFruitSelect.bind(this);
    this.onFruitDelete = this.onFruitDelete.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
  }

  componentDidMount() {
    //initially load the table
    this.props.actions.entityOperation('fruit','index');
  }
  onFruitUpdate(fruit) {
    //save updated fruit and refresh table
    this.props.actions.entityOperation('fruit','post',fruit,()=>this.props.actions.entityOperation('fruit','index'));
  }
  onFruitDelete(fruit) {
    //delete updated fruit and refresh table
    this.props.actions.entityOperation('fruit','delete',fruit.id,()=>this.props.actions.entityOperation('fruit','index'));
  }
  onFruitSelect(fruit) {
    this.props.actions.selectFruit({type:'GET_FRUIT',res:{data:  fruit}});
  }
  onNameChange(newname) {
    const newFruit = {...this.props.currentFruit,name:newname};
    this.props.actions.selectFruit({type:'GET_FRUIT',res:{data: newFruit}});
  }
  render() {
    const selectRowProp = {
      mode: "radio",  //checkbox for multi select, radio for single select.
      clickToSelect: false,   //click row will trigger a selection on that row.
      bgColor: "rgb(238, 193, 213)"   //selected row background color
    };
    const options = {
      afterDeleteRow: (id)=> this.onFruitDelete({id:id}),
      onRowClick: this.onFruitSelect
    };
    return(
      <div className="container" role="main">
        <div className="page-header">
          <h2>Fruits page</h2>
        </div>
        <Fruit value={this.props.currentFruit} onUpdate={this.onFruitUpdate} onDelete={this.onFruitDelete} onNameChange={this.onNameChange}/>
        <div className="row">
          <div className="col-sm-8">
            <BootstrapTable
            selectRow={selectRowProp}
            data={this.props.fruits}
            striped={true} hover={true} deleteRow={true}
            options={options}>
              <TableHeaderColumn isKey={true} dataField="id" hidden={true}>id</TableHeaderColumn>
              <TableHeaderColumn dataField="name" width="120">Fruit</TableHeaderColumn>
            </BootstrapTable>
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    fruits : state.fruits,
    currentFruit: state.fruit
  };
}
function mapDispatchToProps(dispatch) {
  const entityOpFunction = createEntityOperation(dataEntities);
  return {
    actions: {
      entityOperation : (...args) => dispatch(entityOpFunction(...args)),
      selectFruit: (...args) => dispatch(...args)
    }
  };
}
export default connect(mapStateToProps,mapDispatchToProps)(Fruits);
