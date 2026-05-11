import { Request, Response } from 'express';
import * as cmsService from '../services/cms.service';

export async function listPages(req: Request, res: Response) {
  try {
    const pages = await cmsService.getPages();
    res.json({ data: pages });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function getPage(req: Request, res: Response) {
  try {
    const page = await cmsService.getPageBySlug(req.params.slug);
    res.json({ data: page });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function publishPage(req: Request, res: Response) {
  try {
    const page = await cmsService.publishPage(req.params.slug, req.user!.id);
    res.json({ data: page });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function unpublishPage(req: Request, res: Response) {
  try {
    const page = await cmsService.unpublishPage(req.params.slug, req.user!.id);
    res.json({ data: page });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function updatePageMeta(req: Request, res: Response) {
  try {
    const page = await cmsService.updatePageMeta(req.params.slug, req.user!.id, req.body);
    res.json({ data: page });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function toggleSection(req: Request, res: Response) {
  try {
    const { is_visible } = req.body;
    if (typeof is_visible !== 'boolean') {
      return res.status(400).json({ error: 'is_visible must be a boolean' });
    }
    const section = await cmsService.toggleSection(req.params.id, is_visible);
    res.json({ data: section });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function getSectionBlocks(req: Request, res: Response) {
  try {
    const blocks = await cmsService.getSectionBlocks(req.params.id);
    res.json({ data: blocks });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function updateBlock(req: Request, res: Response) {
  try {
    const block = await cmsService.updateBlock(req.params.id, req.user!.id, req.body);
    res.json({ data: block });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function getBlockHistory(req: Request, res: Response) {
  try {
    const history = await cmsService.getBlockHistory(req.params.id);
    res.json({ data: history });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function revertBlock(req: Request, res: Response) {
  try {
    const { revision_id } = req.body;
    if (!revision_id) return res.status(400).json({ error: 'revision_id is required' });
    const block = await cmsService.revertBlock(req.params.id, revision_id, req.user!.id);
    res.json({ data: block });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
}
