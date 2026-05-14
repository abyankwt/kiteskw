import { Router } from 'express';
import * as galleryService from '../services/gallery.service';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    res.json(await galleryService.listGalleries(true));
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    res.json(await galleryService.getGallery(req.params.id));
  } catch (err) { next(err); }
});

export default router;
