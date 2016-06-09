
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
		res[cur+'s'] = reduceArray('LOAD_'+cur.toString().toUpperCase()+'S');
		res[cur] = reduceObject('GET_'+cur.toString().toUpperCase);
		return res;
	},{});
	return entOpers;
}