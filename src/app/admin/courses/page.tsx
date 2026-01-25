'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { Button } from '@/components/atoms';
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  CheckIcon,
  XIcon,
  SpinnerIcon,
} from '@/components/icons';
import { cn } from '@/lib/utils';

interface AdminCourse {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnailUrl: string;
  level: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminCoursesPage() {
  const { currentAccountId } = useAuth();
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<AdminCourse | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    thumbnailUrl: '',
    level: 1,
    isPublished: true,
  });
  const [formLoading, setFormLoading] = useState(false);

  // Fetch courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/courses', {
        headers: { 'x-admin-user': currentAccountId },
      });
      if (!response.ok) throw new Error('Failed to fetch courses');
      const data = await response.json();
      setCourses(data.courses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [currentAccountId]);

  // Create course
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-user': currentAccountId,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to create course');
      await fetchCourses();
      setShowCreateForm(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create course');
    } finally {
      setFormLoading(false);
    }
  };

  // Update course
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    try {
      setFormLoading(true);
      const response = await fetch('/api/admin/courses', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-user': currentAccountId,
        },
        body: JSON.stringify({ id: editingCourse.id, ...formData }),
      });
      if (!response.ok) throw new Error('Failed to update course');
      await fetchCourses();
      setEditingCourse(null);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update course');
    } finally {
      setFormLoading(false);
    }
  };

  // Toggle publish status
  const handleTogglePublish = async (course: AdminCourse) => {
    try {
      const response = await fetch('/api/admin/courses', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-user': currentAccountId,
        },
        body: JSON.stringify({ id: course.id, isPublished: !course.isPublished }),
      });
      if (!response.ok) throw new Error('Failed to update course');
      await fetchCourses();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update course');
    }
  };

  // Delete course
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      const response = await fetch(`/api/admin/courses?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-user': currentAccountId },
      });
      if (!response.ok) throw new Error('Failed to delete course');
      await fetchCourses();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete course');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      thumbnailUrl: '',
      level: 1,
      isPublished: true,
    });
  };

  const startEdit = (course: AdminCourse) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      subtitle: course.subtitle,
      description: course.description,
      thumbnailUrl: course.thumbnailUrl,
      level: course.level,
      isPublished: course.isPublished,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Courses</h1>
          <p className="text-neutral-400 mt-1">Create, edit, and manage learning courses</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="gap-2">
          <PlusIcon size="sm" />
          Add Course
        </Button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {(showCreateForm || editingCourse) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-neutral-900 rounded-xl border border-neutral-700 p-6 w-full max-w-lg mx-4">
            <h2 className="text-xl font-semibold text-white mb-4">
              {editingCourse ? 'Edit Course' : 'Create Course'}
            </h2>
            <form onSubmit={editingCourse ? handleUpdate : handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Level (1-12)</label>
                <input
                  type="number"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                  min="1"
                  max="12"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Thumbnail URL</label>
                <input
                  type="url"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-4 h-4 rounded border-neutral-700 bg-neutral-800 text-amber-500 focus:ring-amber-500/50"
                />
                <label htmlFor="isPublished" className="text-sm text-neutral-300">
                  Published (visible to users)
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingCourse(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? (
                    <SpinnerIcon size="sm" className="mr-2" />
                  ) : editingCourse ? (
                    'Save Changes'
                  ) : (
                    'Create Course'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Courses Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <SpinnerIcon size="lg" className="text-amber-400" />
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12 text-neutral-500">
          No courses created yet. Click &quot;Add Course&quot; to create one.
        </div>
      ) : (
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">Course</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">Level</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-neutral-400">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-neutral-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {course.thumbnailUrl && (
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="w-16 h-10 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <div className="font-medium text-white">{course.title}</div>
                        {course.subtitle && (
                          <div className="text-xs text-neutral-500">{course.subtitle}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-500/20 text-primary-400 font-semibold text-sm">
                      {course.level}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleTogglePublish(course)}
                      className={cn(
                        'inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full transition-colors',
                        course.isPublished
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
                      )}
                      aria-label={course.isPublished ? 'Click to unpublish' : 'Click to publish'}
                    >
                      {course.isPublished ? (
                        <>
                          <CheckIcon size="sm" />
                          Published
                        </>
                      ) : (
                        <>
                          <XIcon size="sm" />
                          Draft
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startEdit(course)}
                        className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors"
                        aria-label="Edit course"
                      >
                        <EditIcon size="sm" />
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                        aria-label="Delete course"
                      >
                        <TrashIcon size="sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
