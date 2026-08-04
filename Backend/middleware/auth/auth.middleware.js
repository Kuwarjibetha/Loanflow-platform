const jwt = require('jsonwebtoken');


function authenticate(req, res, next) { // Verifies JWT and attaches ( id, role, departmentId )to req.user
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}


function authorize(...allowedRoles) {   // Restricts a route to specific roles, jaise ki  authorize('checker', 'admin')
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden for this role' });
    }
    next();
  };
}

module.exports = { authenticate, authorize };
