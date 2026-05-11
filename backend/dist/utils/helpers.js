"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugify = slugify;
exports.formatCourse = formatCourse;
exports.formatUser = formatUser;
function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
function formatCourse(row) {
    return {
        id: row.id,
        title: row.title,
        slug: row.slug,
        description: row.description,
        shortDesc: row.short_desc,
        category: row.category,
        price: parseFloat(row.price),
        discountPercent: row.discount_percent,
        effectivePrice: parseFloat(row.price) * (1 - row.discount_percent / 100),
        thumbnailUrl: row.thumbnail_url,
        galleryUrls: row.gallery_urls || [],
        duration: row.duration,
        level: row.level,
        instructor: row.instructor,
        tags: row.tags || [],
        status: row.status,
        rating: parseFloat(row.rating),
        enrollmentCount: row.enrollment_count,
        certified: row.certified,
        color: row.color,
        featured: row.featured ?? false,
        featuredOrder: row.featured_order ?? 0,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}
function formatUser(row) {
    return {
        id: row.id,
        email: row.email,
        fullName: row.full_name,
        role: row.role,
        isActive: row.is_active,
        createdAt: row.created_at,
    };
}
//# sourceMappingURL=helpers.js.map