const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000

// BODY-PARSER MIDDLEWARE
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

// HANDLEBARS MIDDLEWARE
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.render('index', { stripePublicKey: process.env.STRIPE_PUBLIC_KEY })
})


app.post('/charge', (req, res) => {
  const amount = 2000
  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken
    })
    .then(customer => {
      return stripe.charges.create({
        amount,
        currency: 'usd',
        customer: customer.id,
        description: 'Happy Potter Ebook'
      })
    })
    .then(charge => {
      // New charge created on a new customer
      return res.render('success')
    })
    .catch(err => {
      // Deal with an error
      return res.send(err.message)
    })
})

app.listen(PORT, () => console.log(`Server started on ${PORT}`))
