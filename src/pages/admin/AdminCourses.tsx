import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CourseFormDialog } from '@/components/admin/CourseFormDialog';
import { useAdminCourses, useDeleteCourse, usePublishCourse, type ApiCourse } from '@/hooks/useCourses';
import toast from 'react-hot-toast';

const statusBadge = (status: string) => {
  if (status === 'published') return <Badge className="bg-green-100 text-green-700 border-0">Published</Badge>;
  if (status === 'archived') return <Badge className="bg-gray-100 text-gray-600 border-0">Archived</Badge>;
  return <Badge className="bg-yellow-100 text-yellow-700 border-0">Draft</Badge>;
};

const levelBadge = (level: string) => {
  const colors: Record<string, string> = {
    Beginner: 'bg-blue-50 text-blue-700',
    Intermediate: 'bg-purple-50 text-purple-700',
    Advanced: 'bg-orange-50 text-orange-700',
    Professional: 'bg-red-50 text-red-700',
  };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[level] || ''}`}>{level}</span>;
};

export default function AdminCourses() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<ApiCourse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiCourse | null>(null);

  const { data, isLoading } = useAdminCourses({ page, limit: 15, search, category, status });
  const deleteCourse = useDeleteCourse();
  const publishCourse = usePublishCourse();

  const courses: ApiCourse[] = data?.data || [];
  const pagination = data?.pagination;

  const handleEdit = (course: ApiCourse) => {
    setEditCourse(course);
    setFormOpen(true);
  };

  const handleNew = () => {
    setEditCourse(null);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCourse.mutateAsync(deleteTarget.id);
      toast.success('Course archived');
    } catch {
      toast.error('Failed to archive course');
    }
    setDeleteTarget(null);
  };

  const handleTogglePublish = async (course: ApiCourse) => {
    try {
      await publishCourse.mutateAsync({ id: course.id, publish: course.status !== 'published' });
      toast.success(course.status === 'published' ? 'Course unpublished' : 'Course published');
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Courses</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {pagination?.total ?? 0} courses total
          </p>
        </div>
        <Button onClick={handleNew} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus size={16} className="mr-1.5" /> New Course
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-8"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <Select value={category} onValueChange={(v) => { setCategory(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {['CAD Design','Simulation','Fluid Dynamics','Sustainability','MEP Systems','Electrical','Civil Engineering','Programming'].map(c => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => { setStatus(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12"></TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Enrollments</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <Loader2 size={20} className="animate-spin mx-auto text-gray-400" />
                </TableCell>
              </TableRow>
            ) : courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-gray-400 text-sm">
                  No courses found
                </TableCell>
              </TableRow>
            ) : courses.map((course) => (
              <TableRow key={course.id} className="hover:bg-gray-50">
                <TableCell>
                  <div
                    className="w-9 h-9 rounded-md overflow-hidden bg-gray-100 shrink-0"
                    style={{ borderLeft: `3px solid ${course.color}` }}
                  >
                    {course.thumbnailUrl ? (
                      <img src={course.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">{course.title}</p>
                  {course.instructor && (
                    <p className="text-xs text-gray-400">{course.instructor}</p>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">{course.category}</span>
                </TableCell>
                <TableCell>{levelBadge(course.level)}</TableCell>
                <TableCell>
                  <span className="text-sm text-gray-900">
                    {course.price === 0 ? 'Free' : `KWD ${course.effectivePrice.toFixed(3)}`}
                    {course.discountPercent > 0 && (
                      <span className="text-xs text-green-600 ml-1">-{course.discountPercent}%</span>
                    )}
                  </span>
                </TableCell>
                <TableCell>{statusBadge(course.status)}</TableCell>
                <TableCell className="text-right">
                  <span className="text-sm font-medium text-gray-900">
                    {course.enrollmentCount.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => handleTogglePublish(course)}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
                      title={course.status === 'published' ? 'Unpublish' : 'Publish'}
                    >
                      {course.status === 'published' ? <EyeOff size={14} /> : <Eye size={14} />}
                    </Button>
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => handleEdit(course)}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => setDeleteTarget(course)}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page === pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}

      {/* Course Form Dialog */}
      <CourseFormDialog
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditCourse(null); }}
        course={editCourse}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive course?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.title}" will be archived and hidden from the public. This can be undone by an admin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
