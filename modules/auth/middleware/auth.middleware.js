import jwt from 'jsonwebtoken';
import db from "../../../config/knex.js";

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const [user] = await db('users')
      .where({ id: decoded.id, clinic_id: decoded.clinic_id })
      .limit(1);

    if (!user) {
      console.log('this.error', err);
      return res.status(401).json({ message: 'User account not found' });
    }

    req.user_id = decoded.id;
    req.user_role = decoded.role;
    req.clinic_id = decoded.clinic_id;

    next();
  } catch (err) {
    console.log('this.error', err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default authMiddleware;