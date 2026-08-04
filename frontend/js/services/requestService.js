const requestService = {
  // User actions
  submit(payload) {
    return apiRequest('/requests', { method: 'POST', body: payload });
  },
  myRequests() {
    return apiRequest('/requests');
  },
  status(id) {
    return apiRequest(`/requests/${id}/status`);
  },
  uploadDocument(requestId, file, docType) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('docType', docType);
    return apiUpload(`/requests/${requestId}/documents`, formData);
  },
  resubmit(requestId) {
    return apiRequest(`/requests/${requestId}/resubmit`, { method: 'POST' });
  },

  // Checker actions
  checkerQueue() {
    return apiRequest('/checker/queue');
  },
  checkerForward(requestId, remarks) {
    return apiRequest(`/checker/${requestId}/forward`, { method: 'POST', body: { remarks } });
  },
  checkerReturn(requestId, remarks) {
    return apiRequest(`/checker/${requestId}/return`, { method: 'POST', body: { remarks } });
  },
  checkerVerifyDocument(requestId, docId, verificationStatus, invalidReason) {
    return apiRequest(`/checker/${requestId}/documents/${docId}`, {
      method: 'PATCH',
      body: { verificationStatus, invalidReason },
    });
  },

  // Approver actions
  approverQueue() {
    return apiRequest('/approver/queue');
  },
  approverListDepartments() {
    return apiRequest('/approver/departments');
  },
  approverApprove(requestId, remarks) {
    return apiRequest(`/approver/${requestId}/approve`, { method: 'POST', body: { remarks } });
  },
  approverReroute(requestId, targetDepartmentId, remarks) {
    return apiRequest(`/approver/${requestId}/reroute`, {
      method: 'POST',
      body: { targetDepartmentId, remarks },
    });
  },
  approverReturn(requestId, remarks) {
    return apiRequest(`/approver/${requestId}/return`, { method: 'POST', body: { remarks } });
  },

  // Admin actions
  adminAllRequests() {
    return apiRequest('/admin/requests');
  },
  adminListDepartments() {
    return apiRequest('/admin/departments');
  },
  adminCreateDepartment(name, sequenceOrder) {
    return apiRequest('/admin/departments', { method: 'POST', body: { name, sequenceOrder } });
  },
  adminUpdateDepartment(id, fields) {
    return apiRequest(`/admin/departments/${id}`, { method: 'PATCH', body: fields });
  },
  adminDeleteDepartment(id) {
    return apiRequest(`/admin/departments/${id}`, { method: 'DELETE' });
  },
  adminListUsers() {
    return apiRequest('/admin/users');
  },
  adminUpdateUser(id, fields) {
    return apiRequest(`/admin/users/${id}`, { method: 'PATCH', body: fields });
  },

  // Audit Logs
  adminAuditLogs(requestId) {
    const url = requestId ? `/admin/audit-logs?requestId=${encodeURIComponent(requestId)}` : '/admin/audit-logs';
    return apiRequest(url);
  },

  // Notification actions
  getNotifications() {
    return apiRequest('/notifications');
  },
  markNotificationRead(id) {
    return apiRequest(`/notifications/${id}/read`, { method: 'PATCH' });
  },
};