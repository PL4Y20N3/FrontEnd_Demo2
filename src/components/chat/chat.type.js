/**
 * Chat Message Type
 * @typedef {Object} ChatMessage
 * @property {string|number} id - Unique message ID
 * @property {string} user - Display name of the user
 * @property {string} content - Message content
 * @property {string} time - Time string (e.g., "10:30" or ISO format)
 * @property {string} [location] - Optional location of the user
 */

/**
 * CommunityChatWidget Props
 * @typedef {Object} CommunityChatWidgetProps
 * @property {string} [cityName] - Name of the city for the chat
 * @property {ChatMessage[]} [messages] - Array of chat messages
 * @property {boolean} [isAuthenticated] - Whether user is authenticated
 * @property {function(string): void} onSend - Callback when sending a message
 * @property {function(): void} onLogin - Callback when login button is clicked
 * @property {function(): void} [onClose] - Optional callback when chat is closed
 */

/**
 * ChatInput Props
 * @typedef {Object} ChatInputProps
 * @property {boolean} isAuthenticated - Whether user is authenticated
 * @property {function(string): void} onSend - Callback when sending a message
 * @property {function(): void} onLogin - Callback when login button is clicked
 * @property {string} [placeholder] - Input placeholder text
 * @property {string} [cityName] - City name for dynamic placeholder
 */

/**
 * ChatMessageList Props
 * @typedef {Object} ChatMessageListProps
 * @property {ChatMessage[]} [messages] - Array of chat messages to display
 */

export default {};