// server.js
import express, { json } from 'express';
import cors from 'cors'; 
import { writeFile } from 'fs/promises';
const app = express();
const port = 3000;

app.use(cors())

app.use(json());

app.post('/write-to-json', async (req, res) => {
  try {
    const jsonData = req.body;
    await writeFile('data.json', JSON.stringify(jsonData));
    res.status(200).send('Data written to data.json');
  } catch (error) {
    console.error('Error writing to data.json:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
