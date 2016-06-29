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
    fruits: PropTypes.array.isRequired
  }
  constructor(props) {
    super(props);
    this.onFruitUpdate = this.onFruitUpdate.bind(this);
    this.onFruitSelect = this.onFruitSelect.bind(this);
    this.onFruitDelete = this.onFruitDelete.bind(this);
  }

  componentDidMount() {
    //initially load the table
    this.props.entityOperation('fruit','index');
  }
  onFruitUpdate(fruit) {
    //save updated fruit and refresh table
    this.entityOperation('fruit','save',fruit,()=>this.props.entityOperation('fruit','index'));
  }
  onFruitDelete(fruit) {
    //delete updated fruit and refresh table
    this.entityOperation('fruit','delete',fruit.id,()=>this.props.entityOperation('fruit','index'))
  }
  onFruitSelect(fruit) {
    this.selectFruit({type:'GET_FRUIT',data:{res: fruit}});
  }
  render() {
    const selectRowProp = {
      mode: "checkbox",  //checkbox for multi select, radio for single select.
      clickToSelect: false,   //click row will trigger a selection on that row.
      bgColor: "rgb(238, 193, 213)"   //selected row background color
    };
    const options = {
      afterDeleteRow: this.onFruitDelete,
      onRowClick: this.onFruitSelect
    };
    return(
      <div className="containerFluid">

        <Fruit value={this.props.currentFruit} onUpdate={this.onFruitUpdate} onDelete={this.onFruitDelete}/>
        <BootstrapTable
        selectRow={selectRowProp}
        data={this.props.fruits}
        striped={true} hover={true} deleteRow={true}
        options={options}>
          <TableHeaderColumn isKey={true} dataField="id" hidden={true}>id</TableHeaderColumn>
          <TableHeaderColumn dataField="name" width="120">Fruit</TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    fruits : state.fruits,
    currentFruit: state.fruit
  }
}
function mapDispatchToProps(dispatch) {
  const entityOpFunction = createEntityOperation(dataEntities);
  return {
    entityOperation : (...args) => dispatch(entityOpFunction(...args)),
    selectFruit: (...args) => dispatch(...args)
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(Fruits);
