import server from './testServer';
import { promiseMiddleware, createEntityOperation} from '../src/';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';

const entities = {
	defaults: {
		baseUrl: 'http://localhost:3000/data'
	},
	entities : {
		entDefault : {},
		entType : {
			get: {
				type: 'CUSTOM_TYPE'
			}
		},
		entGetRequest: {
		},
		entPostRequest: {
		},
		entDeleteRequest: {
		},
		entIndexRequest: {
		},
		errEnt404: {},
		errEnt400: {},
		errEnt500: {},
		entReq1: {
		}
	}
}

chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised)

const testServer = new server();
const entityOps =  createEntityOperation(entities);

const promiseMW = promiseMiddleware();
const defnext = (actionType) => sinon.spy((action)=> {
	//console.log(action);
	return (action.type==actionType || action.type==actionType+'_REQUEST')
	});

const defcheck = (spy,done) => () => {
	spy.should.have.been.calledTwice;
	spy.alwaysReturned(true).should.equal(true);
	done();			
}

describe("Promise middleware", function() {
	
	it('Default entity, index', function(done) {
		const next = defnext('LOAD_ENTDEFAULTS');
		promiseMW(next)(entityOps('entDefault','index')).should.eventually.equal(true).notify(defcheck(next,done));
	});
	it('Default entity, get', function(done) {
		const next = defnext('GET_ENTDEFAULT');
		promiseMW(next)(entityOps('entDefault','get','a')).should.eventually.equal(true).notify(defcheck(next,done));
	});
	it('Default entity, save', function(done) {
		const next = defnext('SAVE_ENTDEFAULT');
		promiseMW(next)(entityOps('entDefault','post',{a:'a'})).should.eventually.equal(true).notify(defcheck(next,done));
	});
	it('Default entity, delete', function(done) {
		const next = defnext('DELETE_ENTDEFAULT');
		promiseMW(next)(entityOps('entDefault','delete','a')).should.eventually.equal(true).notify(defcheck(next,done));
	});

	it('Custom type entity, get', function(done) {
		const actionType=entities.entities.entType.get.type;
		const next = defnext(actionType);
		promiseMW(next)(entityOps('entType','get','a')).should.eventually.equal(true).notify(defcheck(next,done));
	});
	it('Custom type entity, index', function(done) {
		const next = defnext('LOAD_ENTTYPES');
		promiseMW(next)(entityOps('entType','index')).should.eventually.equal(true).notify(defcheck(next,done));
	});
	it('Custom type entity, save', function(done) {
		const next = defnext('SAVE_ENTTYPE');
		promiseMW(next)(entityOps('entType','post',{a:'a'})).should.eventually.equal(true).notify(defcheck(next,done));
	});
	it('Custom type entity, delete', function(done) {
		const next = defnext('DELETE_ENTTYPE');
		promiseMW(next)(entityOps('entType','delete','a')).should.eventually.equal(true).notify(defcheck(next,done));
	});




});