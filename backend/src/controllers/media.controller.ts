import { Request, Response } from 'express';
import * as mediaService from '../services/media.service';

export async function uploadMedia(req: Request, res: Response) {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const media = await mediaService.saveMedia({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
      storagePath: `uploads/${req.file.filename}`,
      uploadedBy: req.user!.id,
    });

    res.status(201).json({ data: media });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function listMedia(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const result = await mediaService.listMedia(page, limit);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function updateAltText(req: Request, res: Response) {
  try {
    const { alt_text } = req.body;
    if (typeof alt_text !== 'string') return res.status(400).json({ error: 'alt_text is required' });
    const media = await mediaService.updateAltText(req.params.id, alt_text);
    res.json({ data: media });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function deleteMedia(req: Request, res: Response) {
  try {
    await mediaService.deleteMedia(req.params.id);
    res.json({ message: 'Media deleted' });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
}
