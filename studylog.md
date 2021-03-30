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