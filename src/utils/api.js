/* eslint-disable no-unused-vars */
/**
 * API utility for making backend API calls
 */

// Get base URL from environment variable
// Vite env variables must be prefixed with VITE_ to be accessible in the frontend
// Support both VITE_BASE_URL and Vite_Base_Url for compatibility
const BASE_URL = import.meta.env.VITE_BASE_URL || 
  import.meta.env.Vite_Base_Url ||
  'http://localhost:4008';

/**
 * Make an API request
 * @param {string} endpoint - API endpoint (e.g., '/api/admin-login')
 * @param {Object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<Object>} - Response data
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  // Get token from localStorage for authenticated requests
  const token = localStorage.getItem('luumilo-admin-token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  // Add Authorization header if token exists
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  // Convert body to JSON if it's an object
  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }
  
  try {
    const response = await fetch(url, config);
    
    // Parse JSON response
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      // If response is not JSON, throw a generic error
      throw new Error(`Server returned an invalid response (${response.status})`);
    }
    
    if (!response.ok) {
      // Create an error object with the API message
      const errorMessage = data.message || data.error || `HTTP error! status: ${response.status}`;
      const error = new Error(errorMessage);
      // Attach response data for debugging
      error.response = data;
      error.status = response.status;
      throw error;
    }
    
    return data;
  } catch (error) {
    // Re-throw with a more descriptive message
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to the server. Please check if the backend is running.');
    }
    // If it's already an Error object, re-throw it
    throw error;
  }
};

/**
 * API endpoints
 */
