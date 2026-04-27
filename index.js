const express = require("express");

const app = express();
app.use(express.json());

let characters = [
  {
    id: 1,
    nombre: "Arthas",
    colorPiel: "Blanca",
    raza: "Humano",
    fuerza: 85,
    agilidad: 60,
    magia: 40,
    conocimiento: 70
  },
  {
    id: 2,
    nombre: "Lunara",
    colorPiel: "Verde",
    raza: "Elfa",
    fuerza: 50,
    agilidad: 90,
    magia: 80,
    conocimiento: 75
  }
];

let nextId = 3;

// Ruta principal
app.get("/", (req, res) => {
  res.json({
    mensaje: "API REST RPG funcionando correctamente"
  });
});

// Crear personaje
app.post("/characters", (req, res) => {
  const { nombre, colorPiel, raza, fuerza, agilidad, magia, conocimiento } = req.body;

  if (!nombre || !colorPiel || !raza) {
    return res.status(400).json({
      mensaje: "Nombre, color de piel y raza son obligatorios"
    });
  }

  const newCharacter = {
    id: nextId++,
    nombre,
    colorPiel,
    raza,
    fuerza: Number(fuerza),
    agilidad: Number(agilidad),
    magia: Number(magia),
    conocimiento: Number(conocimiento)
  };

  characters.push(newCharacter);

  res.status(201).json({
    mensaje: "Personaje creado correctamente",
    personaje: newCharacter
  });
});

// Listar personajes
app.get("/characters", (req, res) => {
  res.json(characters);
});

// Consultar personaje por ID
app.get("/characters/:id", (req, res) => {
  const id = Number(req.params.id);
  const character = characters.find(c => c.id === id);

  if (!character) {
    return res.status(404).json({
      mensaje: "Personaje no encontrado"
    });
  }

  res.json(character);
});

// Actualizar personaje
app.put("/characters/:id", (req, res) => {
  const id = Number(req.params.id);
  const character = characters.find(c => c.id === id);

  if (!character) {
    return res.status(404).json({
      mensaje: "Personaje no encontrado"
    });
  }

  const { nombre, colorPiel, raza, fuerza, agilidad, magia, conocimiento } = req.body;

  character.nombre = nombre || character.nombre;
  character.colorPiel = colorPiel || character.colorPiel;
  character.raza = raza || character.raza;
  character.fuerza = fuerza !== undefined ? Number(fuerza) : character.fuerza;
  character.agilidad = agilidad !== undefined ? Number(agilidad) : character.agilidad;
  character.magia = magia !== undefined ? Number(magia) : character.magia;
  character.conocimiento = conocimiento !== undefined ? Number(conocimiento) : character.conocimiento;

  res.json({
    mensaje: "Personaje actualizado correctamente",
    personaje: character
  });
});

// Eliminar personaje
app.delete("/characters/:id", (req, res) => {
  const id = Number(req.params.id);
  const exists = characters.some(c => c.id === id);

  if (!exists) {
    return res.status(404).json({
      mensaje: "Personaje no encontrado"
    });
  }

  characters = characters.filter(c => c.id !== id);

  res.json({
    mensaje: "Personaje eliminado correctamente"
  });
});

// Simular batalla
app.post("/battle", (req, res) => {
  const { character1Id, character2Id } = req.body;

  const character1 = characters.find(c => c.id === Number(character1Id));
  const character2 = characters.find(c => c.id === Number(character2Id));

  if (!character1 || !character2) {
    return res.status(404).json({
      mensaje: "Uno o ambos personajes no existen"
    });
  }

  if (character1.id === character2.id) {
    return res.status(400).json({
      mensaje: "Un personaje no puede pelear contra sí mismo"
    });
  }

  const score1 = calculateBattleScore(character1);
  const score2 = calculateBattleScore(character2);

  let winner = null;

  if (score1 > score2) {
    winner = character1;
  } else if (score2 > score1) {
    winner = character2;
  }

  res.json({
    mensaje: "Batalla realizada correctamente",
    personaje1: character1.nombre,
    personaje2: character2.nombre,
    puntajePersonaje1: score1,
    puntajePersonaje2: score2,
    ganador: winner ? winner.nombre : "Empate",
    resumen: winner
      ? `${winner.nombre} gana la batalla gracias a sus atributos combinados.`
      : "La batalla terminó en empate porque ambos personajes tuvieron el mismo puntaje."
  });
});

function calculateBattleScore(character) {
  const physicalDamage = character.fuerza * 0.4;
  const evasion = character.agilidad * 0.25;
  const specialAttack = character.magia * 0.25;
  const strategyBonus = character.conocimiento * 0.1;

  return physicalDamage + evasion + specialAttack + strategyBonus;
}

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});