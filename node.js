import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import mysql from "mysql2/promise"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = 3000

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())

const db = await mysql.createConnection({
  host:"localhost",
  user: "root",
  password: "GuillesS0i87db",
  database: "fecha_hora"
})

console.log("Conectado a Mysql")

app.post('/register', async (req, res) => {
  const { nombre, identificador, dia, horaInicio, horaFin } = req.body
  if (!nombre || !identificador || !dia || !horaInicio || !horaFin) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" })
  }

  try {
    let personaId
    const [personas] = await db.execute("SELECT id FROM personas WHERE identificador = ?", [identificador])
    if(personas.length === 0) {
      const [insertPersona] = await db.execute("INSERT INTO personas (nombre, identificador) VALUES (?, ?)", [nombre, identificador])
      personaId = insertPersona.insertId
    } else {
      personaId = personas[0].id
      nombre = personas[0].nombre
    }

    const [HoraIni, MinIni] = horaInicio.split(":").map(Number)
    const [HoraFi, MinFi] = horaFin.split(":").map(Number)
    const inicio = new Date()
    inicio.setHours(HoraIni, MinIni, 0, 0)
    const fin = new Date()
    fin.setHours(HoraFi, MinFi, 0, 0)

    let horasTrabajo = (fin - inicio) / (1000 * 60 *60)
    if(horasTrabajo < 0) horasTrabajo +=24
      await db.execute("INSERT INTO registros (persona_id, dia, horaInicio, horaFin, horasTrabajo) VALUES (?, ?, ?, ?, ?)", [personaId, dia, horaInicio, horaFin, horasTrabajo])


  
    res.json({ success: true })
  } catch (err){
    console.error(err)
    res.status(500).json({ error: "Error al registrar en la base de datos"})
  }
})

app.listen(port, () => {
  console.log(`Servidor funcionando en http://localhost:${port}`)
})
