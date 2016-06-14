import { chainMiddleware} from '../src/';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';


chai.should();
chai.use(sinonChai);



const store = {dispatch: sinon.spy((data)=>data)}
const defnext = sinon.spy((in_action)=> in_action);
const chainMW = chainMiddleware(store);

describe("Chain middleware", function() {
	beforeEach(function() {
		store.dispatch.reset();
		defnext.reset();
	});
	it('Chain action was called', function() {
		const action = {status: 'done',res: {called:false,linked:'a'}, link:(data) => data.linked};
		chainMW(defnext)(action).should.eql(action);
		defnext.should.calledOnce;
		defnext.alwaysCalledWith(action).should.equal(true);
		store.dispatch.should.calledOnce;
		store.dispatch.alwaysCalledWith(action.res.linked).should.eql(true);
		console.log(store.dispatch.returnValues[0]);
		store.dispatch.alwaysReturned('a').should.equal(true);
	});
	it('Chain action wasn\'t called (status!=done)', function() {
		const action = {status: 'inprog',res: {called:false,linked:'b'}, link:(data) => data.linked};
		chainMW(defnext)(action).should.eql(action);
		defnext.should.calledOnce;
		defnext.alwaysCalledWith(action).should.eql(true);
		store.dispatch.callCount.should.equal(0);
	});
	it('Chain action wasn\'t called (status == done, but link is undefined)', function() {
		const action = {status: 'done',res: {called:false,linked:'b'}};
		chainMW(defnext)(action).should.eql(action);
		defnext.should.calledOnce;
		defnext.alwaysCalledWith(action).should.eql(true);
		store.dispatch.callCount.should.equal(0);
	});

});