import { useState } from 'react';
import { Star, GripVertical, Plus, Trash2, Loader2, Search, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  useFeaturedCourses, useSetFeatured, useReorderFeatured, useAdminCourses,
  type ApiCourse,
} from '@/hooks/useCourses';
import toast from 'react-hot-toast';

export default function AdminFeaturedCourses() {
  const { data: featured = [], isLoading } = useFeaturedCourses();
  const setFeatured = useSetFeatured();
  const reorder = useReorderFeatured();
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { data: allCoursesData } = useAdminCourses({ limit: 100, status: 'published' });
  const allCourses: ApiCourse[] = allCoursesData?.data ?? [];

  const featuredIds = new Set((featured as ApiCourse[]).map((c) => c.id));
  const available = allCourses.filter(
    (c) => !featuredIds.has(c.id) &&
      c.title.toLowerCase().includes(search.toLowerCase()),
  );

  const handleRemove = async (id: string) => {
    try {
      await setFeatured.mutateAsync({ id, featured: false });
      toast.success('Removed from trending');
    } catch {
      toast.error('Failed to remove');
    }
  };

  const handleAdd = async (course: ApiCourse) => {
    try {
      await setFeatured.mutateAsync({ id: course.id, featured: true, order: (featured as ApiCourse[]).length + 1 });
      toast.success(`"${course.title}" added to trending`);
    } catch {
      toast.error('Failed to add');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const list = [...(featured as ApiCourse[])];
    const swapWith = direction === 'up' ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= list.length) return;
    [list[index], list[swapWith]] = [list[swapWith], list[index]];
    try {
      await reorder.mutateAsync(list.map((c) => c.id));
    } catch {
      toast.error('Failed to reorder');
    }
  };

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Star size={20} className="text-blue-600" />
            Trending Courses
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Control which courses appear in the "Trending Courses" section on the Training page.
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus size={16} className="mr-1.5" /> Add Course
        </Button>
      </div>

      {/* Featured list */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            {isLoading ? '…' : (featured as ApiCourse[]).length} courses displayed
          </span>
          <span className="text-xs text-gray-400">Drag or use arrows to reorder</span>
        </div>

        {isLoading ? (
          <div className="py-16 flex justify-center">
            <Loader2 size={20} className="animate-spin text-gray-400" />
          </div>
        ) : (featured as ApiCourse[]).length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            No courses featured yet. Click "Add Course" to get started.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {(featured as ApiCourse[]).map((course, index) => (
              <li key={course.id} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 group">
                {/* Drag handle (visual only) */}
                <GripVertical size={16} className="text-gray-300 cursor-grab shrink-0" />

                {/* Order number */}
                <span className="w-5 text-center text-sm font-semibold text-gray-400 shrink-0">
                  {index + 1}
                </span>

                {/* Color swatch */}
                <div
                  className="w-8 h-8 rounded-md shrink-0 bg-gray-100"
                  style={{ borderLeft: `3px solid ${course.color}` }}
                />

                {/* Course info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{course.title}</p>
                  <p className="text-xs text-gray-400">
                    {course.category} · {course.level} ·{' '}
                    {course.price === 0 ? 'Free' : `KWD ${course.effectivePrice.toFixed(3)}`}
                  </p>
                </div>

                {/* Status badge */}
                <Badge className="bg-green-100 text-green-700 border-0 shrink-0">Published</Badge>

                {/* Reorder buttons */}
                <div className="flex gap-1 shrink-0">
                  <Button
                    variant="ghost" size="sm"
                    className="h-7 w-7 p-0 text-gray-400 hover:text-blue-600"
                    disabled={index === 0}
                    onClick={() => handleMove(index, 'up')}
                    title="Move up"
                  >
                    <ArrowUp size={13} />
                  </Button>
                  <Button
                    variant="ghost" size="sm"
                    className="h-7 w-7 p-0 text-gray-400 hover:text-blue-600"
                    disabled={index === (featured as ApiCourse[]).length - 1}
                    onClick={() => handleMove(index, 'down')}
                    title="Move down"
                  >
                    <ArrowDown size={13} />
                  </Button>
                </div>

                {/* Remove */}
                <Button
                  variant="ghost" size="sm"
                  className="h-7 w-7 p-0 text-gray-300 hover:text-red-500 shrink-0"
                  onClick={() => handleRemove(course.id)}
                  title="Remove from trending"
                >
                  <Trash2 size={13} />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add course dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Add Course to Trending</DialogTitle>
          </DialogHeader>

          <div className="relative mt-2">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-8"
              placeholder="Search published courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto mt-2 -mx-1 px-1">
            {available.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                {search ? 'No courses match your search.' : 'All published courses are already featured.'}
              </p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {available.map((course) => (
                  <li
                    key={course.id}
                    className="flex items-center gap-3 px-2 py-2.5 hover:bg-gray-50 rounded-md cursor-pointer group"
                    onClick={() => handleAdd(course)}
                  >
                    <div
                      className="w-8 h-8 rounded-md shrink-0 bg-gray-100"
                      style={{ borderLeft: `3px solid ${course.color}` }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{course.title}</p>
                      <p className="text-xs text-gray-400">
                        {course.category} · {course.level} ·{' '}
                        {course.price === 0 ? 'Free' : `KWD ${course.effectivePrice.toFixed(3)}`}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 bg-blue-600 hover:bg-blue-700 text-white h-7 px-3 text-xs transition-opacity"
                    >
                      Add
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
