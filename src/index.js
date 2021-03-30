const { ApolloServer } = require('apollo-server');
const links = [
    {
        id: 'link-0',
        description: 'Fullstack tutorial for GraphQL',
        url: 'http://www.howtographql.com',
    }
];

let idCount = links.length;
const resolvers = {
    Query: {
        info: () => `This is the API of a Hacker news Clone`,
        feed: () => links,
    },
    Mutation: {
        post: (parent, args) => {
            const link = {
                id: `link-${idCount++}`,
                description: args.description,
                url: args.url,
            };
            links.push(link);
            return link;
        }
    }
}

const fs = require('fs');
const path = require('path');
const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers
});
server.listen()
    .then(({ url }) => {
        console.log(`Server is running on ${url}`);
    })