export const api = {
  /**
   * Admin login
   * @param {string} email - Admin email
   * @param {string} password - Admin password
   * @param {string} adminSecretKey - Admin secret key (optional, will use env variable if not provided)
   * @returns {Promise<Object>} - { success, token, user }
   */
  adminLogin: async (email, password, adminSecretKey = null) => {
    // Get adminSecretKey from parameter or environment variable
    const secretKey = adminSecretKey || import.meta.env.VITE_ADMIN_SECRET_KEY || import.meta.env.Vite_Admin_Secret_Key;
    
    if (!secretKey) {
      throw new Error('Admin secret key is required. Please set VITE_ADMIN_SECRET_KEY in your .env file.');
    }
    
    return apiRequest('/api/admin-login', {
      method: 'POST',
      body: {
        email,
        password,
        adminSecretKey: secretKey,
      },
    });
  },

  /**
   * Send password reset link
   * @param {string} email - Admin email
   * @returns {Promise<Object>} - { success, message }
   */
  sendResetLink: async (email) => {
    return apiRequest('/api/send-reset-link', {
      method: 'POST',
      body: {
        email,
      },
    });
  },

  /**
   * Get platform stats (doesn't require auth)
   * @returns {Promise<Object>} - { totalSubscribers, totalActivities, completedActivities, etc. }
   */
  getPlatformStats: async () => {
    return apiRequest('/api/get-platform-stats', {
      method: 'GET',
    });
  },

  /**
   * Get admin activity stats
   * @param {string} range - Time range: "7d", "30d", or "90d"
   * @returns {Promise<Object>} - { success, cards, donut, trend }
   */
  getAdminActivityStats: async (range = '30d') => {
    return apiRequest(`/api/admin/activities/stats?range=${range}`, {
      method: 'GET',
    });
  },

  /**
   * Get admin activities list
   * @param {Object} params - Query parameters (page, limit, search, status, learningDomain, ageGroup, sort)
   * @returns {Promise<Object>} - { success, activities, pagination }
   */
  getAdminActivities: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.learningDomain) queryParams.append('learningDomain', params.learningDomain);
    if (params.ageGroup) queryParams.append('ageGroup', params.ageGroup);
    if (params.sort) queryParams.append('sort', params.sort);

    const queryString = queryParams.toString();
    const url = `/api/admin/activities${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(url, {
      method: 'GET',
    });
  },

  /**
   * Get parent-submitted activities (pending approval)
   * @returns {Promise<Array>} - Array of activities with isApproved: false and status: "Concept"
   */
  getParentApprovalActivities: async () => {
    return apiRequest('/api/get-all-parent-approval-activities', {
      method: 'GET',
    });
  },

  /**
   * Create a new activity
   * @param {Object} data - Activity data
   * @param {File[]} files - Optional files (coverImage, gallery, resources)
   * @returns {Promise<Object>} - { success, message, activity }
   */
  createActivity: async (data, files = null) => {
    // Always use FormData for create (backend expects multipart/form-data)
    const formData = new FormData();
    
    // Add all data fields to FormData
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
        if (Array.isArray(data[key])) {
          // Handle array fields
          data[key].forEach((item) => {
            formData.append(`${key}[]`, item);
          });
        } else {
          formData.append(key, data[key]);
        }
      }
    });

    // Add files
    if (files && files.coverImage) {
      formData.append('coverImage', files.coverImage);
    }
    if (files && files.gallery && Array.isArray(files.gallery) && files.gallery.length > 0) {
      files.gallery.forEach((file) => {
        formData.append('gallery', file);
      });
    }
    if (files && files.resources && Array.isArray(files.resources) && files.resources.length > 0) {
      files.resources.forEach((file) => {
        formData.append('resources', file);
      });
    }

    // FormData doesn't need Content-Type header, browser sets it automatically
    const token = localStorage.getItem('luumilo-admin-token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const BASE_URL = import.meta.env.VITE_BASE_URL || 
      import.meta.env.Vite_Base_Url ||
      'http://localhost:4008';
    
    const response = await fetch(`${BASE_URL}/api/admin/activities`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(responseData.message || responseData.error || `HTTP error! status: ${response.status}`);
      error.response = responseData;
      error.status = response.status;
      throw error;
    }
    return responseData;
  },

  /**
   * Delete an activity
   * @param {string} activityId - Activity ID to delete
   * @returns {Promise<Object>} - { success, message }
   */
  deleteActivity: async (activityId) => {
    return apiRequest(`/api/admin/activities/${activityId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Approve an activity
   * @param {string} activityId - Activity ID to approve
   * @returns {Promise<Object>} - { success, message }
   */
  approveActivity: async (activityId) => {
    return apiRequest(`/api/admin/activities/${activityId}/approve`, {
      method: 'PATCH',
    });
  },

  /**
   * Reject/Deactivate an activity
   * @param {string} activityId - Activity ID to reject/deactivate
   * @returns {Promise<Object>} - { success, message }
   */
  rejectActivity: async (activityId, rejectReason = "") => {
    return apiRequest(`/api/admin/activities/${activityId}/reject`, {
      method: 'PATCH',
      body: { rejectReason },
    });
  },

  /**
   * Update an activity
   * @param {string} activityId - Activity ID to update
   * @param {Object} data - Activity data to update
   * @param {File[]} files - Optional files (coverImage, gallery, resources)
   * @returns {Promise<Object>} - { success, message, activity }
   */
  updateActivity: async (activityId, data, files = null) => {
    // Always use FormData for update (backend expects multipart/form-data for file uploads)
    const formData = new FormData();
    
    // Add all data fields to FormData
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
        if (Array.isArray(data[key])) {
          // Handle array fields like removeGalleryUrls
          data[key].forEach((item) => {
            formData.append(`${key}[]`, item);
          });
        } else {
          formData.append(key, data[key]);
        }
      }
    });

    // Add files
    if (files && files.coverImage) {
      formData.append('coverImage', files.coverImage);
    }
    if (files && files.gallery && Array.isArray(files.gallery) && files.gallery.length > 0) {
      files.gallery.forEach((file) => {
        formData.append('gallery', file);
      });
    }
    if (files && files.resources && Array.isArray(files.resources) && files.resources.length > 0) {
      files.resources.forEach((file) => {
        formData.append('resources', file);
      });
    }

      // FormData doesn't need Content-Type header, browser sets it automatically
      const token = localStorage.getItem('luumilo-admin-token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const BASE_URL = import.meta.env.VITE_BASE_URL || 
        import.meta.env.Vite_Base_Url ||
        'http://localhost:4008';
      
      const response = await fetch(`${BASE_URL}/api/admin/activities/${activityId}`, {
        method: 'PUT',
        headers,
        body: formData,
      });

      const responseData = await response.json();
      if (!response.ok) {
        const error = new Error(responseData.message || responseData.error || `HTTP error! status: ${response.status}`);
        error.response = responseData;
        error.status = response.status;
        throw error;
      }
      return responseData;
  },

  /**
   * Get all badges
   * @returns {Promise<Array>} - Array of badges
   */
  getAllBadges: async () => {
    return apiRequest('/api/get-all-badges', {
      method: 'GET',
    });
  },

  /**
   * Get badge statistics
   * @returns {Promise<Object>} - { success, stats: { totalBadgesCreated, badgesEarned, avgCompletionRate, badgeCategories } }
   */
  getBadgeStats: async () => {
    return apiRequest('/api/badge-stats', {
      method: 'GET',
    });
  },

  /**
   * Create a new badge
   * @param {Object} data - Badge data (name, description, category)
   * @param {File} iconFile - Badge icon file
   * @returns {Promise<Object>} - { message, badge }
   */
  createBadge: async (data, iconFile) => {
    const formData = new FormData();
    formData.append('name', data.name || '');
    formData.append('description', data.description || '');
    formData.append('category', data.category || '');
    
    if (iconFile) {
      formData.append('icon', iconFile);
    }

    const token = localStorage.getItem('luumilo-admin-token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const BASE_URL = import.meta.env.VITE_BASE_URL || 
      import.meta.env.Vite_Base_Url ||
      'http://localhost:4008';
    
    const response = await fetch(`${BASE_URL}/api/create-badge`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(responseData.message || responseData.error || `HTTP error! status: ${response.status}`);
      error.response = responseData;
      error.status = response.status;
      throw error;
    }
    return responseData;
  },

  /**
   * Update a badge
   * @param {string} badgeId - Badge ID to update
   * @param {Object} data - Badge data to update
   * @param {File} iconFile - Optional new badge icon file
   * @returns {Promise<Object>} - { message, badge }
   */
  updateBadge: async (badgeId, data = {}, iconFile = null) => {
    const formData = new FormData();
    if (data.name !== undefined && data.name !== null && data.name !== '') {
      formData.append('name', data.name);
    }
    if (
      data.description !== undefined &&
      data.description !== null &&
      data.description !== ''
    ) {
      formData.append('description', data.description);
    }
    if (data.category !== undefined && data.category !== null && data.category !== '') {
      formData.append('category', data.category);
    }
    if (iconFile) {
      formData.append('icon', iconFile);
    }

    const token = localStorage.getItem('luumilo-admin-token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}/api/update-badge/${badgeId}`, {
      method: 'PUT',
      headers,
      body: formData,
    });

    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(
        responseData.message ||
          responseData.error ||
          `HTTP error! status: ${response.status}`
      );
      error.response = responseData;
      error.status = response.status;
      throw error;
    }
    return responseData;
  },

  /**
   * Delete a badge
   * @param {string} badgeId - Badge ID to delete
   * @returns {Promise<Object>} - { message }
   */
  deleteBadge: async (badgeId) => {
    return apiRequest(`/api/delete-badge/${badgeId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get all communities for admin
   * @param {Object} params - Query parameters (page, limit, search, status, category, sortBy, sortOrder)
   * @returns {Promise<Object>} - { communities, total, page, pages, stats }
   */
  getAllCommunities: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.category) queryParams.append('category', params.category);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const queryString = queryParams.toString();
    const url = `/api/get-all-communities-for-admin${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(url, {
      method: 'GET',
    });
  },

  /**
   * Get community statistics
   * @returns {Promise<Object>} - { success, stats: { totalCommunities, totalMembers, totalPosts, activeModerators } }
   */
  getCommunityStats: async () => {
    return apiRequest('/api/community-stats', {
      method: 'GET',
    });
  },

  /**
   * Delete a community
   * @param {string} communityId - Community ID to delete
   * @returns {Promise<Object>} - { message }
   */
  deleteCommunity: async (communityId) => {
    return apiRequest(`/api/delete-community/${communityId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get community posts
   * @param {string} communityId - Community ID
   * @param {Object} params - Query parameters (page, limit, status, search, sortBy, sortOrder)
   * @returns {Promise<Object>} - { posts, total, page, pages }
   */
  getCommunityPosts: async (communityId, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);
    if (params.search) queryParams.append('search', params.search);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const queryString = queryParams.toString();
    const url = `/api/get-community-posts/${communityId}/posts${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(url, {
      method: 'GET',
    });
  },

  /**
   * Manage a post (delete, restore, archive, hide, pin, unpin)
   * @param {string} communityId - Community ID
   * @param {string} postId - Post ID
   * @param {string} action - Action to perform (delete, restore, archive, hide, pin, unpin)
   * @param {string} reason - Optional reason for the action
   * @returns {Promise<Object>} - { message, post }
   */
  managePost: async (communityId, postId, action, reason = '') => {
    return apiRequest(`/api/manage-community-posts/${communityId}/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify({ action, reason }),
    });
  },

  /**
   * Get post comments
   * @param {string} postId - Post ID
   * @param {Object} params - Query parameters (page, limit, status)
   * @returns {Promise<Object>} - { comments, total, page, pages }
   */
  getPostComments: async (postId, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    const url = `/api/get-post-comments/${postId}/comments${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(url, {
      method: 'GET',
    });
  },

  /**
   * Manage a comment (delete, restore, hide)
   * @param {string} commentId - Comment ID
   * @param {string} action - Action to perform (delete, restore, hide)
   * @param {string} reason - Optional reason for the action
   * @returns {Promise<Object>} - { message, comment }
   */
  manageComment: async (commentId, action, reason = '') => {
    return apiRequest(`/api/manage-comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify({ action, reason }),
    });
  },

  /**
   * Get community reports
   * @param {string} communityId - Community ID
   * @param {Object} params - Query parameters (page, limit, status, search, sortBy, sortOrder)
   * @returns {Promise<Object>} - { reports, total, page, pages }
   */
  getCommunityReports: async (communityId, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);
    if (params.search) queryParams.append('search', params.search);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const queryString = queryParams.toString();
    const url = `/api/get-community-reports/${communityId}/reports${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(url, {
      method: 'GET',
    });
  },

  // /**
  //  * Create a community
  //  * @param {Object} data - Community data (name, description, category, isPublic, etc.)
  //  * @returns {Promise<Object>} - { message, community }
  //  */
  // createCommunity: async (data) => {
  //   return apiRequest('/api/create-community', {
  //     method: 'POST',
  //     body: JSON.stringify(data),
  //   });
  // },
/**
 * Create a community
 * Supports JSON OR multipart/form-data (thumbnail upload)
 */
createCommunity: async (data) => {
  const isFormData = typeof FormData !== "undefined" && data instanceof FormData;

  return apiRequest("/api/create-community", {
    method: "POST",
    body: isFormData ? data : JSON.stringify(data),
    headers: isFormData
      ? undefined // ✅ DO NOT set Content-Type for FormData (browser will set boundary)
      : { "Content-Type": "application/json" },
  });
},



  /**
   * Update a community
   * @param {string} communityId - Community ID
   * @param {Object} data - Community data to update
   * @returns {Promise<Object>} - { message, community }
   */
  updateCommunity: async (communityId, data) => {
    return apiRequest(`/api/update-community/${communityId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get user statistics
   * @returns {Promise<Object>} - { success, stats: { totalRegistered, activeUsers, childrenProfiles, activitiesCompleted } }
   */
  getUserStats: async () => {
    return apiRequest('/api/admin/users/stats', {
      method: 'GET',
    });
  },

  /**
   * Get all users for admin panel
   * @returns {Promise<Object>} - { success, users }
   */
  getAllUsers: async () => {
    return apiRequest('/api/admin/users', {
      method: 'GET',
    });
  },

  /**
   * Get user details with activities and stats
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - { success, user, stats, subscription }
   */
  getUserDetails: async (userId) => {
    return apiRequest(`/api/admin/users/${userId}/details`, {
      method: 'GET',
    });
  },

  /**
   * Update user status (suspend/reactivate)
   * @param {string} userId - User ID
   * @param {string} status - "active" or "suspended"
   * @returns {Promise<Object>} - { success, message, user }
   */
  updateUserStatus: async (userId, status) => {
    return apiRequest(`/api/admin/users/${userId}/status`, {
      method: 'PUT',
      body: { status },
    });
  },

  /**
   * Update a user (admin only)
   * @param {string} userId - User ID to update
   * @param {Object} data - User data to update (username, email, ageGroup, status, etc.)
   * @returns {Promise<Object>} - { success, message, user }
   */
  updateUser: async (userId, data) => {
    return apiRequest(`/api/admin/users/${userId}`, {
      method: 'PUT',
      body: data,
    });
  },

  /**
   * Delete a user
   * @param {string} userId - User ID to delete
   * @returns {Promise<Object>} - { success, message }
   */
  deleteUser: async (userId) => {
    return apiRequest(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get admin settings
   * @returns {Promise<Object>} - { success, settings }
   */
  getAdminSettings: async () => {
    return apiRequest('/api/admin/settings', {
      method: 'GET',
    });
  },

  /**
   * Update admin settings
   * @param {Object} settings - Settings object to update
   * @returns {Promise<Object>} - { success, message, settings }
   */
  updateAdminSettings: async (settings) => {
    return apiRequest('/api/admin/settings', {
      method: 'PUT',
      body: settings,
    });
  },

  /**
   * Reset admin settings to defaults
   * @returns {Promise<Object>} - { success, message, settings }
   */
  resetAdminSettings: async () => {
    return apiRequest('/api/admin/settings/reset', {
      method: 'POST',
    });
  },

  /**
   * Change admin password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} - { success, message }
   */
  changeAdminPassword: async (currentPassword, newPassword) => {
    return apiRequest('/api/admin/change-password', {
      method: 'PUT',
      body: {
        currentPassword,
        newPassword,
      },
    });
  },
};

export default api;
