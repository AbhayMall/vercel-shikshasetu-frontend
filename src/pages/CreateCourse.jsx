import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import Layout from '../components/Layout';

export default function CreateCourse() {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.post('/courses', form);
      navigate(`/courses/${data.course._id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'instructor' && user?.role !== 'admin') {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center py-12 px-4">
          <div className="text-4xl mb-3">🚫</div>
          <h2 className="text-xl font-bold mb-2 text-gray-800">Access Denied</h2>
          <p className="text-gray-600 text-sm">Only instructors and admins can create courses.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold mb-1 text-gray-800">Create New Course</h1>
          <p className="text-gray-600 text-sm">Share your knowledge with students worldwide</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Title *
              </label>
              <input
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                placeholder="e.g., Introduction to Web Development"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Description *
              </label>
              <textarea
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                placeholder="Describe what students will learn in this course..."
                rows={5}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-md font-medium hover:shadow-md transition-all disabled:opacity-50 text-sm"
              >
                {loading ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></span>
                    Creating...
                  </>
                ) : (
                  'Create Course'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-md font-medium hover:border-gray-400 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2 text-sm">💡 Course Creation Tips</h3>
          <ul className="space-y-1 text-green-800 text-xs">
            <li>• Choose a clear, descriptive title</li>
            <li>• Include prerequisites and learning outcomes</li>
            <li>• Add lectures and assignments after creation</li>
            <li>• Engage with students through course chat</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}