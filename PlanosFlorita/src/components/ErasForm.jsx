import { useState, useEffect, useRef } from 'react'
import '../styles/ErasForm.css'

function ErasForm({ onClose }) {
  const [eras, setEras] = useState([])
  const [formData, setFormData] = useState({ bloque: '', nave: '', lado: '', numerodeera: '', metros: '' })
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [filters, setFilters] = useState({ bloque: '', nave: '', lado: '', numerodeera: '' })
  const formRef = useRef(null)
  const overlayRef = useRef(null)

  const API_URL = 'http://localhost:3000'

  useEffect(() => {
    fetchEras()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (overlayRef.current && overlayRef.current === event.target) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  const fetchEras = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/eras`)
      if (!response.ok) throw new Error('Error al cargar las eras')
      const data = await response.json()
      console.log('Eras cargadas:', data)
      setEras(data)
      setError('')
    } catch (err) {
      setError(err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'metros' ? parseFloat(value) || '' : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.bloque || !formData.nave || !formData.lado || !formData.numerodeera || formData.metros === '') {
      setError('Todos los campos son obligatorios')
      return
    }

    setLoading(true)
    try {
      const url = editingId ? `${API_URL}/eras/${editingId}` : `${API_URL}/eras`
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bloque: parseInt(formData.bloque),
          nave: parseInt(formData.nave),
          lado: formData.lado,
          numerodeera: parseInt(formData.numerodeera),
          metros: parseFloat(formData.metros)
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al guardar la era')
      }

      setSuccess(editingId ? 'Era actualizada correctamente' : 'Era creada correctamente')
      await fetchEras()
      setFormData({ bloque: '', nave: '', lado: '', numerodeera: '', metros: '' })
      setEditingId(null)
      setError('')
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (era) => {
    setFormData({ 
      bloque: era.bloque.toString(),
      nave: era.nave.toString(),
      lado: era.lado,
      numerodeera: era.numerodeera.toString(),
      metros: era.metros.toString()
    })
    setEditingId(era.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta era?')) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/eras/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al eliminar la era')
      }

      setSuccess('Era eliminada correctamente')
      await fetchEras()
      setError('')
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({ bloque: '', nave: '', lado: '', numerodeera: '', metros: '' })
    setEditingId(null)
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const clearFilters = () => {
    setFilters({ bloque: '', nave: '', lado: '', numerodeera: '' })
  }

  const filteredEras = eras.filter(era => {
    return (
      (filters.bloque === '' || Math.floor(era.bloque).toString() === filters.bloque) &&
      (filters.nave === '' || Math.floor(era.nave).toString() === filters.nave) &&
      (filters.lado === '' || era.lado === filters.lado) &&
      (filters.numerodeera === '' || era.numerodeera.toString() === filters.numerodeera)
    )
  })

  return (
    <div className="eras-form-overlay" ref={overlayRef}>
      <div className="eras-form-container" ref={formRef}>
        <h2>
          Gestionar Eras
          <button 
            type="button"
            className="close-form-btn"
            onClick={onClose}
            title="Cerrar"
          >
            ✕
          </button>
        </h2>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form className="eras-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="bloque">Bloque *</label>
            <input
              type="number"
              id="bloque"
              name="bloque"
              value={formData.bloque}
              onChange={handleInputChange}
              placeholder="Ej: 1"
              disabled={loading}
              min="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="nave">Nave *</label>
            <input
              type="number"
              id="nave"
              name="nave"
              value={formData.nave}
              onChange={handleInputChange}
              placeholder="Ej: 1"
              disabled={loading}
              min="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lado">Lado *</label>
            <select
              id="lado"
              name="lado"
              value={formData.lado}
              onChange={handleInputChange}
              disabled={loading}
            >
              <option value="">Selecciona un lado</option>
              <option value="A">A</option>
              <option value="B">B</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="numerodeera">Número de Era *</label>
            <input
              type="number"
              id="numerodeera"
              name="numerodeera"
              value={formData.numerodeera}
              onChange={handleInputChange}
              placeholder="Ej: 1"
              disabled={loading}
              min="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="metros">Largo (metros) *</label>
            <input
              type="number"
              id="metros"
              name="metros"
              value={formData.metros}
              onChange={handleInputChange}
              placeholder="Ej: 50.3"
              disabled={loading}
              step="0.1"
              min="0"
            />
          </div>
        </div>

        <div className="form-buttons">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear'}
          </button>
          {editingId && (
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="eras-list">
        <h3>Eras Existentes ({filteredEras.length})</h3>

        {eras.length > 0 && (
          <div className="filters-section">
            <h4>Filtros</h4>
            <div className="filters-grid">
              <div className="filter-group">
                <label htmlFor="filter-bloque">Bloque</label>
                <input
                  type="number"
                  id="filter-bloque"
                  name="bloque"
                  value={filters.bloque}
                  onChange={handleFilterChange}
                  placeholder="Filtrar..."
                  min="0"
                />
              </div>

              <div className="filter-group">
                <label htmlFor="filter-nave">Nave</label>
                <input
                  type="number"
                  id="filter-nave"
                  name="nave"
                  value={filters.nave}
                  onChange={handleFilterChange}
                  placeholder="Filtrar..."
                  min="0"
                />
              </div>

              <div className="filter-group">
                <label htmlFor="filter-lado">Lado</label>
                <select
                  id="filter-lado"
                  name="lado"
                  value={filters.lado}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="filter-era">Número de Era</label>
                <input
                  type="number"
                  id="filter-era"
                  name="numerodeera"
                  value={filters.numerodeera}
                  onChange={handleFilterChange}
                  placeholder="Filtrar..."
                  min="0"
                />
              </div>
            </div>

            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={clearFilters}
            >
              Limpiar Filtros
            </button>
          </div>
        )}

        {loading && !eras.length && <p className="loading">Cargando...</p>}
        
        {eras.length === 0 && !loading && (
          <p className="empty-message">No hay eras registradas</p>
        )}

        {filteredEras.length === 0 && eras.length > 0 && (
          <p className="empty-message">No se encontraron eras con esos filtros</p>
        )}

        {filteredEras.length > 0 && (
          <div className="table-responsive">
            <table className="eras-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Bloque</th>
                  <th>Nave</th>
                  <th>Lado</th>
                  <th>Era</th>
                  <th>Largo (m)</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredEras.map(era => (
                  <tr key={era.id}>
                    <td>{era.id}</td>
                    <td>{Math.floor(era.bloque)}</td>
                    <td>{Math.floor(era.nave)}</td>
                    <td>{era.lado}</td>
                    <td>{era.numerodeera}</td>
                    <td>{era.metros}</td>
                    <td className="actions">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEdit(era)}
                        title="Editar"
                        disabled={loading}
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(era.id)}
                        title="Eliminar"
                        disabled={loading}
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

export default ErasForm
