import server from './testServer';
import { promiseMiddleware, createEntityOperation} from '../src/';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';

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
		},
		entGetRequest: {
			get : {
				request: (data) => new Promise((resolve,reject) => {setTimeout(()=>{resolve({get:data})},data);})
			}
		},
		entPostUrl: {
			post : {
				url : beroot+'postUrl'
			}
		},
		errEnt404: {
			get : {
				url : beroot+'error/404'
			}
		},
		errEnt400: {
			post : {
				url : beroot+'error/400'
			}
		},
		errEnt500: {
			delete : {
				url : beroot+'error/500'
			}
		},
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

/* error callback function*/
const nextError = (actionType,code) => sinon.spy((action) => {
	if(action.type == actionType+"_REQUEST") return true;
	return (action.error.status==code);
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
	it('Custom request, get', function(done) {
		const dataTime = 105;
		const next = sinon.spy((action) => {
			if(action.type == "GET_ENTGETREQUEST_REQUEST") return true;
			if(action.res.get == dataTime) return true;
			return false;
		});
		promiseMW(next)(entityOps('entGetRequest','get',dataTime)).should.eventually.equal(true).notify(defcheck(next,done));
	});

	it('Custom url, post', function(done) {
		const next = sinon.spy((action) => {
			if(action.type == "SAVE_ENTPOSTURL_REQUEST") return true;
			return action.res.data.customurl;
		});
		promiseMW(next)(entityOps('entPostUrl','post',{a:"a"})).should.eventually.equal(true).notify(defcheck(next,done));
	});


	it('Error 404, get', function(done) {
		const next = nextError("GET_ERRENT404",404);
		promiseMW(next)(entityOps('errEnt404','get',"1")).should.eventually.equal(true).notify(defcheck(next,done));
	});

	it('Error 400, post', function(done) {
		const next = nextError("SAVE_ERRENT400",400);
		promiseMW(next)(entityOps('errEnt400','post',{a:"a"})).should.eventually.equal(true).notify(defcheck(next,done));
	});

	it('Error 500, delete', function(done) {
		const next = nextError("DELETE_ERRENT500",500);
		promiseMW(next)(entityOps('errEnt500','delete',"1")).should.eventually.equal(true).notify(defcheck(next,done));
	});


});
