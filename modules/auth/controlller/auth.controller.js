import { registerClinicSchema, loginSchema } from "../validations/auth.validation.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from "../../../config/knex.js";
import { nanoid } from 'nanoid';

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      clinic_id : user.clinic_id
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const registerClinic = async (req, res) => {
  try {
    const { value, error } = registerClinicSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { clinic_name, clinic_email, clinic_phone, clinic_address, admin_name, admin_email, admin_password, phone_number } = value;

    const [existingClinic] = await db('clinics').where('email', clinic_email).limit(1);
    if (existingClinic) return res.status(400).json({ message: 'Clinic with this email already exists' });

    const [existingAdmin] = await db('users').where('email', admin_email).limit(1);
    if (existingAdmin) return res.status(400).json({ message: 'Admin email already in use' });

    await db.transaction(async (trx) => {
      const clinic_id  = nanoid();
      await trx('clinics').insert({
        id: clinic_id ,
        name: clinic_name,
        email: clinic_email,
        phone: clinic_phone,
        address: clinic_address,
        subscription_status: 'trial'
      });

      const hashedPassword = await bcrypt.hash(admin_password, 10);
      await trx('users').insert({
        id: nanoid(),
        clinic_id: clinic_id  ,
        name: admin_name,
        email: admin_email,
        password: hashedPassword,
        role: 'admin',
        status: 'pending',
        phone_number
      });

      res.status(201).json({
        message: 'Clinic registered successfully',
        clinic_id 
      });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { value, error } = loginSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password, clinic_id } = value;

    const users = await db('users')
      .where({ email })
      .select('id', 'clinic_id', 'password', 'role', 'name', 'status');

    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (users.length === 1) {
      const user = users[0];

      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      if (user.status !== 'approved') {
        return res.status(403).json({ message: 'Account approval pending' });
      }

      const token = generateToken(user);

      return res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email,
          role: user.role,
          clinic_id: user.clinic_id
        }
      });
    }

    if (!clinic_id) {
      return res.json({
        message: 'Multiple clinics found for this email. Please select a clinic.',
        clinics: users.map(user => ({
          clinic_id: user.clinic_id
        }))
      });
    }

    // Query the database directly instead of using `find()`
    const user = await db('users')
      .where({ email, clinic_id })
      .first(); // Fetch the exact user

    if (!user) return res.status(400).json({ message: 'Invalid clinic selection' });

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.status !== 'approved') {
      return res.status(403).json({ message: 'Account approval pending' });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email,
        role: user.role,
        clinic_id: user.clinic_id
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

