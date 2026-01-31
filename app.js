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
        
        // Save to Firestore
        await db.collection('tickets').add({
            robloxUser: robloxUser,
            discordUser: discordUser,
            email: email,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            ticketId: ticketId
        });
        
        // Generate and display ticket
        generateTicket(robloxUser, ticketId);
        
        // Close purchase modal and open ticket display
        ticketModal.style.display = 'none';
        ticketDisplayModal.style.display = 'block';
        
        // Reset form
        ticketForm.reset();
        
    } catch (error) {
        console.error('Error al guardar la entrada:', error);
        alert('Hubo un error al procesar tu entrada. Por favor, inténtalo de nuevo.');
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
    
    // Using html2canvas would be ideal here, but to keep it simple with pure JS:
    // We'll use a workaround by converting the ticket to canvas
    
    // For production, include html2canvas library:
    // <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    
    if (typeof html2canvas !== 'undefined') {
        html2canvas(ticketElement).then(canvas => {
            const link = document.createElement('a');
            link.download = 'entrada-aftersun-badvyx.png';
            link.href = canvas.toDataURL();
            link.click();
        });
    } else {
        alert('Para descargar la entrada, haz una captura de pantalla de este ticket.');
    }
});
