const { MongoClient } = require('mongodb');
var dotenv = require('dotenv').config();

const dbName = 'thesis'
const client = new MongoClient(process.env.DB_URI);

class Database {
     static db;
     static conn;

     static async init(){
          try {
               this.conn = await client.connect();
               console.log('Connected succesfully to server');
               this.db = this.conn.db(dbName);
          } catch (error) {
              console.error('Error connecting to MongoDB:', error);
               process.exit(1);
          }
     } 
}

module.exports = Database