
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('assets'));

const projectRoutes = require('./routes/projectRoutes');

app.use('/', projectRoutes);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
