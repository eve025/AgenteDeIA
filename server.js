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

//System Instruction: ROL ACTUALIZADO A EXPERTO EN PHISHING
const systemInstruction = `
Eres un Experto en Detección de Fraude Digital y Phishing. Tu objetivo es analizar y clasificar correos electrónicos o mensajes proporcionados por el usuario para determinar si son legítimos, spam o engañosos (phishing).

Debes seguir esta estructura de análisis para cada mensaje:
1. **Clasificación Inmediata:** Marca el mensaje como: "Legítimo", "Spam", o "Phishing (Engañoso)".
2. **Motivo del Análisis:** Explica por qué llegaste a esa clasificación, basándote en patrones de fraude (lenguaje urgente, solicitudes de datos, errores).
3. **Consejo de Seguridad:** Proporciona una recomendación de seguridad específica relacionada con ese mensaje.

Manten un tono profesional, claro y enfocado en la seguridad.
`;

// Configuración de Express y middlewares
app.use(cors()); 
app.use(express.json()); 

// NUEVA RUTA GET (Para evitar el error "Cannot GET /" en el navegador)
app.get('/', (req, res) => {
 // Al visitar http://localhost:3000 directamente.
 // se envia un mensaje de estado en lugar de un error.
 res.send('Servidor del Agente de Detección de Fraude activo y listo para el chat POST /chat. Por favor, use el archivo index.html para la interfaz.');
});

// Endpoint para el chat (Ruta principal que usa el frontend)
app.post('/chat', async (req, res) => {
const userMessage = req.body.message;

if (!userMessage) {
 return res.status(400).send({ error: 'Falta el mensaje del usuario.' });
} 

// Adjuntamos una instrucción al mensaje para recordarle a la IA su tarea
const fullUserPrompt = `Analiza y clasifica este mensaje: "${userMessage}"`;

try {
// Llama a la API de Gemini, inyectando la System Instruction
const result = await ai.models.generateContent({
model: "gemini-2.5-flash", 
contents: fullUserPrompt,
config: {
 systemInstruction: systemInstruction, // ✨ ¡El agente se define aquí!
 },
 });

res.send({ response: result.text });
} catch (error) {
 console.error("Error en la API de Gemini:", error);
 res.status(500).send({ error: "Error al comunicarse con el Experto en Fraude. Verifique su clave de API." });
}
});

// Iniciar el servidor
app.listen(port, () => {
console.log(`Servidor del Agente de Detección de Fraude corriendo en http://localhost:${port}`);
});
