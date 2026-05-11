"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.refresh = refresh;
exports.logout = logout;
exports.me = me;
exports.register = register;
exports.registerPublic = registerPublic;
exports.changePassword = changePassword;
const authService = __importStar(require("../services/auth.service"));
const pool_1 = __importDefault(require("../db/pool"));
const helpers_1 = require("../utils/helpers");
const REFRESH_COOKIE = 'kites_refresh';
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
};
async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const { accessToken, refreshToken, user, permissions } = await authService.loginUser(email, password);
        res.cookie(REFRESH_COOKIE, refreshToken, COOKIE_OPTIONS);
        res.json({ accessToken, user, permissions });
    }
    catch (err) {
        next(err);
    }
}
async function refresh(req, res, next) {
    try {
        const token = req.cookies?.[REFRESH_COOKIE];
        if (!token) {
            return res.status(401).json({ error: 'No refresh token' });
        }
        const { accessToken, refreshToken, user, permissions } = await authService.refreshAccessToken(token);
        res.cookie(REFRESH_COOKIE, refreshToken, COOKIE_OPTIONS);
        res.json({ accessToken, user, permissions });
    }
    catch (err) {
        next(err);
    }
}
async function logout(_req, res) {
    res.clearCookie(REFRESH_COOKIE, { path: '/' });
    res.json({ message: 'Logged out' });
}
async function me(req, res, next) {
    try {
        const { rows } = await pool_1.default.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
        if (rows.length === 0)
            return res.status(404).json({ error: 'User not found' });
        res.json((0, helpers_1.formatUser)(rows[0]));
    }
    catch (err) {
        next(err);
    }
}
async function register(req, res, next) {
    try {
        const { email, password, fullName, role = 'STUDENT' } = req.body;
        if (!email || !password || !fullName) {
            return res.status(400).json({ error: 'Email, password, and full name are required' });
        }
        const user = await authService.createUser(email, password, fullName, role);
        res.status(201).json(user);
    }
    catch (err) {
        next(err);
    }
}
async function registerPublic(req, res, next) {
    try {
        const { email, password, fullName } = req.body;
        if (!email || !password || !fullName) {
            return res.status(400).json({ error: 'Email, password, and full name are required' });
        }
        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }
        const user = await authService.createUser(email, password, fullName, 'STUDENT');
        res.status(201).json(user);
    }
    catch (err) {
        next(err);
    }
}
async function changePassword(req, res, next) {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new password are required' });
        }
        if (newPassword.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }
        await authService.changePassword(req.user.id, currentPassword, newPassword);
        res.json({ message: 'Password updated' });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=auth.controller.js.map