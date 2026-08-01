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

  // Approver actions
  approverQueue() {
    return apiRequest('/approver/queue');
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
};