import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Input } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import dataEntities from './entities';
import Fruit from './fruit';

export class Fruits extends Component {
  constructor(props) {
    super(props);
    this.onFruitUpdate = this.onFruitUpdate.bind(this);
    this.onFruitSelect = this.onFruitSelect.bind(this);
    this.onFruitDelete = this.onFruitDelete.bind(this);
  }
  static propTypes = {
    currentFruit: PropTypes.object.isRequired,
    fruits: PropTypes.array.isRequired
  }
  componentDidMount() {
    //initially load the table
    this.entityOperation('fruit','index');
  }
  onFruitUpdate(fruit) {
    //save updated fruit and refresh table
    this.entityOperation('fruit','save',fruit,()=>this.entityOperation('fruit','index'));
  }
  onFruitDelete(fruit) {
    //delete updated fruit and refresh table
    this.entityOperation('fruit','delete',fruit.id,()=>this.entityOperation('fruit','index'))
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
        <form>
          <Fruit value={this.props.currentFruit} onUpdate={this.onFruitUpdate} onDelete={this.onFruitDelete}/>
          <BootstrapTable
          selectRow={selectRowProp}
          data={this.props.fruits}
          striped={true} hover={true} deleteRow={true}
          options={options}>
            <TableHeaderColumn isKey={true} dataField="id" hidden={true}>id</TableHeaderColumn>
            <TableHeaderColumn dataField="name" width="120">Fruit</TableHeaderColumn>
          </BootstrapTable>
        </form>
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
