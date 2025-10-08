// client.js (Frontend - se comunica con server.js)

async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const chatWindow = document.getElementById('chat-window');
    const message = userInput.value.trim();

    if (!message) return;

    // Mostrar el mensaje del usuario
    chatWindow.innerHTML += `<div class="user-message">Yo: ${message}</div>`;
    userInput.value = '';

    // Llamar al endpoint seguro del backend (Node.js)
    try {
        const response = await fetch('http://localhost:3000/chat', {
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

        // Mostrar la respuesta del Agente de ML
        chatWindow.innerHTML += `<div class="ai-message">Tutor ML: ${data.response}</div>`;
        chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll al final
    } catch (error) {
        console.error("Error en la comunicación:", error);
        chatWindow.innerHTML += `<div class="ai-message" style="color: red;">Error: No se pudo conectar con el servidor. Asegúrese de que 'node server.js' esté corriendo.</div>`;
    }
}
// Hacer la función accesible desde el HTML
window.sendMessage = sendMessage;