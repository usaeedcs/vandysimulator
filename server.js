const express = require('express');
const multer = require('multer');
const unzipper = require('unzipper');
const fs = require('fs').promises;

const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/upload', upload.single('zipfile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const zipFilePath = req.file.path;


        const extractionPath = `uploads/extracted_${Date.now()}`;
        await fs.mkdir(extractionPath);


        await fs.createReadStream(zipFilePath)
            .pipe(unzipper.Extract({ path: extractionPath }))
            .promise();
        const extractedFiles = await fs.readdir(extractionPath);

    
        res.send(`Extracted files: ${extractedFiles.join(', ')}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred during file upload.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
