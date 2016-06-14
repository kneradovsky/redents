import { dictionary_reducers } from '../src/';
import chai from 'chai';

const beroot = 'http://localhost:3000/';
const entities = {
	defaults: {
		baseUrl: beroot+'data/'
	},
	entities : {
		entDefault : {},
		entType : {
			get: {
				type: 'CUSTOM_TYPE'
			}
		}
	}
}


chai.should();
const dictred = dictionary_reducers(entities.entities);


describe("Dictionary Reducers", function() {
	it('Default entity, index', function() {
		const action = {type:"LOAD_ENTDEFAULTS",res: {data: ['a','b','c']}};
		const initialState = ['1','2','3']
		dictred.should.have.property('entDefaults');
		dictred.entDefaults(initialState,action).should.eql(action.res.data);
		dictred.entDefaults(initialState,{type: "NOT_A_TYPE", res:{}}).should.eql(initialState);
	});
	it('Default entity, get', function() {
		const action = {type:"GET_ENTDEFAULT",res: {data: {a:'a',b:'b',c:'c'}}};
		const initialState = {a:'1',b:'2',c:'3'};
		dictred.should.have.property('entDefault');
		dictred.entDefault(initialState,action).should.eql(action.res.data);
		dictred.entDefault(initialState,{type: "NOT_A_TYPE", res:{}}).should.eql(initialState);
	});
	it('CustomType, index', function() {
		const action = {type:"LOAD_ENTTYPES",res: {data: ['a','b','c']}};
		const initialState = ['1','2','3']
		dictred.should.have.property('entTypes');
		dictred.entTypes(initialState,action).should.eql(action.res.data);
		dictred.entTypes(initialState,{type: "NOT_A_TYPE", res:{}}).should.eql(initialState);
	});	
	it('CustomType, get', function() {
		const action = {type:"CUSTOM_TYPE",res: {data: {a:'a',b:'b',c:'c'}}};
		const initialState = {a:'1',b:'2',c:'3'};
		dictred.should.have.property('entType');
		dictred.entType(initialState,action).should.eql(action.res.data);
		dictred.entType(initialState,{type: "NOT_A_TYPE", res:{}}).should.eql(initialState);
		//no conventional action should exist
		dictred.entType(initialState,{type: "GET_ENTTYPE", res:{}}).should.eql(initialState);
	});	
});
