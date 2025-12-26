const express = require('express')
const cors = require('cors')
const pool = require('./db')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/eras', async (req, res) => {
  const result = await pool.query('SELECT * FROM eras')
  res.json(result.rows)
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Servidor listo')
})
