var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var fetch = require('node-fetch');

var schema = buildSchema(`
  type Query {
    hello: String
    user(id: Int!): User
    stream(id: Int!): Stream
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

var fetchUser = (args) => {
  console.log(args);
  return fetch("http://tab.do/api/1/users/"+args.id).then(res => res.json()).then(resp => {
    return resp.user;
  });
}

var root = {
  hello: () => {
    return 'Hello world!';
  },
  user: fetchUser,
  stream: (args) => {
    return fetch("http://tab.do/api/1/streams/"+args.id).then(res => res.json()).then(resp => {
      var userid = resp.stream.user.id;
      var s = resp.stream;
      s.user = (obj) => {
        console.log("fetch user");
        return fetchUser({id: userid});
      }
      return s;
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
