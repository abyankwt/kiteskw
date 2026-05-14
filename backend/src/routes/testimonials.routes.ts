import { Router } from 'express';
import * as testimonialsService from '../services/testimonials.service';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    res.json(await testimonialsService.listTestimonials(true));
  } catch (err) { next(err); }
});

export default router;
