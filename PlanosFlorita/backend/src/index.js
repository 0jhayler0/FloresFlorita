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
    // Convertir a números enteros y generar ID
    const bloqueInt = Math.floor(bloque)
    const naveInt = Math.floor(nave)
    const eraInt = Math.floor(numerodeera)
    const id = `${bloqueInt}${naveInt}${lado}${eraInt}`

    const result = await pool.query(
      'INSERT INTO eras (id, bloque, nave, lado, numerodeera, metros) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [id, bloque, nave, lado, numerodeera, metros]
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

// GET todas las variedades
app.get('/varieties', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM varieties ORDER BY id ASC')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST crear nueva variedad
app.post('/varieties', async (req, res) => {
  const { name, color } = req.body
  
  if (!name || !color) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' })
  }

  try {
    const result = await pool.query(
      'INSERT INTO varieties (name, color) VALUES ($1, $2) RETURNING *',
      [name, color]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT actualizar variedad
app.put('/varieties/:id', async (req, res) => {
  const { id } = req.params
  const { name, color } = req.body
  
  if (!name || !color) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' })
  }

  try {
    const result = await pool.query(
      'UPDATE varieties SET name = $1, color = $2 WHERE id = $3 RETURNING *',
      [name, color, id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Variedad no encontrada' })
    }
    
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE eliminar variedad
app.delete('/varieties/:id', async (req, res) => {
  const { id } = req.params

  try {
    const result = await pool.query(
      'DELETE FROM varieties WHERE id = $1 RETURNING *',
      [id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Variedad no encontrada' })
    }
    
    res.json({ message: 'Variedad eliminada correctamente' })
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
