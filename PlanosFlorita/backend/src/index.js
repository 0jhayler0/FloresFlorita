const express = require('express')
const cors = require('cors')
const pool = require('./db')

const app = express()
app.use(cors())
app.use(express.json())

// GET todas las eras
app.get('/eras', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM eras ORDER BY id ASC')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST crear nueva era
app.post('/eras', async (req, res) => {
  const { bloque, nave, lado, numerodeera, metros } = req.body
  
  if (!bloque || !nave || !lado || !numerodeera || metros === undefined) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' })
  }

  try {
    const result = await pool.query(
      'INSERT INTO eras (bloque, nave, lado, numerodeera, metros) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [bloque, nave, lado, numerodeera, metros]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT actualizar era
app.put('/eras/:id', async (req, res) => {
  const { id } = req.params
  const { bloque, nave, lado, numerodeera, metros } = req.body
  
  if (!bloque || !nave || !lado || !numerodeera || metros === undefined) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' })
  }

  try {
    const result = await pool.query(
      'UPDATE eras SET bloque = $1, nave = $2, lado = $3, numerodeera = $4, metros = $5 WHERE id = $6 RETURNING *',
      [bloque, nave, lado, numerodeera, metros, id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Era no encontrada' })
    }
    
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE eliminar era
app.delete('/eras/:id', async (req, res) => {
  const { id } = req.params

  try {
    const result = await pool.query(
      'DELETE FROM eras WHERE id = $1 RETURNING *',
      [id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Era no encontrada' })
    }
    
    res.json({ message: 'Era eliminada correctamente' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Servidor listo')
})

pool.query('SELECT NOW()')
  .then(res => {
    console.log('Conectado a PostgreSQL:', res.rows[0])
  })
  .catch(err => {
    console.error('Error conectando a PostgreSQL:', err)
  })
