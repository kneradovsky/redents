function reduceDict(acttype,initial) {
	const initialState = initial || [];
	return (state = initialState, action) => {
		if(action.type!=acttype) return state;
		return action.res.data;
	};
}

export default function data_entitites(state = [], action) {
	//generate entries for data entities
	const entOpers = Object.keys(dataEntities).reduce((prev,cur)=> {
		const res = Object.assign(prev);
		res[cur+'s'] = reduceDict('LOAD_'+cur.toString().toUpperCase()+'S');
		return res;
	},{});
	return entOpers;
}