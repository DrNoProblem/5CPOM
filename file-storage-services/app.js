const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const morgan = require('morgan');

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use("/assets", express.static(path.join(__dirname, "./assets")));

app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`${res.statusCode} | ${req.method} | ${req.originalUrl}`);
    });
    next();
});
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets/');
    },
    filename: function (req, file, cb) {
        const originalname = file.originalname;
        const extension = path.extname(originalname);
        const basename = path.basename(originalname, extension);
        fs.readdir('assets/', (err, files) => {
            if (err) { cb(err); return; }
            let count = 0;
            let newFilename = originalname;
            while (files.includes(newFilename)) {
                count++;
                newFilename = `${basename}(${count})${extension}`;
            }
            cb(null, newFilename);
        });
    }
});
const upload = multer({ storage: storage }).array('files', 99);

app.post('/upload', (req, res) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.error('Erreur lors de l\'upload:', err.message);
            console.error(err);
            return res.status(500).json({ error: err.message });
        } else if (err) {
            console.error('Erreur inattendue lors de l\'upload:', err);
            return res.status(500).json({ error: 'Une erreur est survenue lors de l\'upload des fichiers.' });
        }
        let filesInfo = req.files.map(file => ({
            fileUrl: req.protocol + '://' + req.get('host') + '/assets/' + file.filename,
            fileName: file.originalname,
            fileSize: file.size,
            fileType: file.mimetype,
        }));

        res.json({ filesInfo: filesInfo });
    });
});






app.delete('/delete', (req, res) => {
    const fileUrl = req.query.fileUrl; // Récupérer l'URL du fichier à supprimer depuis les paramètres de la requête
    if (!fileUrl) {
        return res.status(400).json({ error: 'L\'URL du fichier à supprimer est manquante.' });
    }

    const filePath = path.join(__dirname, 'assets', path.basename(fileUrl));

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Erreur lors de la suppression du fichier :', err);
            return res.status(500).json({ error: 'Une erreur est survenue lors de la suppression du fichier.' });
        }
        res.json({ message: 'Fichier supprimé avec succès' });
    });
});




const PORT = 4200;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
