const express = require('express');
const app = express();
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

// Connect to mongodb
const URI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`;
//const URI = process.env.MONGODB_URL

mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.Promise = global.Promise;
const db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));



app.use('/api/users',require('./routes/user'))
app.use('/api/auth',require('./routes/auth'))
app.use('/api/artwork',require('./routes/artwork'))
app.use('/api/admin',require('./routes/admin'))

require('./events/transfer')

app.get('/admin/dashboard/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin/dashboard', 'index.html'));
})


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})



app.use((req, res) => {
    res.status(404).json({
      message: 'Route Not Found',
    })
  })
  app.use((err, req, res) => {
    res.status(err.status || 500).json({
      message: err.message,
      error: err,
    })
  })
  

//starting server
const PORT = process.env.PORT || 8080
app.listen(PORT, process.env.IP, function () {
    console.log("Digiplaza Server Started on PORT: "+ PORT);
   
});
