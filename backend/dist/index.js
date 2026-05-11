"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const pool_1 = __importDefault(require("./db/pool"));
const PORT = parseInt(process.env.PORT || '3001');
async function start() {
    // Test DB connection
    try {
        const client = await pool_1.default.connect();
        client.release();
        console.log('✅ Database connected');
    }
    catch (err) {
        console.error('❌ Database connection failed:', err);
        process.exit(1);
    }
    app_1.default.listen(PORT, () => {
        console.log(`🚀 KITES API running on http://localhost:${PORT}`);
        console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}
start();
//# sourceMappingURL=index.js.map