const express = require('express');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 5000;


app.get('/')

app.get('/', (req, res) => {
    res.send('loptop bazer server is running')
})


app.listen(port, () => console.log(`Loptop bazar server is running ${port}`))