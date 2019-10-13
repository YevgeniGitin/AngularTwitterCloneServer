import mongoose from 'mongoose';
import { keys } from '..//utils/config';

const url: string = keys.dbUrl;
let db;

function connectDb() {
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
  db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log('connected to mongo data base');
  });
}
export { connectDb };
