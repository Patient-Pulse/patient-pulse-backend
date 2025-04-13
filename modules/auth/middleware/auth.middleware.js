import jwt from 'jsonwebtoken';
import db from "../../../config/knex.js";

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // First check if user exists
    const [user] = await db('users')
      .where({ id: decoded.id, clinic_id: decoded.clinic_id })
      .limit(1);

    if (!user) {
      return res.status(401).json({ message: 'User account not found' });
    }

    // Check subscription status from token
    if (decoded.subscription_status === 'expired') {
      return res.status(403).json({ 
        message: 'Subscription expired', 
        subscription_status: 'expired'
      });
    }

    // Check subscription expiry date from token
    if (decoded.subscription_expiry) {
      const now = new Date();
      const expiryDate = new Date(decoded.subscription_expiry);
      
      if (now > expiryDate) {
        return res.status(403).json({ 
          message: 'Subscription expired', 
          subscription_status: 'expired'
        });
      }
    }

    req.user_id = decoded.id;
    req.user_role = decoded.role;
    req.clinic_id = decoded.clinic_id;
    req.subscription_status = decoded.subscription_status;

    next();
  } catch (err) {
    console.log('this.error', err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default authMiddleware;