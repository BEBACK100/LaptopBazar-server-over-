const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const port = process.env.PORT || 5000;


const homedisplaylap = require('./Homedata.json');
const laptopdetails = require('./Alldata.json')

app.get('/homeDisplay', (req, res) => {
    res.send(homedisplaylap)
})
app.get('/allLaptop', (req, res) => {
    res.send(laptopdetails)
})

app.get('/laptopdetails/:id', (req, res) => {
    const id = req.params.id;
    const selectedlaptop = laptopdetails.find(n => n.id == id)
    res.send(selectedlaptop)
})

app.get('/', (req, res) => {
    res.send('loptop bazer server is running')
})


app.listen(port, () => console.log(`Loptop bazar server is running ${port}`))