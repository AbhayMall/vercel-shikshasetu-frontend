import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourse } from '../features/courses/courseSlice';
import { fetchLectures } from '../features/lectures/lectureSlice';
import { fetchAssignments } from '../features/assignments/assignmentSlice';
import { fetchLiveClasses } from '../features/liveclasses/liveClassSlice';
import { api } from '../lib/api';
import Layout from '../components/Layout';

export default function ManageCourse() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { current: course } = useSelector((s) => s.courses);
  const { byCourseId: lecturesByCourse } = useSelector((s) => s.lectures);
  const { byCourseId: assignmentsByCourse } = useSelector((s) => s.assignments);
  const { byCourseId: liveClassesByCourse } = useSelector((s) => s.liveClasses);
  
  const [activeTab, setActiveTab] = useState('lectures');
  const [showAddLecture, setShowAddLecture] = useState(false);
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [showAddLiveClass, setShowAddLiveClass] = useState(false);

  const lectures = lecturesByCourse[id] || [];
  const assignments = assignmentsByCourse[id] || [];
  const liveClasses = liveClassesByCourse[id] || [];

  useEffect(() => {
    dispatch(fetchCourse(id));
    dispatch(fetchLectures(id));
    dispatch(fetchAssignments(id));
    dispatch(fetchLiveClasses(id));
  }, [dispatch, id]);

  const [lectureForm, setLectureForm] = useState({ title: '', description: '', videoUrl: '', videoFile: null });
  const [assignmentForm, setAssignmentForm] = useState({ title: '', description: '', dueAt: '', attachmentFile: null });
  const [liveClassForm, setLiveClassForm] = useState({ title: '', description: '', scheduledAt: '', meetingLink: '', platform: 'zoom' });

  const handleAddLecture = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', lectureForm.title);
      formData.append('description', lectureForm.description);
      if (lectureForm.videoFile) {
        formData.append('video', lectureForm.videoFile);
      } else if (lectureForm.videoUrl) {
        formData.append('videoUrl', lectureForm.videoUrl);
      }
      
      await api.post(`/courses/${id}/lectures`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setShowAddLecture(false);
      setLectureForm({ title: '', description: '', videoUrl: '', videoFile: null });
      dispatch(fetchLectures(id));
    } catch {
      alert('Failed to add lecture');
    }
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', assignmentForm.title);
      formData.append('description', assignmentForm.description);
      formData.append('dueAt', assignmentForm.dueAt);
      
      if (assignmentForm.attachmentFile) {
        formData.append('attachment', assignmentForm.attachmentFile);
      }
      
      await api.post(`/courses/${id}/assignments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setShowAddAssignment(false);
      setAssignmentForm({ title: '', description: '', dueAt: '', attachmentFile: null });
      dispatch(fetchAssignments(id));
    } catch (error) {
      alert('Failed to add assignment: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleAddLiveClass = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/courses/${id}/liveclasses`, liveClassForm);
      setShowAddLiveClass(false);
      setLiveClassForm({ title: '', description: '', scheduledAt: '', meetingLink: '', platform: 'zoom' });
      dispatch(fetchLiveClasses(id));
    } catch {
      alert('Failed to add live class');
    }
  };

  if (!course) return <Layout><div className="text-center py-8">Loading...</div></Layout>;

  const canManage = user?.role === 'admin' || course.instructor?._id === user?.id;

  if (!canManage) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center py-12 px-4">
          <div className="text-4xl mb-3">🚫</div>
          <h2 className="text-xl font-bold mb-2 text-gray-800">Access Denied</h2>
          <p className="text-gray-600 text-sm">You don't have permission to manage this course.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Course Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white mb-6">
          <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
          <p className="text-green-100 text-sm mb-4">{course.description}</p>
          <div className="flex flex-wrap gap-3 text-xs">
            <span>👥 {course.students?.length || 0} Students</span>
            <span>📚 {lectures.length} Lectures</span>
            <span>📝 {assignments.length} Assignments</span>
            <span>🎥 {liveClasses.length} Live Classes</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="border-b flex overflow-x-auto">
            {['lectures', 'assignments', 'liveclasses', 'students'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-medium capitalize transition text-sm whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-4">
            {/* Lectures Tab */}
            {activeTab === 'lectures' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-800">Lectures</h2>
                  <button
                    onClick={() => setShowAddLecture(true)}
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-md hover:shadow-md transition-all text-sm"
                  >
                    + Add Lecture
                  </button>
                </div>

                {lectures.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    <div className="text-4xl mb-2">🎬</div>
                    <p>No lectures yet. Add your first lecture to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lectures.map((lecture, idx) => (
                      <div key={lecture._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-medium">
                                Lecture {idx + 1}
                              </span>
                              <h3 className="font-semibold text-gray-800 text-sm">{lecture.title}</h3>
                            </div>
                            <p className="text-gray-600 text-xs">{lecture.description}</p>
                          </div>
                          <Link
                            to={`/courses/${id}/lectures/${lecture._id}`}
                            className="text-green-600 hover:text-green-700 font-medium text-sm ml-4"
                          >
                            View →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Assignments Tab */}
            {activeTab === 'assignments' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-800">Assignments</h2>
                  <button
                    onClick={() => setShowAddAssignment(true)}
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-md hover:shadow-md transition-all text-sm"
                  >
                    + Add Assignment
                  </button>
                </div>

                {assignments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    <div className="text-4xl mb-2">📝</div>
                    <p>No assignments yet. Create assignments to assess student learning!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {assignments.map((assignment) => (
                      <div key={assignment._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 text-sm mb-2">{assignment.title}</h3>
                            <p className="text-gray-600 text-xs mb-2">{assignment.description}</p>
                            {assignment.dueAt && (
                              <p className="text-xs text-gray-500">
                                Due: {new Date(assignment.dueAt).toLocaleString()}
                              </p>
                            )}
                          </div>
                          <Link
                            to={`/courses/${id}/assignments/${assignment._id}/submissions`}
                            className="text-green-600 hover:text-green-700 font-medium text-sm ml-4"
                          >
                            View Submissions →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Live Classes Tab */}
            {activeTab === 'liveclasses' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-800">Live Classes</h2>
                  <button
                    onClick={() => setShowAddLiveClass(true)}
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-md hover:shadow-md transition-all text-sm"
                  >
                    + Schedule Live Class
                  </button>
                </div>

                {liveClasses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    <div className="text-4xl mb-2">🎥</div>
                    <p>No live classes scheduled. Schedule a session to interact with students!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {liveClasses.map((liveClass) => (
                      <div key={liveClass._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                                liveClass.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                                liveClass.status === 'live' ? 'bg-green-100 text-green-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {liveClass.status}
                              </span>
                              <h3 className="font-semibold text-gray-800 text-sm">{liveClass.title}</h3>
                            </div>
                            <p className="text-gray-600 text-xs mb-2">{liveClass.description}</p>
                            <p className="text-xs text-gray-500">
                              📅 {new Date(liveClass.scheduledAt).toLocaleString()} • {liveClass.duration} minutes
                            </p>
                            {liveClass.meetingLink && (
                              <a
                                href={liveClass.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-700 text-xs mt-2 inline-block"
                              >
                                Join Meeting →
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
              <div>
                <h2 className="text-lg font-bold mb-4 text-gray-800">Enrolled Students</h2>
                <div className="text-center py-8 text-gray-500 text-sm">
                  <div className="text-4xl mb-2">👥</div>
                  <p>{course.students?.length || 0} students enrolled in this course</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Lecture Modal */}
      {showAddLecture && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Lecture</h2>
            <form onSubmit={handleAddLecture} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  value={lectureForm.title}
                  onChange={(e) => setLectureForm({ ...lectureForm, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  rows={3}
                  value={lectureForm.description}
                  onChange={(e) => setLectureForm({ ...lectureForm, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video URL (YouTube, Vimeo, etc.)</label>
                <input
                  type="url"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  placeholder="https://..."
                  value={lectureForm.videoUrl}
                  onChange={(e) => setLectureForm({ ...lectureForm, videoUrl: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Or Upload Video File</label>
                <input
                  type="file"
                  accept="video/*"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
                  onChange={(e) => setLectureForm({ ...lectureForm, videoFile: e.target.files[0] })}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-md hover:shadow-md transition-all text-sm font-medium"
                >
                  Add Lecture
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddLecture(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Assignment Modal */}
      {showAddAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Assignment</h2>
            <form onSubmit={handleAddAssignment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  value={assignmentForm.title}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  rows={4}
                  value={assignmentForm.description}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="datetime-local"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  value={assignmentForm.dueAt}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, dueAt: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  📎 Attachment (Optional)
                </label>
                <div className="border border-dashed border-gray-300 rounded-md p-3 hover:border-green-400 transition-colors bg-gray-50">
                  <div className="text-center">
                    <div className="text-2xl mb-1">📁</div>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, attachmentFile: e.target.files[0] })}
                      className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-600 file:text-white hover:file:bg-green-700 cursor-pointer"
                    />
                    {!assignmentForm.attachmentFile && (
                      <p className="text-xs text-gray-600 mt-1">
                        Click to select a file or drag and drop
                      </p>
                    )}
                  </div>
                  {assignmentForm.attachmentFile && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md text-xs text-green-700 text-center">
                      <div className="flex items-center justify-center">
                        <span className="text-sm mr-1">✅</span>
                        <span className="font-medium">Selected: {assignmentForm.attachmentFile.name}</span>
                      </div>
                      <p className="text-xs text-green-600 mt-1">
                        File size: {(assignmentForm.attachmentFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  <span className="mr-1">💡</span>
                  Upload assignment instructions or reference materials (PDF, PNG, JPG formats only)
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-md hover:shadow-md transition-all text-sm font-medium"
                >
                  Add Assignment
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddAssignment(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Live Class Modal */}
      {showAddLiveClass && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Schedule Live Class</h2>
            <form onSubmit={handleAddLiveClass} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  value={liveClassForm.title}
                  onChange={(e) => setLiveClassForm({ ...liveClassForm, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  rows={3}
                  value={liveClassForm.description}
                  onChange={(e) => setLiveClassForm({ ...liveClassForm, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date & Time *</label>
                <input
                  type="datetime-local"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  value={liveClassForm.scheduledAt}
                  onChange={(e) => setLiveClassForm({ ...liveClassForm, scheduledAt: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Link</label>
                <input
                  type="url"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  placeholder="https://zoom.us/j/..."
                  value={liveClassForm.meetingLink}
                  onChange={(e) => setLiveClassForm({ ...liveClassForm, meetingLink: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <select
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  value={liveClassForm.platform}
                  onChange={(e) => setLiveClassForm({ ...liveClassForm, platform: e.target.value })}
                >
                  <option value="zoom">Zoom</option>
                  <option value="meet">Google Meet</option>
                  <option value="teams">Microsoft Teams</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-md hover:shadow-md transition-all text-sm font-medium"
                >
                  Schedule Class
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddLiveClass(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}