import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

let mongoClient = null;
let db = null;

async function connectToDatabase() {
  if (db) return db;

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error('MONGODB_URI not set');

  if (!mongoClient) {
    mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();
  }

  db = mongoClient.db(process.env.MONGODB_DB_NAME || 'portfolio');
  return db;
}

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

function generateToken(userId) {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
}

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et password requis' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password minimum 8 caractères' });
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ error: 'Email invalide' });
    }

    const database = await connectToDatabase();
    const usersCollection = database.collection('users');

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    const now = new Date();
    const hashedPassword = await hashPassword(password);
    
    const user = {
      email,
      password: hashedPassword,
      name: name || email.split('@')[0],
      createdAt: now,
      updatedAt: now,
    };

    const result = await usersCollection.insertOne(user);
    const userId = result.insertedId.toString();

    const token = generateToken(userId);

    res.status(201).json({
      success: true,
      session: {
        id: token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      user: {
        id: userId,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement' });
  }
};