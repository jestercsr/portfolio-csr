import { MongoClient, ObjectId } from 'mongodb';
import crypto from 'crypto';
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

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}

function generateToken(userId) {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
}

function verifyToken(token) {
  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}

function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}

// POST /api/auth/sign-up
async function signUp(req, res) {
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
    const user = {
      email,
      password: hashPassword(password),
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
}

// POST /api/auth/sign-in
async function signIn(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et password requis' });
    }

    const database = await connectToDatabase();
    const usersCollection = database.collection('users');

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Email ou password incorrect' });
    }

    if (!verifyPassword(password, user.password)) {
      return res.status(401).json({ error: 'Email ou password incorrect' });
    }

    const token = generateToken(user._id.toString());

    res.status(200).json({
      success: true,
      session: {
        id: token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
}

// POST /api/auth/sign-out
async function signOut(req, res) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return res.status(200).json({ success: true });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(200).json({ success: true });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error signing out:', error);
    res.status(500).json({ error: 'Erreur lors de la déconnexion' });
  }
}

// GET /api/auth/session
async function getSession(req, res) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Token invalide ou expiré' });
    }

    const database = await connectToDatabase();
    const usersCollection = database.collection('users');

    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.status(200).json({
      success: true,
      session: {
        id: token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Error getting session:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la session' });
  }
}

function healthCheck(req, res) {
  res.status(200).json({ success: true, status: 'OK' });
}

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const pathname = url.pathname;

    if (req.method === 'GET' && pathname === '/api/health') {
      return healthCheck(req, res);
    }

    if (req.method === 'POST' && pathname === '/api/auth/sign-up') {
      return await signUp(req, res);
    }

    if (req.method === 'POST' && pathname === '/api/auth/sign-in') {
      return await signIn(req, res);
    }

    if (req.method === 'POST' && pathname === '/api/auth/sign-out') {
      return await signOut(req, res);
    }

    if (req.method === 'GET' && pathname === '/api/auth/session') {
      return await getSession(req, res);
    }

    res.status(404).json({ error: 'Route non trouvée' });
  } catch (error) {
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};