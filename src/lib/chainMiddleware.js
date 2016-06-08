/* eslint "no-console":"off" */
const chainMiddleware = store => next => action => {
    //dispatch chain actions
    if(action.status=='done' && !(action.link===undefined)) //link contains function that returns action to perform next
      store.dispatch(action.link(action.res));
    //dispatch original action
    return next(action);
  };

export default chainMiddleware;