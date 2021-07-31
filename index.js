const express = require('express')
require('./src/db/mongoose')
const userRoute = require('./src/routes/userRoutes')
const productRoute = require('./src/routes/productRoutes')
const sellerRoute = require('./src/routes/sellerRoutes')

const app = express()
const port = process.env.PORT || 3000

// app.use(express.json())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

app.use(userRoute)
app.use(productRoute)
app.use(sellerRoute)

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.listen(port, () => {
    console.log('app running on port', port)
})