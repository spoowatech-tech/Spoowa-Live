import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/**
 * ProtectedRoute — wraps routes that require authentication and optionally role authorization.
 * 
 * Usage:
 *   <Route path="/admin" element={<ProtectedRoute roles={['SUPER_ADMIN']}><AdminPage /></ProtectedRoute>} />
 *   <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 */
export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-3 border-[#F4B000] border-t-transparent animate-spin" />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Role check - SUPER_ADMIN can bypass role restrictions
  if (roles.length > 0 && !roles.includes(user.role) && user.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <div className="text-center max-w-md px-6">
          <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
            <svg className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-gray-900 uppercase mb-2">Access Denied</h1>
          <p className="text-sm text-gray-500 font-medium mb-6">You don't have permission to access this page.</p>
          <a href="/" className="inline-flex items-center gap-2 rounded-full bg-[#2B1D12] text-white px-6 py-3 text-xs font-black tracking-widest uppercase hover:bg-[#F4B000] hover:text-[#2B1D12] transition-all">
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return children;
}
