import { startServer } from './server.js';
import { saveData } from './save-data.js';

const server = startServer()
await saveData(6)
// server.close()
