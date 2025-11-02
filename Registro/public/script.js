async function registrar() {
    const nombre = document.getElementById("nombre").value
    const identificador = document.getElementById("identificador").value
    const dia = document.getElementById("dia").value
    const horaInicio = document.getElementById("horaInicio").value
    const horaFin = document.getElementById("horaFin").value

if (!nombre || !identificador || !dia || !horaInicio || !horaFin){
    alert("Campos obligatorios")
    return
}

try{
const res = await fetch('/register', {
    method: "POST",
    headers: { "content-type" : "application/json"},
    body: JSON.stringify({nombre, identificador, dia, horaInicio, horaFin})
})

const data = await res.json()

if (data.success) {
    alert("Registro exitoso")
} else {
    alert ("Error: " + (data.error || "desconocido"))
}
} catch (err) {
    alert("Error en la conexion al servidor")
    console.error(err)
}
}
document.getElementById("dia").valueAsDate = new Date()