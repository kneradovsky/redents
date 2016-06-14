
function createReducer(acttype,initialState) {
	return (state = initialState, action) => {
		if(action.type!=acttype) return state;
		return action.res.data;
	};
}

function reduceObject(acttype,initial) {
	const initialState = initial || {};
	return createReducer(acttype,initialState);
}

function reduceArray(acttype,initial) {
	const initialState = initial || [];
	return createReducer(acttype,initialState);
}

export default function data_entitites(dataEntities) {
	//generate entries for data entities
	const entOpers = Object.keys(dataEntities).reduce((prev,cur)=> {
		const res = Object.assign(prev);
		//use default action type if entity doesn't have custom action type for the index defined
		const index_action  = (dataEntities[cur].index || {}).type || 'LOAD_'+cur.toString().toUpperCase()+'S';
		//same for get operation
		const get_action =  (dataEntities[cur].get || {}).type || 'GET_'+cur.toString().toUpperCase();
		res[cur+'s'] = reduceArray(index_action);
		res[cur] = reduceObject(get_action);
		return res;
	},{});
	return entOpers;
}