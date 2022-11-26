const express = require('express');

const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const app = express();


require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vczq7iu.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const laptopCollection = client.db('oldLaptopbaze').collection('alldata')

        app.get('/alldata', async (req, res) => {

            const query = {};
            const data = await laptopCollection.find(query).toArray();
            res.send(data)
        })

    }
    finally {

    }
}
run().catch(console.log);




const homedisplaylap = require('./Homedata.json');
const laptopdetails = require('./Alldata.json');
const { query } = require('express');

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