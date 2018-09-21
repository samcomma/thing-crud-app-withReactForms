const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')

app.use(bodyParser.json())

app.use('/dist', express.static(path.join(__dirname, 'dist')))

const port = process.env.PORT || 3000
app.listen(port, ()=> console.log(`Now listening to port: ${port}`))



const Sequelize = require('sequelize')
const conn = new Sequelize(process.env.DATABASE_URL)

const Thing = conn.define('thing', {
  name: {
    type: Sequelize.STRING,
    unique: true
  }
})

const syncAndSeed = async ()=> {
  await conn.sync({ force: true })
  await Promise.all([
    Thing.create({ name: 'foo' }),
    Thing.create({ name: 'bar' }),
    Thing.create({ name: 'bazz' })
  ])
}

syncAndSeed()


app.get('/', (req, res, next)=> res.sendFile(path.join(__dirname, 'index.html')))



app.get('/api/things', (req, res, next)=> {
  Thing.findAll()
  .then(things => res.send(things))
  .catch(next)
})

// Create Thing
app.post('/api/things', (req, res, next)=> {
  Thing.create(req.body)
  .then(thing => res.send(thing))
  .catch(next)
})
