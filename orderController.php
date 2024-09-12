<?php
session_start(); // Start a new or resume an existing session

// Initialize session arrays if not already set
if (!isset($_SESSION['pendingOrders'])) $_SESSION['pendingOrders'] = []; // Stores pending orders
if (!isset($_SESSION['completedOrders'])) $_SESSION['completedOrders'] = []; // Stores completed orders
if (!isset($_SESSION['bots'])) $_SESSION['bots'] = []; // Stores active bots

/**
 * addOrder function
 * 
 * This function is responsible for adding an order to the pending queue based on its type
 * (Normal or VIP). VIP orders are prioritized and added to the front of the queue, while 
 * normal orders are added to the end.
 *
 * @param string $type - The type of order (either 'Normal' or 'VIP')
 * 
 * The function creates a new order array with a unique ID, type (VIP/Normal), and status
 * (Pending), then adds the order to the session's pendingOrders array in the correct position.
 */
function addOrder($type)
{
    // Create a new order with a unique ID, type, and pending status
    $order = [
        'id' => uniqid(), // Generates a unique ID for the order
        'type' => $type,  // Specifies the type of the order (Normal or VIP)
        'status' => 'Pending' // Default status is 'Pending'
    ];

    // Add the order to the pending queue
    if ($type === 'VIP') {
        array_unshift($_SESSION['pendingOrders'], $order); // VIP orders go to the front of the queue
    } else {
        $_SESSION['pendingOrders'][] = $order; // Normal orders are added to the end
    }
}
