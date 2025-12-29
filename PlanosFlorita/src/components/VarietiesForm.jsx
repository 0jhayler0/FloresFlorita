import { useState, useEffect, useRef } from 'react'
import '../styles/VarietiesForm.css'

function VarietiesForm({ onClose }) {
  const [varieties, setVarieties] = useState([])
  const [formData, setFormData] = useState({ name: '', color: '' })
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [filters, setFilters] = useState({ name: '', color: '' })
  const formRef = useRef(null)
  const overlayRef = useRef(null)

  const API_URL = 'http://localhost:3000'

  useEffect(() => {
    fetchVarieties()
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

  const fetchVarieties = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/varieties`)
      if (!response.ok) throw new Error('Error al cargar las variedades')
      const data = await response.json()
      console.log('Variedades cargadas:', data)
      setVarieties(data)
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
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.color) {
      setError('Todos los campos son obligatorios')
      return
    }

    setLoading(true)
    try {
      const url = editingId ? `${API_URL}/varieties/${editingId}` : `${API_URL}/varieties`
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          color: formData.color
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al guardar la variedad')
      }

      setSuccess(editingId ? 'Variedad actualizada correctamente' : 'Variedad creada correctamente')
      await fetchVarieties()
      setFormData({ name: '', color: '' })
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

  const handleEdit = (variety) => {
    setFormData({
      name: variety.name,
      color: variety.color
    })
    setEditingId(variety.id)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta variedad?')) return

    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/varieties/${id}`, { method: 'DELETE' })

      if (!response.ok) throw new Error('Error al eliminar la variedad')

      setSuccess('Variedad eliminada correctamente')
      await fetchVarieties()
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
    setFormData({ name: '', color: '' })
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
    setFilters({ name: '', color: '' })
  }

  const filteredVarieties = varieties.filter(variety => {
    return (
      (filters.name === '' || variety.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (filters.color === '' || variety.color.toLowerCase().includes(filters.color.toLowerCase()))
    )
  })

  return (
    <div className="varieties-form-overlay" ref={overlayRef}>
      <div className="varieties-form-container" ref={formRef}>
        <h2>
          Gestionar Variedades
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

        <form className="varieties-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Nombre *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ej: Tomate Cherry"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="color">Color *</label>
              <input
                type="text"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                placeholder="Ej: Rojo"
                disabled={loading}
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

        <div className="varieties-list">
          <h3>Variedades Existentes ({filteredVarieties.length})</h3>

          {varieties.length > 0 && (
            <div className="filters-section">
              <h4>Filtros</h4>
              <div className="filters-grid">
                <div className="filter-group">
                  <label htmlFor="filter-name">Nombre</label>
                  <input
                    type="text"
                    id="filter-name"
                    name="name"
                    value={filters.name}
                    onChange={handleFilterChange}
                    placeholder="Filtrar..."
                  />
                </div>

                <div className="filter-group">
                  <label htmlFor="filter-color">Color</label>
                  <input
                    type="text"
                    id="filter-color"
                    name="color"
                    value={filters.color}
                    onChange={handleFilterChange}
                    placeholder="Filtrar..."
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

          {loading && !varieties.length && <p className="loading">Cargando...</p>}
          
          {varieties.length === 0 && !loading && (
            <p className="empty-message">No hay variedades registradas</p>
          )}

          {filteredVarieties.length === 0 && varieties.length > 0 && (
            <p className="empty-message">No se encontraron variedades con esos filtros</p>
          )}

          {filteredVarieties.length > 0 && (
            <div className="table-responsive">
              <table className="varieties-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Color</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVarieties.map(variety => (
                    <tr key={variety.id}>
                      <td>{variety.id}</td>
                      <td>{variety.name}</td>
                      <td>{variety.color}</td>
                      <td className="actions">
                        <button 
                          className="btn-edit"
                          onClick={() => handleEdit(variety)}
                          title="Editar"
                          disabled={loading}
                        >
                          ✏️ Editar
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => handleDelete(variety.id)}
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

export default VarietiesForm
