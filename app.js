import express from 'express';
import path from 'path'
import morgan from 'morgan'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from "dotenv";
import { fileURLToPath } from 'url';

// environment: 
import initializeEnviroment from './src/environment/initialize.js';

// mysql
import connectDB from './src/model/connectDB.js';

// for our routing files
import phraseRoute from './src/routes/phraseRoute.js';
import lessonRoute from './src/routes/lessonRoute.js';

config(); //.env
initializeEnviroment();
connectDB();  // hook in the database.

// We are using ECMAScript modules, so need to supply __filename and __dirname
global.__filename = fileURLToPath(import.meta.url);
global.__dirname = path.dirname(__filename);

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
console.log(`Express Static is: ${path.join(__dirname, 'public')}`);

app.use('/phrase', phraseRoute);
app.use('/lesson',lessonRoute)
// app.use("/", (req, res) => {
//     console.log(`path ${path.resolve('public/index.html')}`)
//     res.sendFile(path.resolve("public/index.html"));
// })

app.listen(process.env.PORT || 3000, () => console.log(`Listening on Port ${process.env.PORT} || 3000`));