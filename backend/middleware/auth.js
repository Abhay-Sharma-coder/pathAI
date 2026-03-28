import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  // Demo mode: allow requests without token
  if (!token) {
    console.log('[Auth] Demo mode - allowing request without token');
    req.userId = '66abc123demo001'; // Default demo user
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.log('[Auth] Invalid token, using demo mode');
    req.userId = '66abc123demo001'; // Fallback to demo user
    next();
  }
};
