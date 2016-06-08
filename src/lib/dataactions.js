import request from 'axios';

function getActionTypeByOper(entity,operation) {
	const label = entity.toString().toUpperCase();
	switch(operation) {
		case 'index': return 'LOAD_'+label+'S';
		case 'get' : return 'GET_'+label;
		case 'post': return 'SAVE_'+label;
		case 'delete': return 'DELETE_'+label;
	}
}
/**
* Main function for data exchange with server. Default operations supported: index,get,post and delete
* To make entity be supported you should add it to the entities object. 
* You could also specify nonstandard operations as children elements of the entity.
* @param {entity} - entity name to operate on
* @param {operation} - operation name to perform
* @param {data} - optional data required for operations. By convention data is used for
*	'get' - will be added to the url  as `url/id`
*	'post' - will be sent as request body
*	'delete' - will be added to the url  as `url/id`
* @param {chainlink} - optional action to perform after the current action will be finished
*
* @return action to be dispatched by redux
**/
function entityOperation(entity,operation,data,chainlink) {
	let atype,url,arequest;
	const entities = st_entities.entities;
	const defaults = st_entities.defaults;
	if(entities[entity] === undefined) throw new Error(`Entity ${entity} is undefined`);
	if(entities[entity][operation] === undefined) {// use defaults
		atype = getActionTypeByOper(entity,operation);
		url = defaults.baseUrl+'/'+entity+'s';
	} else {
		atype = entities[entity][operation].type;
		url = entities[entity][operation].url;
		if(atype===undefined) atype = getActionTypeByOper(entity,operation);
		if(url===undefined) url = defaults.baseUrl+'/'+entity+'s';
		if(!(entities[entity][operation].request === undefined))
			arequest = entities[entity][operation].request(data);
	}
	switch(operation) {
		case 'index': return {type: atype, promise: arequest || request.get(url), link: chainlink};
		case 'get' : return {type: atype, promise: arequest || request.get(`${url}/${data}`),link: chainlink};
		case 'post': return {type: atype, promise: arequest || request.post(url,data), link: chainlink};
		case 'delete': return {type: atype, promise: arequest || request.delete(`${url}/${data}`),link: chainlink};
		default: if(arequest===undefined) throw new Error(`Request property is undefined for operation ${operation} on ${entity}`);
			return {type: atype, promise: arequest, link: chainlink};
	}

}

let st_entities=undefined;

export default function createEntityOperation(in_entities) {
	st_entities = in_entities;
	return entityOperation;
}
