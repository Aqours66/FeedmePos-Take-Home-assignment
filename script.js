let orderId = 1; // A unique and incrementing order number
let pendingOrders = []; // Array to store pending orders
let completedOrders = []; // Array to store completed orders
let bots = []; // Array to store active bots
let currentlyProcessingOrders = {}; // Store bots' currently processing orders

// Add a new normal order
document.getElementById('addNormalOrder').addEventListener('click', function() {
    addOrder('Normal');
});

// Add a new VIP order
document.getElementById('addVipOrder').addEventListener('click', function() {
    addOrder('VIP');
});

// Add a new bot to process orders
document.getElementById('addBot').addEventListener('click', function() {
    addBot();
});

// Remove the most recent bot
document.getElementById('removeBot').addEventListener('click', function() {
    removeBot();
});

// Add an order to the pending list
function addOrder(type) {
    let newOrder = { id: orderId++, type: type }; // Create a new order object

    // Add VIP orders behind other VIP orders, but in front of normal orders
    if (type === 'VIP') {
        let vipIndex = pendingOrders.findIndex(order => order.type !== 'VIP');
        if (vipIndex === -1) vipIndex = pendingOrders.length; // No normal orders
        pendingOrders.splice(vipIndex, 0, newOrder);
    } else {
        pendingOrders.push(newOrder); // Add normal orders to the end
    }

    renderOrders(); // Update the UI
}

// Add a new bot
function addBot() {
    let botId = bots.length + 1; // Give each bot a unique ID
    let bot = setInterval(function() {
        if (pendingOrders.length > 0) {
            let order = pendingOrders.shift(); // Pick the first pending order
            currentlyProcessingOrders[botId] = order.id; // Track the bot's current order
            setTimeout(() => {
                completedOrders.push(order); // Move order to the completed list after 10 seconds
                delete currentlyProcessingOrders[botId]; // Bot finished processing the order
                renderOrders(); // Update the UI
                renderBots(); // Update bot status
            }, 10000);
            renderOrders(); // Update the UI for the order being processed
            renderBots(); // Update bot status
        }
    }, 1000); // Bot checks every second for new orders

    bots.push(bot); // Add the new bot to the bots array
    renderBots(); // Update bot status
}

// Remove the most recent bot
function removeBot() {
    let bot = bots.pop(); // Get the latest bot
    if (bot) {
        clearInterval(bot); // Stop the bot from processing
        let botId = bots.length + 1;
        // If the bot is currently processing an order, move it back to pending
        if (currentlyProcessingOrders[botId]) {
            let orderIdToReturn = currentlyProcessingOrders[botId];
            let processingOrder = completedOrders.find(order => order.id === orderIdToReturn);
            pendingOrders.unshift(processingOrder); // Return the order to pending queue
            delete currentlyProcessingOrders[botId];
        }
        renderOrders(); // Update the UI
        renderBots(); // Update bot status
    }
}

// Render the orders on the page
function renderOrders() {
    const pendingDiv = document.getElementById('pendingOrders');
    const completeDiv = document.getElementById('completedOrders');

    // Render pending orders
    pendingDiv.innerHTML = pendingOrders.map(order => `
        <div class="order ${order.type.toLowerCase()}">
            Order ${order.id} (${order.type})
        </div>
    `).join('');

    // Render completed orders
    completeDiv.innerHTML = completedOrders.map(order => `
        <div class="order ${order.type.toLowerCase()}">
            Order ${order.id} (${order.type})
        </div>
    `).join('');
}

// Render the bots' status on the page
function renderBots() {
    const botStatusDiv = document.getElementById('botStatus');

    if (bots.length === 0) {
        botStatusDiv.innerHTML = '<p>No active bots</p>';
    } else {
        botStatusDiv.innerHTML = bots.map((_, index) => {
            let botId = index + 1;
            if (currentlyProcessingOrders[botId]) {
                return `<p>Bot ${botId}: Processing Order ${currentlyProcessingOrders[botId]}</p>`;
            } else {
                return `<p>Bot ${botId}: Idle</p>`;
            }
        }).join('');
    }
}