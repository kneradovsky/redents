import server from './testServer';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import request from 'axios';

const testServer = new server();
const frurl = 'http://localhost:3000/demo/fruits';

describe("client demo server",function() {
  it("index",function(done) {
    request.get(frurl).then(res=> {
      res.status.should.eql(200);
      res.data.length.should.be.above(0);
      done();
      return true;
    })
  });
  it("get",function(done) {
    request.get(frurl+"/orange").then(res=> {
      res.status.should.eql(200);
      res.data.name.should.eql("orange");
      done();
      return true;
    })
  });
  it("post, existed",function(done) {
    request.post(frurl+"/orange",{id:"10",name:"orange"}).then(res=> {
      res.status.should.equal(200);
      (res.data.id==10).should.be.true;
      done();
    })
  });
  it("post, new",function(done) {
    request.post(frurl+"/pineapple",{id:"11",name:"pineapple"}).then(res=> {
      res.status.should.equal(200);
      (res.data.id==11).should.be.true;
      done();
    })
  });
  it("delete",function(done) {
    request.delete(frurl+"/apple").then(res=> {
      res.status.should.eql(204);
      done();
      return true;
    })
  });
});
