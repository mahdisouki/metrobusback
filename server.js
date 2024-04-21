const express =  require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')
const adminRoute = require('./routes/adminRoute')
require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());  
app.use(cors())

app.use('/admin' , adminRoute);

require('./db/cnx');




app.listen(5000 , ()=>console.log("server is running  on port 5000"));