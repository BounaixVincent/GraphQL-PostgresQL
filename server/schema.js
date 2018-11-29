const graphql = require('graphql');
const connectionString = 'postgresql://verne:Verne@localhost:5432/vacations';
const pgp = require('pg-promise')();
const db = {}
db.conn = pgp(connectionString);
const {
   GraphQLObjectType,
   GraphQLID,
   GraphQLString,
   GraphQLBoolean,
   GraphQLList,
   GraphQLSchema,
} = graphql;
const PersonType = new GraphQLObjectType({
   name: 'Person',
   fields: () => ({
      id: { type: GraphQLID },
      firstname: { type: GraphQLString },
      lastname: { type: GraphQLString },
      emails: {
         type: new GraphQLList(EmailType),
         resolve(parentValue, args) {
            const query = `SELECT * FROM "emails" WHERE
            person=${parentValue.id}`;
            return db.conn.many(query)
               .then(data => {
                  return data;
               })
               .catch(err => {
                  return 'The error is', err;
               });
         }
      },
      vacations: {
        type: new GraphQLList(VacationType),
        resolve(parentValue, args) {
           const query = `SELECT * FROM "vacations" WHERE
           person=${parentValue.id}`;
           return db.conn.many(query)
              .then(data => {
                 return data;
              })
              .catch(err => {
                 return 'The error is', err;
              });
        }
     }
   })
})
const EmailType = new GraphQLObjectType({
   name: 'Email',
   fields: {
      id: { type: GraphQLID },
      email: { type: GraphQLString },
      primary: { type: GraphQLBoolean }
   }
})

const VacationType = new GraphQLObjectType({
    name: 'Vacation',
    fields: {
       id: { type: GraphQLID },
       balance: { type: GraphQLString }
    }
 })

const RootQuery = new GraphQLObjectType({
   name: 'RootQueryType',
   fields: {
      person: {
      type: PersonType,
      args: { id: { type: GraphQLID } },
      resolve(parentValue, args) {
         const query = `SELECT * FROM "people" WHERE id=${args.id}`;
         return db.conn.one(query)
            .then(data => {
               return data;
            })
            .catch(err => {
                return 'The error is', err;
            });
      }
   },
   emails: {
      type: EmailType,
      args: { id: { type: GraphQLID } },
      resolve(parentValue, args) {
         const query = `SELECT * FROM "emails" WHERE id=${args.id}`;
         return db.conn.one(query)
            .then(data => {
               return data;
            })
            .catch(err => {
               return 'The error is', err;
            });
        }
      }
   },
   vacations: {
    type: VacationType,
    args: { id: { type: GraphQLID } },
    resolve(parentValue, args) {
       const query = `SELECT * FROM "vacations" WHERE id=${args.id}`;
       return db.conn.one(query)
          .then(data => {
             return data;
          })
          .catch(err => {
             return 'The error is', err;
          });
      }
    }
   
})
module.exports = new GraphQLSchema({
   query: RootQuery
})