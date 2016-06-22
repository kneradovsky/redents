# Middlewares and Reducers for Redux

## Motivation
Once you're required to fetch data from the server in your Redux applications, you need to either write a custom Middleware or use redux-* modules to fetch data. Anyway you need to implement actions creators, reducers or both. If your server provides rest api for data manipulation the implementation of anything becomes boring very quickly. And Redux-redents to the rescue!!!

The module contains the implementation of the:
1. Promise middleware, supports fetching from and pulling to server data
2. Chain middleware, supports call chains for chaining you actions.
3. Dictionary reducers, provide convention based reducers to reduce server responses

You don't need to implement actions, just add reducers to the root

## Conventions and defaults
