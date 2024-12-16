require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");

// Initialiser l'application Express
const app = express();
app.use(express.json());

// Connexion à la base de données
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connecté à la base de données MongoDB");
    } catch (error) {
        console.error("Erreur de connexion à la base de données :", error);
        process.exit(1);
    }
};

connectDB();

// Routes API
// .GET : Retourner tous les utilisateurs
app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" });
    }
});

//  POST : Ajouter un utilisateur
app.post("/users", async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: "Erreur lors de l'ajout de l'utilisateur" });
    }
});

//  PUT : Modifier un utilisateur par ID
app.put("/users/:id", async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ error: "Utilisateur non trouvé" });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: "Erreur lors de la mise à jour de l'utilisateur" });
    }
});

//  DELETE : Supprimer un utilisateur par ID
app.delete("/users/:id", async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ error: "Utilisateur non trouvé" });
        res.status(200).json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la suppression de l'utilisateur" });
    }
});

// Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
