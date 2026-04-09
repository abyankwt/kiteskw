import { Request, Response, NextFunction } from 'express';
import * as coursesService from '../services/courses.service';

export async function listPublished(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await coursesService.getPublishedCourses({
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      category: req.query.category as string,
      level: req.query.level as string,
      search: req.query.search as string,
    });
    res.json(result);
  } catch (err) { next(err); }
}

export async function getBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const course = await coursesService.getCourseBySlug(req.params.slug);
    res.json(course);
  } catch (err) { next(err); }
}

export async function recordView(req: Request, res: Response, next: NextFunction) {
  try {
    await coursesService.recordView(
      req.params.id,
      req.user?.id,
      req.ip
    );
    res.json({ success: true });
  } catch (err) { next(err); }
}

// Admin controllers
export async function listAll(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await coursesService.getAllCourses({
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      category: req.query.category as string,
      level: req.query.level as string,
      status: req.query.status as string,
      search: req.query.search as string,
    });
    res.json(result);
  } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const dto = {
      title: req.body.title,
      description: req.body.description,
      shortDesc: req.body.shortDesc,
      category: req.body.category,
      price: parseFloat(req.body.price) || 0,
      discountPercent: parseInt(req.body.discountPercent) || 0,
      duration: req.body.duration,
      level: req.body.level,
      instructor: req.body.instructor,
      tags: req.body.tags ? req.body.tags.split(',').map((t: string) => t.trim()) : [],
      certified: req.body.certified === 'true',
      color: req.body.color,
      status: req.body.status || 'draft',
    };

    if (!dto.title || !dto.category) {
      return res.status(400).json({ error: 'Title and category are required' });
    }

    // Handle thumbnail upload
    if (req.file) {
      (dto as any).thumbnailUrl = `/uploads/thumbnails/${req.file.filename}`;
    }

    const course = await coursesService.createCourse(dto, req.user!.id);
    res.status(201).json(course);
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const dto: any = {};
    const fields = [
      'title', 'description', 'shortDesc', 'category', 'duration',
      'level', 'instructor', 'status', 'color',
    ];
    for (const f of fields) {
      if (req.body[f] !== undefined) dto[f] = req.body[f];
    }
    if (req.body.price !== undefined) dto.price = parseFloat(req.body.price);
    if (req.body.discountPercent !== undefined) dto.discountPercent = parseInt(req.body.discountPercent);
    if (req.body.certified !== undefined) dto.certified = req.body.certified === 'true' || req.body.certified === true;
    if (req.body.tags !== undefined) {
      dto.tags = typeof req.body.tags === 'string'
        ? req.body.tags.split(',').map((t: string) => t.trim())
        : req.body.tags;
    }
    if (req.file) {
      dto.thumbnailUrl = `/uploads/thumbnails/${req.file.filename}`;
    }

    const course = await coursesService.updateCourse(req.params.id, dto);
    res.json(course);
  } catch (err) { next(err); }
}

export async function deleteCourse(req: Request, res: Response, next: NextFunction) {
  try {
    await coursesService.deleteCourse(req.params.id);
    res.json({ message: 'Course archived' });
  } catch (err) { next(err); }
}

export async function publish(req: Request, res: Response, next: NextFunction) {
  try {
    const course = await coursesService.publishCourse(req.params.id);
    res.json(course);
  } catch (err) { next(err); }
}

export async function unpublish(req: Request, res: Response, next: NextFunction) {
  try {
    const course = await coursesService.unpublishCourse(req.params.id);
    res.json(course);
  } catch (err) { next(err); }
}
