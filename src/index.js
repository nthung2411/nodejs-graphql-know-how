const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const resolvers = {
    Query: {
        info: () => `This is the API of a Hacker news Clone`,
        feed: async (parent, args, context) => await context.prisma.link.findMany(),
    },
    Mutation: {
        post: (parent, args, context, info) => {
            const link = context.prisma.link.create({
                data: {
                    url: args.url,
                    description: args.description
                }
            });
            return link;
        }
    }
}

const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();
const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
    context: {
        prisma,
    }
});
server.listen()
    .then(({ url }) => {
        console.log(`Server is running on ${url}`);
    })