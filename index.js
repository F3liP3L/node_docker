const express = require('express');
const mongoose = require('mongoose');

const Animal = mongoose.model('Animal', new mongoose.Schema({
  type: String,
  status: String,
}));

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

mongoose.connect('mongodb://felipe:roo1234@mongos:27017/miapp?authSource=admin')
  .catch((error) => console.log('Ha ocurrido un problema al intentar conectarnos a la db:', error));

app.get('/', async (_req, res) => {
  console.log('Se han listado satisfactoriamente todos los animales creados.');
  const animales = await Animal.find();
  return res.send(animales);
});

app.post('/', async (req, res) => {
  console.log('Se ha creado el animal satisfactoriamente.');
  const { type, status } = req.body;

  if (!type || !status) {
    return res.status(400).send("Falta alguno de los dos parametros.");
  }

  try {
    const newAnimal = new Animal({ type, status });
    await newAnimal.save();
    return res.send(`El animal ${type} ha sido registrado con total exito.`);
  } catch (error) {
    return res.status(500).send('Error al crear el animal.');
  }
});

app.listen(3000, () => console.log('Desplegando mongoapp_docker...'));
