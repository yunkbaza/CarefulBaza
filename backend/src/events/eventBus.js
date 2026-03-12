const EventEmitter = require('events');

// Criamos uma classe baseada no emissor de eventos nativo do Node.js
class EventBus extends EventEmitter {}

// Exportamos uma ÚNICA instância para a aplicação inteira (Padrão Singleton)
const eventBus = new EventBus();

module.exports = eventBus;