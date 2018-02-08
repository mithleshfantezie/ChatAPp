var port = process.env.PORT || 3000;
const path = require('path');
const express = require('express');

var app = express();

app.use(express.static(path.join(__dirname,'../public')));

const publicPath = path.join(__dirname,'../public');


app.listen(port ,()=>{
  console.log(`Server running on port ${port} `);
})
