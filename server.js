const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3300;
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'projetVue'
});

// Connexion
connection.connect(err => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
  } else {
    console.log('Connecté à la base de données MySQL !');
  }
});
function newId() {
  return new Promise((resolve, reject) => {
    connection.query('SELECT numemp FROM employe ORDER BY numemp DESC LIMIT 1', (err, result) => {
      if (err) {
        console.error('Erreur lors de la récupération du dernier enregistrement:', err);
        reject(err);
      } else {
        const lastId = result[0].numemp;
        const number = parseInt(lastId.substring(1));
        const incrementedNumber = number + 1;
        const id = 'E' + incrementedNumber.toString().padStart(3, '0');
        resolve(id);
      }
    });
  });
}
// Ajouter un nouvel employé
app.post('/api/employes', async (req, res) => {
  try {
    const id = await newId();
    const nom = req.query.nom;
    const salaire = req.query.salaire;

    // Insérer
    connection.query('INSERT INTO employe (numemp, nom, salaire) VALUES (?, ?, ?)', [id, nom, salaire], (err) => {
      if (err) {
        console.error('Erreur lors de l\'ajout de l\'employé dans la base de données:', err);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'employé dans la base de données' });
      } else {
        console.log('Employé ajouté avec succès !');
        res.status(200).json({ message: 'Employé ajouté avec succès' });
      }
    });
  } catch (err) {
    console.error('Erreur lors de la génération de la nouvelle ID:', err);
    res.status(500).json({ error: 'Erreur lors de la génération de la nouvelle ID' });
  }
});
// API pour lire les données depuis une table
app.get('/api/table', (req, res) => {
  connection.query('SELECT * FROM employe ORDER BY numemp ASC', (err, result) => {
    if (err) {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    } else {
      res.status(200).json(result);
    }
  });
});
// Update
app.put('/api/employes/:id', (req, res) => {
  const id = req.params.id;
  const nom = req.query.nom;
  const salaire = req.query.salaire;

  connection.query('UPDATE employe SET nom = ?, salaire = ? WHERE numemp = ?', [nom, salaire, id], (err, result) => {
    if (err) {
      console.error('Erreur lors de la mise à jour de l\'employé dans la base de données:', err);
      res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'employé dans la base de données' });
    } else {
      console.log('Employé mis à jour avec succès !');
      res.status(200).json({ message: 'Employé mis à jour avec succès' });
    }
  });
});
// Supprimer un employé
app.delete('/api/employes/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM employe WHERE numemp = ?', [id], (err) => {
    if (err) {
      console.error('Erreur lors de la suppression de l\'employé dans la base de données:', err);
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'employé dans la base de données' });
    } else {
      console.log('Employé supprimé avec succès !');
      res.status(200).json({ message: 'Employé supprimé avec succès' });
    }
  });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
