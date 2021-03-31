# Setup
- `npm i apollo-server`
- `npm i graphql`
- add `index.js` with defined type and query
- open `http://localhost:4000/`
- observe

# Mutation
- move typedefs into `schema.graphql`
- introduce mutation
```graphql
mutation{
  post(url:"wwww.prisma.io", description:"Prisma replaces traditional ORMs"){
    id
  }
}
```
resolver
```javascript
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
```
output
```json
{
  "data": {
    "post": {
      "id": "link-10"
    }
  }
}
```

# adding a database
## Setup
- `npm install prisma --save-dev`
- `npx prisma init`
```graphql
// 1
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

// 2
generator client {
  provider = "prisma-client-js"
}

// 3
model Link {
  id          Int      @id @default(autoincrement())
  createdAt   DateTime @default(now())
  description String
  url         String
}
```
- `npx prisma migrate dev`
- `npx prisma generate`
- add `script.js` to `./src`
```graphql
// 1
const { PrismaClient } = require("@prisma/client")

// 2
const prisma = new PrismaClient()

//3
async function main() {
    const allLinks = await prisma.link.findMany()
    console.log(allLinks)
}

//4
main()
    .catch(e => {
        throw e
    })
    // 5
    .finally(async () => {
        await prisma.$disconnect()
    })
```
- let's run the file to query data from database, `node src/script.js`
- update `index.js` to consume `prisma client`
- `npx prisma studio` to view database in `http://localhost:5555`
- install `prisma` extension for autoformat and autocomplete.
- add model `User` and relation of `User` to model `Link`
- update migration script, `npx prisma migrate dev --name "add-user-model"`
- `npx prisma generate`

## Authentication
- move `Query`, `Mutation`, `User`, `Link` into their own file inside `resolvers` folder.
- `npm install jsonwebtoken bcryptjs`
- add data to `Link.js`
- add data to `User.js`
- adapt `Mutation.js`, add `postedBy` property.
### test authentication
- signup
```graphql
mutation {
  signup(name: "Alice", email: "alice@prisma.io", password: "graphql") {
    token
    user {
      id
    }
  }
}
```
- signin
```graphql
mutation {
  login(email: "alice@prisma.io", password: "graphql") {
    token
    user {
      id
    }
  }
}
```
- open `HTTP HEADERS`, add `Authorization` as following
- replace `__TOKEN__` with token data from previous mutation.
```json
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYxNzIwNjc1M30.6ZCAuApW0NaLlaEGjjXTUVXqIqyVR-r0zjajgC9C83c
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYxNzIwNjc1M30.6ZCAuApW0NaLlaEGjjXTUVXqIqyVR-r0zjajgC9C83c"
}
```
- create `post` with authentication header
```graphql
mutation {
  post(url: "www.graphqlconf.org", description: "An awesome GraphQL conference") {
    id
  }
}
```