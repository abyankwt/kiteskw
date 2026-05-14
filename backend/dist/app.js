"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const errorHandler_1 = require("./middleware/errorHandler");
// Existing routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const courses_routes_1 = __importDefault(require("./routes/courses.routes"));
const enrollments_routes_1 = __importDefault(require("./routes/enrollments.routes"));
const payments_routes_1 = __importDefault(require("./routes/payments.routes"));
const admin_courses_routes_1 = __importDefault(require("./routes/admin.courses.routes"));
const admin_users_routes_1 = __importDefault(require("./routes/admin.users.routes"));
const admin_analytics_routes_1 = __importDefault(require("./routes/admin.analytics.routes"));
const admin_enrollments_routes_1 = __importDefault(require("./routes/admin.enrollments.routes"));
const admin_payments_routes_1 = __importDefault(require("./routes/admin.payments.routes"));
// New routes
const cms_routes_1 = __importDefault(require("./routes/cms.routes"));
const media_routes_1 = __importDefault(require("./routes/media.routes"));
const admin_rbac_routes_1 = __importDefault(require("./routes/admin.rbac.routes"));
// Feature routes
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const coupons_routes_1 = __importDefault(require("./routes/coupons.routes"));
const blog_routes_1 = __importDefault(require("./routes/blog.routes"));
const testimonials_routes_1 = __importDefault(require("./routes/testimonials.routes"));
const gallery_routes_1 = __importDefault(require("./routes/gallery.routes"));
const admin_coupons_routes_1 = __importDefault(require("./routes/admin.coupons.routes"));
const admin_blog_routes_1 = __importDefault(require("./routes/admin.blog.routes"));
const admin_galleries_routes_1 = __importDefault(require("./routes/admin.galleries.routes"));
const admin_payment_settings_routes_1 = __importDefault(require("./routes/admin.payment-settings.routes"));
const app = (0, express_1.default)();
// Security
app.use((0, helmet_1.default)({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
// CORS
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:8080',
    'http://localhost:5173',
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
// Body parsing
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Logging
if (process.env.NODE_ENV !== 'test') {
    app.use((0, morgan_1.default)('dev'));
}
// Static file serving for uploads
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Existing routes
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/courses', courses_routes_1.default);
app.use('/api/v1/enrollments', enrollments_routes_1.default);
app.use('/api/v1/payments', payments_routes_1.default);
app.use('/api/v1/admin/courses', admin_courses_routes_1.default);
app.use('/api/v1/admin/users', admin_users_routes_1.default);
app.use('/api/v1/admin/analytics', admin_analytics_routes_1.default);
app.use('/api/v1/admin/enrollments', admin_enrollments_routes_1.default);
app.use('/api/v1/admin/payments', admin_payments_routes_1.default);
// New routes
app.use('/api/v1/cms', cms_routes_1.default);
app.use('/api/v1/media', media_routes_1.default);
app.use('/api/v1/admin', admin_rbac_routes_1.default);
// Feature routes — public
app.use('/api/v1/analytics', analytics_routes_1.default);
app.use('/api/v1/coupons', coupons_routes_1.default);
app.use('/api/v1/blog', blog_routes_1.default);
app.use('/api/v1/testimonials', testimonials_routes_1.default);
app.use('/api/v1/gallery', gallery_routes_1.default);
// Feature routes — admin
app.use('/api/v1/admin/coupons', admin_coupons_routes_1.default);
app.use('/api/v1/admin/blog', admin_blog_routes_1.default);
app.use('/api/v1/admin/galleries', admin_galleries_routes_1.default);
app.use('/api/v1/admin/payment-settings', admin_payment_settings_routes_1.default);
// Serve React frontend static files (production)
const distPath = path_1.default.join(__dirname, '..', '..', 'dist');
app.use(express_1.default.static(distPath));
// SPA fallback — non-API routes serve index.html
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
        return next();
    }
    res.sendFile(path_1.default.join(distPath, 'index.html'));
});
// 404 (only reached for unmatched /api/* routes)
app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
// Global error handler
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map