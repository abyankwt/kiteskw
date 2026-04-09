import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Upload, X } from 'lucide-react';
import { useCreateCourse, useUpdateCourse, type ApiCourse } from '@/hooks/useCourses';
import toast from 'react-hot-toast';

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  shortDesc: z.string().optional(),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  price: z.number().min(0).default(0),
  discountPercent: z.number().min(0).max(100).default(0),
  duration: z.string().optional(),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Professional']).default('Intermediate'),
  instructor: z.string().optional(),
  tags: z.string().optional(),
  certified: z.boolean().default(false),
  color: z.string().default('#6b7280'),
  status: z.enum(['draft', 'published']).default('draft'),
});

type FormValues = z.infer<typeof schema>;

const CATEGORIES = [
  'CAD Design', 'Simulation', 'Fluid Dynamics', 'Sustainability',
  'MEP Systems', 'Electrical', 'Civil Engineering', 'Programming',
];

interface Props {
  open: boolean;
  onClose: () => void;
  course?: ApiCourse | null;
}

export function CourseFormDialog({ open, onClose, course }: Props) {
  const isEdit = !!course;
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      price: 0, discountPercent: 0, certified: false,
      color: '#6b7280', status: 'draft', level: 'Intermediate',
    },
  });

  useEffect(() => {
    if (course) {
      reset({
        title: course.title,
        shortDesc: course.shortDesc || '',
        description: course.description || '',
        category: course.category,
        price: course.price,
        discountPercent: course.discountPercent,
        duration: course.duration || '',
        level: course.level as any,
        instructor: course.instructor || '',
        tags: course.tags?.join(', ') || '',
        certified: course.certified,
        color: course.color,
        status: course.status as any,
      });
      if (course.thumbnailUrl) setThumbnailPreview(course.thumbnailUrl);
    } else {
      reset({ price: 0, discountPercent: 0, certified: false, color: '#6b7280', status: 'draft', level: 'Intermediate' });
      setThumbnailFile(null);
      setThumbnailPreview(null);
    }
  }, [course, open]);

  const handleThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: FormValues) => {
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, String(v));
    });
    if (thumbnailFile) fd.append('thumbnail', thumbnailFile);

    try {
      if (isEdit && course) {
        await updateCourse.mutateAsync({ id: course.id, formData: fd });
        toast.success('Course updated');
      } else {
        await createCourse.mutateAsync(fd);
        toast.success('Course created');
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to save course');
    }
  };

  const certified = watch('certified');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Course' : 'New Course'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Thumbnail */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Thumbnail</Label>
            <div className="mt-1.5 flex items-center gap-3">
              {thumbnailPreview ? (
                <div className="relative w-20 h-14 rounded-lg overflow-hidden border border-gray-200">
                  <img src={thumbnailPreview} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setThumbnailPreview(null); setThumbnailFile(null); }}
                    className="absolute top-0.5 right-0.5 bg-black/50 rounded-full p-0.5"
                  >
                    <X size={10} className="text-white" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-14 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
                  <Upload size={16} className="text-gray-400" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                id="thumbnail"
                className="hidden"
                onChange={handleThumbnail}
              />
              <label htmlFor="thumbnail">
                <Button type="button" variant="outline" size="sm" asChild>
                  <span className="cursor-pointer">Choose Image</span>
                </Button>
              </label>
            </div>
          </div>

          {/* Title */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Title *</Label>
            <Input className="mt-1.5" placeholder="Course title" {...register('title')} />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          {/* Short description */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Short Description</Label>
            <Input className="mt-1.5" placeholder="One-line summary" {...register('shortDesc')} />
          </div>

          {/* Description */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Full Description</Label>
            <Textarea className="mt-1.5" rows={3} placeholder="Detailed course description" {...register('description')} />
          </div>

          {/* Row: Category + Level */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Category *</Label>
              <Select
                defaultValue={course?.category}
                onValueChange={(v) => setValue('category', v)}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Level</Label>
              <Select
                defaultValue={course?.level || 'Intermediate'}
                onValueChange={(v) => setValue('level', v as any)}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['Beginner', 'Intermediate', 'Advanced', 'Professional'].map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row: Price + Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Price (KWD)</Label>
              <Input
                type="number" min={0} step={0.001} className="mt-1.5"
                placeholder="0.000"
                {...register('price', { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Discount (%)</Label>
              <Input
                type="number" min={0} max={100} className="mt-1.5"
                placeholder="0"
                {...register('discountPercent', { valueAsNumber: true })}
              />
            </div>
          </div>

          {/* Row: Duration + Instructor */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Duration</Label>
              <Input className="mt-1.5" placeholder="e.g. 6 Weeks, 3 Days" {...register('duration')} />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Instructor</Label>
              <Input className="mt-1.5" placeholder="Instructor name" {...register('instructor')} />
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Tags</Label>
            <Input className="mt-1.5" placeholder="CAD, SolidWorks, Design (comma-separated)" {...register('tags')} />
          </div>

          {/* Row: Status + Color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Status</Label>
              <Select
                defaultValue={course?.status || 'draft'}
                onValueChange={(v) => setValue('status', v as any)}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Accent Color</Label>
              <div className="flex items-center gap-2 mt-1.5">
                <input type="color" {...register('color')} className="w-8 h-8 rounded cursor-pointer border border-gray-200" />
                <Input className="flex-1" placeholder="#6b7280" {...register('color')} />
              </div>
            </div>
          </div>

          {/* Certified toggle */}
          <div className="flex items-center gap-3">
            <Switch
              checked={certified}
              onCheckedChange={(v) => setValue('certified', v)}
              id="certified"
            />
            <Label htmlFor="certified" className="text-sm text-gray-700 cursor-pointer">
              Includes certification
            </Label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? <><Loader2 size={14} className="mr-2 animate-spin" /> Saving...</> : isEdit ? 'Update Course' : 'Create Course'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
