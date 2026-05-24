// Entry point loader — ensures dotenv loads BEFORE any other module imports (ESM hoisting fix).
// In EdcSM, static imports are hoisted and run before any code, so dotenv.config()
// in server.js was executing AFTER all service modules had already read undefined env vars.
// Dynamic import() is NOT hoisted, so this guarantees env vars are populated first.

import dotenv from 'dotenv';
dotenv.config();

await import('./server.js');