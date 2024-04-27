const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const app = express();
const port = 3000;

// Multer setup for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage });

// Middleware to serve static files
app.use(express.static('public'));

// API endpoint for image submission
app.post('/api/submit-images', upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
]), async (req, res) => {

    // Get the file paths of the uploaded images
    const image1Path = req.files['image1'][0].path;
    const image2Path = req.files['image2'][0].path;

    // Convert images to base64
    const image1Base64 = fs.readFileSync(image1Path, 'base64');
    const image2Base64 = fs.readFileSync(image2Path, 'base64');

    const result = await runChat(image1Base64, image2Base64);
    res.status(200).json({ message: result ? result : 'Failed to process images' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

const MODEL_NAME = "gemini-1.5-pro-latest";
const API_KEY = "AIzaSyDd0nn2FGR7byhQdFHvzA10qC4E_6ybB24";

async function runChat(image1, image2) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
        temperature: 1,
        topK: 0,
        topP: 0.95,
        maxOutputTokens: 8192,
    };

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];

    const chat = model.startChat({
        generationConfig,
        safetySettings
    });

    const result = await chat.sendMessage(`You are an image analysis agent who can recognize differences in images and describe what the differences is. If there is a person return this as a string describing the person if not return no intruder. Here are the 2 images ${image1} ${image2}`);
    const response = result.response;
    return response.text(); // Return the generated text
}