import request from 'axios';
const dataEntities = {
  defaults: {
    baseUrl: "/demo"
  },
  entities: {
    fruit : {
/*
      post: {
        request: (data) => request.post(dataEntities.defaults.baseUrl+'/fruits',data,{headers:{"Content-Type":"application/json"}})
      }
    */
    }
  }
};

export default dataEntities;
