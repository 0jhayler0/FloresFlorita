const pool = require('./db')

async function alterErasTable() {
    try {
        // Primero, crear tabla de respaldo si no existe
        console.log('Creando tabla de respaldo...')
        await pool.query(`
            CREATE TABLE IF NOT EXISTS eras_backup AS 
            SELECT * FROM eras
        `)
        console.log('✓ Tabla de respaldo creada')

        // Eliminar la tabla original
        console.log('Eliminando tabla original...')
        await pool.query('DROP TABLE IF EXISTS eras CASCADE')
        console.log('✓ Tabla original eliminada')

        // Crear la tabla con ID VARCHAR
        console.log('Creando nueva tabla eras...')
        await pool.query(`
            CREATE TABLE eras (
                id VARCHAR(50) PRIMARY KEY,
                bloque NUMERIC,
                nave NUMERIC,
                lado VARCHAR(1),
                numerodeera INTEGER,
                metros NUMERIC
            )
        `)
        console.log('✓ Nueva tabla eras creada')

        // Copiar datos de la tabla de respaldo
        console.log('Restaurando datos...')
        await pool.query(`
            INSERT INTO eras (id, bloque, nave, lado, numerodeera, metros)
            SELECT CONCAT(bloque, nave, lado, numerodeera) as id, bloque, nave, lado, numerodeera, metros
            FROM eras_backup
        `)
        console.log('✓ Datos restaurados')

        // Eliminar tabla de respaldo
        await pool.query('DROP TABLE eras_backup')
        console.log('✓ Tabla de respaldo eliminada')

        console.log('\n✓ Migración completada exitosamente')
        process.exit(0)
    } catch (err) {
        console.error('Error:', err.message)
        process.exit(1)
    }
}

alterErasTable()
