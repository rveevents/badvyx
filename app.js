// Modal elements
const ticketModal = document.getElementById('ticketModal');
const ticketDisplayModal = document.getElementById('ticketDisplayModal');
const openTicketModalBtn = document.getElementById('openTicketModal');
const closeModalBtn = document.getElementById('closeModal');
const closeTicketDisplayBtn = document.getElementById('closeTicketDisplay');
const ticketForm = document.getElementById('ticketForm');
const submitBtn = document.getElementById('submitBtn');

// Open ticket purchase modal
openTicketModalBtn.addEventListener('click', () => {
    ticketModal.style.display = 'block';
});

// Close modals
closeModalBtn.addEventListener('click', () => {
    ticketModal.style.display = 'none';
});

closeTicketDisplayBtn.addEventListener('click', () => {
    ticketDisplayModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === ticketModal) {
        ticketModal.style.display = 'none';
    }
    if (e.target === ticketDisplayModal) {
        ticketDisplayModal.style.display = 'none';
    }
});

// Form submission
ticketForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const robloxUser = document.getElementById('robloxUser').value.trim();
    const discordUser = document.getElementById('discordUser').value.trim();
    const email = document.getElementById('email').value.trim();
    
    // Validation
    if (!robloxUser || !discordUser || !email) {
        alert('Por favor, completa todos los campos obligatorios.');
        return;
    }
    
    if (!validateEmail(email)) {
        alert('Por favor, introduce un correo electrónico válido.');
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Procesando...';
    
    try {
        const ticketId = generateTicketId();
        
        // Check Firebase connection
        console.log('Intentando conectar con Firebase...');
        
        // Save to Firestore
        const docRef = await db.collection('tickets').add({
            robloxUser: robloxUser,
            discordUser: discordUser,
            email: email,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            ticketId: ticketId
        });
        
        console.log('Entrada guardada con ID:', docRef.id);
        
        // Generate and display ticket
        generateTicket(robloxUser, ticketId);
        
        // Close purchase modal and open ticket display
        ticketModal.style.display = 'none';
        ticketDisplayModal.style.display = 'block';
        
        // Reset form
        ticketForm.reset();
        
    } catch (error) {
        console.error('Error detallado:', error);
        console.error('Código de error:', error.code);
        console.error('Mensaje de error:', error.message);
        
        let errorMessage = 'Hubo un error al procesar tu entrada.';
        
        if (error.code === 'permission-denied') {
            errorMessage = 'Error de permisos. Por favor, contacta al administrador para configurar las reglas de Firebase.';
        } else if (error.code === 'unavailable') {
            errorMessage = 'No se puede conectar con Firebase. Verifica tu conexión a internet.';
        }
        
        alert(errorMessage + '\n\nDetalles técnicos: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Confirmar Reserva';
    }
});

// Generate unique ticket ID
function generateTicketId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `AFTERSUN-${timestamp}-${random}`;
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Generate ticket HTML and QR code
function generateTicket(robloxUser, ticketId) {
    const ticketContainer = document.getElementById('ticketContainer');
    
    ticketContainer.innerHTML = `
        <div class="ticket" id="ticketElement">
            <div class="ticket-header">
                <div class="ticket-event">AFTER SUN</div>
                <div class="ticket-artist">BADVYX</div>
            </div>
            <div class="ticket-body">
                <div class="ticket-info">
                    <span class="ticket-label">Fecha:</span>
                    <span class="ticket-value">10 de Noviembre</span>
                </div>
                <div class="ticket-info">
                    <span class="ticket-label">Hora:</span>
                    <span class="ticket-value">10:00</span>
                </div>
                <div class="ticket-info">
                    <span class="ticket-label">Plataforma:</span>
                    <span class="ticket-value">Roblox</span>
                </div>
                <div class="ticket-info">
                    <span class="ticket-label">Usuario:</span>
                    <span class="ticket-value">${robloxUser}</span>
                </div>
                <div class="ticket-qr">
                    <div id="qrcode"></div>
                </div>
            </div>
            <div class="ticket-footer">
                <div class="ticket-company">RVE EVENTS</div>
                <div class="ticket-id">${ticketId}</div>
            </div>
        </div>
    `;
    
    // Generate QR code
    const qrData = JSON.stringify({
        ticketId: ticketId,
        robloxUser: robloxUser,
        event: 'After Sun',
        artist: 'BADVYX'
    });
    
    new QRCode(document.getElementById('qrcode'), {
        text: qrData,
        width: 150,
        height: 150
    });
}

// Download ticket as image
document.getElementById('downloadTicket').addEventListener('click', () => {
    const ticketElement = document.getElementById('ticketElement');
    
    if (typeof html2canvas !== 'undefined') {
        html2canvas(ticketElement, {
            backgroundColor: '#ffffff',
            scale: 2
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'entrada-aftersun-badvyx.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    } else {
        alert('Para descargar la entrada, haz una captura de pantalla de este ticket.');
    }
});

// Test Firebase connection on page load
window.addEventListener('load', () => {
    console.log('Firebase inicializado correctamente');
    console.log('Configuración:', firebase.app().options);
});
