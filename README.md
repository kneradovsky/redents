# Middlewares and Reducers for Redux

## Motivation
Once you're required to fetch data from the server in your Redux applications, you need to either write a custom Middleware or use redux-* modules to fetch data. Anyway you need to implement actions creators, reducers or both. If your server provides rest api for data manipulation the implementation of anything becomes boring very quickly. And Redux-redents to the rescue!!!

The module contains the implementation of the:
1. Promise middleware, supports fetching from and pulling to server data
2. Chain middleware, supports call chains for chaining you actions.
3. Dictionary reducers, provide convention based reducers to reduce server responses

You don't need to implement actions, just add reducers to the root

## Conventions and defaults
Redux-redents uses Entities object to get information about entities names, operations supported and their data.

Entities type structure:
```javascript
entities = {
  defaults: {
    baseUrl: //default baseUrl of the server endpoint
  },
  entities : {
    entityName : {
      operation1: {
        url: //operation url,
        request: function(data) {return request object} //- function to produce request to perform operation1
      }
    }
  }
}
```
Default operations supported are:
* index - fetches the arrays of Entities.
  * By convention uses the url ``` entities.defaults.baseUrl+"/"+entityName+"s" ```
  * By convention uses the get request
* get - fetches one entity
  * By convention uses the url ``` entities.defaults.baseUrl+"/"+entityName+"s"+"/"+data ```
  data is passed from the client code
  * By convention uses the get request
