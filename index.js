const express = require('express');

const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken')

require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

function verifyJWT(req, res, next) {

    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.send(401).send('You can not access here')
    }

    const token = authHeader.split('')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbiden access' })

        }
        req.decoded = decoded;
        next();
    })
}



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vczq7iu.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const laptopCollection = client.db('oldLaptopbaze').collection('alldata');
        const sellerCollection = client.db('oldLaptopbaze').collection('sellers');
        const bookingCollection = client.db('oldLaptopbaze').collection('bookings');
        const usersCollection = client.db('oldLaptopbaze').collection('users');


        app.get('/alldata', async (req, res) => {
            const model = req.query.model;
            const query = {};
            const data = await laptopCollection.find(query).toArray();

            res.send(data)
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        })


        app.get('/bookings', verifyJWT, async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const bookings = await bookingCollection.find(query).toArray();
            res.send(bookings)
        })

        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '1h' })
                return res.send({ accessToken: token })

            }
            res.status(403).send({ accessToken: '' })

        })





    }
    finally {

    }
}
run().catch(console.log);


app.get('/', (req, res) => {
    res.send('loptop bazer server is running')
})


app.listen(port, () => console.log(`Loptop bazar server is running ${port}`))