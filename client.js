// client.js (Frontend - se comunica con server.js)

// URL del endpoint POST que creamos en server.js
const API_URL = 'http://localhost:3000/chat';

/**
 * Agrega un nuevo mensaje a la ventana de chat.
 * Función auxiliar para gestionar la inserción de mensajes de forma segura.
 */
function appendMessage(message, type, sender = '') {
    const chatWindow = document.getElementById('chat-window');
    const msgDiv = document.createElement('div');
    // 'message' es la clase base; 'type' es la clase específica (user-message o ai-message)
    msgDiv.classList.add('message', type); 

    const prefix = sender ? `${sender}: ` : '';
    
    // =======================================================
    // CAMBIOS APLICADOS AQUÍ: Conversión de Markdown a HTML (Necesario para el formato de la IA)
    let formattedMessage = prefix + message;
    
    // 1. Reemplaza **texto** con <strong>texto</strong> (Negrita)
    formattedMessage = formattedMessage.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // 2. Manejo de Saltos de Línea y Párrafos
    
    // NUEVO: Reemplaza separadores literales como "---" por saltos de párrafo
    formattedMessage = formattedMessage.replace(/---/g, '<br><br>');

    // El orden es importante: procesamos listas antes de saltos de línea genéricos
    // a. Convierte lista de asteriscos (seguidos de \n y espacio) a viñetas
    formattedMessage = formattedMessage.replace(/\\n\s*\*\s*/g, '<br>• '); 
    
    // b. ¡CORRECCIÓN! Convierte dos o más saltos de línea y posibles espacios 
    // intermedios en un salto de párrafo (<br><br>)
    formattedMessage = formattedMessage.replace(/(\\n\s*){2,}/g, '<br><br>');

    // c. Convierte cualquier salto de línea simple (\n) restante en un solo <br>
    formattedMessage = formattedMessage.replace(/\\n/g, '<br>');
    
    // Usamos innerHTML para renderizar el nuevo formato
    msgDiv.innerHTML = formattedMessage;
    // =======================================================

    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight; 
}

/**
 * Muestra el mensaje de bienvenida automático del agente.
 */
function displayWelcomeMessage() {
    const welcomeText = "Hola. Soy tu Experto en Fraude Digital.\nEstoy listo para analizar cualquier correo electrónico o mensaje sospechoso que pegues en la caja de abajo. ¡Tu seguridad es mi prioridad!";
    // Muestra el mensaje con la nueva etiqueta
    appendMessage(welcomeText, 'ai-message', 'Experto en Fraude');
}

async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();

    if (!message) return;

    // Mostrar el mensaje del usuario (usando la función auxiliar)
    appendMessage(message, 'user-message', 'Yo');
    userInput.value = '';

    // Llama al endpoint seguro del backend (Node.js)
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message }),
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }

        // Mostrar la respuesta del Experto en Fraude (¡Etiqueta corregida!)
        appendMessage(data.response, 'ai-message', 'Experto en Fraude');
    } catch (error) {
        console.error("Error en la comunicación:", error);
        // Mensaje de error (usando la función auxiliar)
        appendMessage(`Error: No se pudo conectar con el servidor. Asegúrese de que 'node server.js' esté corriendo.`, 'ai-message', 'Sistema');
    }
}

// Hacer la función accesible desde el HTML
window.sendMessage = sendMessage;

// **********************************************
// 1. INICIALIZACIÓN Y MENSAJE DE BIENVENIDA
// **********************************************
document.addEventListener('DOMContentLoaded', () => {
    // 1. Muestra el mensaje de bienvenida tan pronto como el DOM carga
    displayWelcomeMessage(); 

    // 2. Adjuntamos la función sendMessage al botón 'Analizar' (ya que el HTML no lo hace)
    const sendButton = document.querySelector('#controls button');
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
    
    // El evento 'onkeydown' para Enter ya está en el index.html, pero esta es la lógica central.
});
