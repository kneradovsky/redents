# Middlewares and Reducers for Redux [![BuildStatus](https://travis-ci.org/kneradovsky/redents.svg?branch=master)](https://travis-ci.org/kneradovsky/redents)

## Motivation
Once you're required to fetch data from the server in your Redux applications, you need to either write a custom Middleware or use redux-* modules to fetch data. Anyway you need to implement actions creators, reducers or both. If your server provides rest api for data manipulation the implementation of anything becomes boring very quickly. And Redux-redents to the rescue!!!

The module contains the implementation of the:
1. Promise middleware, supports fetching from and pulling to server data
2. Chain middleware, supports call chains for chaining you actions.
3. Dictionary reducers, provide convention based reducers to reduce server responses

You don't need to implement actions, just add reducers to the rootreducer and add middlewares to the store

## Установка

```shell
npm install redux-redents
```

## Quick sample
```javascript
//file index.js
//imports
import {createStore, applyMiddlware} from 'redux';
import {Provider} from 'react-redux';
import {render} from 'react-dom';
import {dictionary_reducers,promiseMiddleware,chainMiddleware,createEntityOperation} from 'redux-redents';
import {Plants} from './plants';

//specify entities
const plants = {
  fruit: {},
  vegetable: {}
}
const EntConfig = {
  defaults : {
    baseUrl : 'http://server/uri'
  }
  entities : plants
}

//create reducers
const dicts = dictionary_reducers(plants);
//create store
const store = applyMiddlware(promiseMiddleware,chainMiddleware)(createStore)(dicts);

render(<Provider store={store})><Plants/></Provider>,document.getElemenentById('app'));

//file plants.js


export class Plants extends Component {
  static propTypes = {
    plants: propTypes.array.isRequired,
    plant: propTypes.object.isRequired
  }
  componentDidMount() {
    this.props.actions.entOper('fruit','index'); //load fruits list
    this.props.actions.entOper('fruit','get','apple'); //load an apple
  }
  return (
    <div>
      <ul>
        {this.props.plants.map((cur) => <li>{cur.name}</li>)} //display list of the plants
      </ul>
      <h3>{this.props.plant.name}</h3>//diplay selected plant
    <div>
  );
}

//connect props and actions to the Component
function mapStateToProps(state) {
  return {
    plants: state.fruits, //connect fruits reducer to the plants property
    plant: state.fruit
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({entOper:createEntityOperation(EntConfig)}, dispatch) //binds actions.entOper to the call of the entityOperation function
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GenTransactionsPage);
```

Full sample is available in the __client-demo__ folder

## Conventions and defaults
Redux-redents uses Entities object to get information about entities names, operations supported and their data.

### Entities configuration by conventions
Entities type structure:
```javascript
entities = {
  defaults: {
    baseUrl: //default baseUrl of the server endpoint
  },
  entities : {
    entityName : {
      operation1: {
        url: //operation url,
        request: function(data) {return request object} //- function to produce request to perform operation1
      }
    }
  }
}
```
Default operations supported are:
* index - fetches the arrays of Entities.
  * By convention uses the url ``` entities.defaults.baseUrl+"/"+entityName+"s" ```
  * By convention uses the get method
* get - fetches one entity
  * By convention uses the url ``` entities.defaults.baseUrl+"/"+entityName+"s"+"/"+data ```
  data is passed from the client code
  * By convention uses the get method
* post - saves the entity data to the server
  * By convention uses the url ``` entities.defaults.baseUrl+"/"+entityName+"s" ```
  * By convention uses the post method
  * By convention passes the data as the json body
* delete - removes the entity from the server
  * By convention uses the url ``` entities.defaults.baseUrl+"/"+entityName+"s" ```
  * By convention uses the delete method

You can override an operation and inside the operation you could override either the url, or the request.
The request field of the entity object should be the function:
```javascript
function(data) { return promise}
```
It accepts data from the client code and returns promise that returns the result

### Reducers by default
Redux-redents has the function that accepts Entities configuration and generates reducers for index and get operations for each entity mentioned in the configuration.

```javascript
dictionary_reducers({ent1:{},ent2{}})
produces
{
  ent1 : function(state,action), //get ent1
  ent1s : function(state,action), //index ent1
  ent2 : function(state,action), //get ent2
  ent2s : function(state,action), //index ent2
}
```

### Actions creator for promises
To emit actions that will fetch data from the server Redux-redents contains the entityOperation function
```javascript function entityOperation(entity,operation,data,chainlink) ```
* _entity_ - entity name to operate on
* _operation_ - operation name to perform
* _data_ - optional data required for operations. By convention data is used for
  *	'get' - will be added to the url  as `url/id`
  *	'post' - will be sent as request body
  *	'delete' - will be added to the url  as `url/id`
* _chainlink_ - optional action to perform after the current action will be finished. Action is the function that accepts the current action.res or whole action if its .res field is not defined

### Promise Middleware
Promise Middleware accepts actions with promise dispatches original action with modified type (type+'_REQUEST') and adds promise callbacks that emit original actions with response from the server in the _res_ field.


### Chain Middleware
If you need emit an action after another will be returned data from the server, you could use the _chainlink_ parameter of the entityOperation. The _chainlink_ is the function that accepts one parameter.
* chainMiddleware only calls the function if original action has _status_ field equal to 'done' (action.status=='done'). * chainMiddleware passes server response (action.res) to that function or original action if it doesn't have _res_ field  
