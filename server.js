var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var fetch = require('node-fetch');

var schema = buildSchema(`
  type Query {
    user: User
    stream: Stream
  }

  type User {
    id: Int
    screen_name: String
  }

  type Stream {
    title: String
    user: User
  }
`);

var root = {
  hello: () => {
    return 'Hello world!';
  },
  user: () => {
    return fetch("http://tab.do/api/1/users/37").then(res => res.json()).then(resp => {
      return resp.user;
    });
  }
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);

console.log('Running a GraphQL API server at localhost:4000/graphql');
