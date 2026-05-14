import { Router } from 'express';
import * as testimonialsService from '../services/testimonials.service';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const location = req.query.location as string | undefined;
    res.json(await testimonialsService.listTestimonials(true, location));
  } catch (err) { next(err); }
});

export default router;
