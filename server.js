// server.js (Backend seguro con Node.js)
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import cors from 'cors'; 

// Carga las variables del archivo .env
dotenv.config();

const app = express();
const port = 3000;

// Inicializa Gemini usando la clave oculta en la variable de entorno
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

// 🧠 System Instruction: La definición del Tutor de Machine Learning
const systemInstruction = "Eres un Tutor Experto en Machine Learning y Deep Learning. Tu objetivo es enseñar a principiantes. Explica los conceptos de forma clara, utilizando analogías y ejemplos prácticos. Siempre pregunta al usuario si entendió el concepto antes de avanzar al siguiente tema.";

// Configuración de Express y middlewares
app.use(cors()); 
app.use(express.json()); 

// Endpoint para el chat
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).send({ error: 'Falta el mensaje del usuario.' });
    }

    try {
        // Llama a la API de Gemini, inyectando la System Instruction
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash", 
            contents: userMessage,
            config: {
                systemInstruction: systemInstruction, // ✨ ¡El agente se define aquí!
            },
        });

        res.send({ response: result.text });
    } catch (error) {
        console.error("Error en la API de Gemini:", error);
        res.status(500).send({ error: "Error al comunicarse con el Tutor de ML. Verifique su clave de API." });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor del Tutor de ML corriendo en http://localhost:${port}`);
});