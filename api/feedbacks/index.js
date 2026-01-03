import { MongoClient, ObjectId } from 'mongodb';

let mongoClient = null;
let db = null;

async function connectToDatabase() {
  if (db) {
    return db;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not set');
  }

  if (!mongoClient) {
    mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();
  }

  db = mongoClient.db(process.env.MONGODB_DB_NAME || 'portfolio');
  return db;
}

function verifyAuth(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  return !!authHeader;
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' ? forwarded.split(',')[0] : req.socket.remoteAddress;
  return ip || 'unknown';
}

// POST /api/feedbacks - Créer un feedback (PUBLIC)
async function createFeedback(req, res) {
  try {
    const { type, title, message, email, rating, pageUrl } = req.body;

    if (!type || !title || !message || !pageUrl) {
      return res.status(400).json({ error: 'Champs obligatoires manquants' });
    }

    if (!['bug', 'suggestion', 'compliment'].includes(type)) {
      return res.status(400).json({ error: 'Type de feedback invalide' });
    }

    if (title.length < 5 || title.length > 200) {
      return res.status(400).json({ error: 'Le titre doit contenir entre 5 et 200 caractères' });
    }

    if (message.length < 10 || message.length > 5000) {
      return res.status(400).json({ error: 'Le message doit contenir entre 10 et 5000 caractères' });
    }

    if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ error: 'Email invalide' });
    }

    const database = await connectToDatabase();
    const feedbacksCollection = database.collection('feedbacks');

    const now = new Date();
    const feedback = {
      type,
      title,
      message,
      email: email || undefined,
      rating: rating ? Math.min(5, Math.max(1, parseInt(rating))) : undefined,
      pageUrl,
      userAgent: req.headers['user-agent'],
      ipAddress: getClientIp(req),
      timestamp: now,
      resolved: false,
      createdAt: now,
      updatedAt: now,
    };

    const result = await feedbacksCollection.insertOne(feedback);

    console.log(`[${now.toISOString()}] Nouveau feedback: ${type} - ${title}`);

    res.status(201).json({
      success: true,
      data: {
        _id: result.insertedId.toString(),
        ...feedback,
      }
    });
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ error: 'Erreur lors de la création du feedback' });
  }
}

// GET /api/feedbacks - Lister les feedbacks (AUTHENTIFIÉ)
async function getFeedbacks(req, res) {
  try {
    if (!verifyAuth(req)) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const database = await connectToDatabase();
    const feedbacksCollection = database.collection('feedbacks');

    const { type, resolved, search, page = '1', limit = '20' } = req.query;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, parseInt(limit) || 20);
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (type && type !== 'all') filter.type = type;
    if (resolved !== undefined) filter.resolved = resolved === 'true';
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const feedbacks = await feedbacksCollection
      .find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limitNum)
      .toArray();

    const formattedFeedbacks = feedbacks.map(f => ({
      ...f,
      _id: f._id.toString(),
      id: f._id.toString()
    }));

    const total = await feedbacksCollection.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: formattedFeedbacks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des feedbacks' });
  }
}

// GET /api/feedbacks/:id - Récupérer un feedback (AUTHENTIFIÉ)
async function getFeedbackById(req, res) {
  try {
    if (!verifyAuth(req)) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID invalide' });
    }

    const database = await connectToDatabase();
    const feedbacksCollection = database.collection('feedbacks');

    try {
      const feedback = await feedbacksCollection.findOne({ _id: new ObjectId(id) });

      if (!feedback) {
        return res.status(404).json({ error: 'Feedback non trouvé' });
      }

      res.status(200).json({
        success: true,
        data: {
          ...feedback,
          _id: feedback._id.toString(),
          id: feedback._id.toString()
        }
      });
    } catch (e) {
      return res.status(400).json({ error: 'ID invalide' });
    }
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du feedback' });
  }
}

// PATCH /api/feedbacks/:id - Mettre à jour un feedback (AUTHENTIFIÉ)
async function updateFeedback(req, res) {
  try {
    if (!verifyAuth(req)) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const { id } = req.query;
    const { resolved } = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID invalide' });
    }

    const database = await connectToDatabase();
    const feedbacksCollection = database.collection('feedbacks');

    try {
      const result = await feedbacksCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $set: {
            resolved: resolved === true,
            updatedAt: new Date(),
          },
        },
        { returnDocument: 'after' }
      );

      if (!result.value) {
        return res.status(404).json({ error: 'Feedback non trouvé' });
      }

      res.status(200).json({
        success: true,
        data: {
          ...result.value,
          _id: result.value._id.toString(),
          id: result.value._id.toString()
        }
      });
    } catch (e) {
      return res.status(400).json({ error: 'ID invalide' });
    }
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du feedback' });
  }
}

// DELETE /api/feedbacks/:id - Supprimer un feedback (AUTHENTIFIÉ)
async function deleteFeedback(req, res) {
  try {
    if (!verifyAuth(req)) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID invalide' });
    }

    const database = await connectToDatabase();
    const feedbacksCollection = database.collection('feedbacks');

    try {
      const result = await feedbacksCollection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Feedback non trouvé' });
      }

      res.status(200).json({ success: true, message: 'Feedback supprimé avec succès' });
    } catch (e) {
      return res.status(400).json({ error: 'ID invalide' });
    }
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du feedback' });
  }
}

// GET /api/feedbacks/stats - Statistiques (AUTHENTIFIÉ)
async function getStats(req, res) {
  try {
    if (!verifyAuth(req)) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const database = await connectToDatabase();
    const feedbacksCollection = database.collection('feedbacks');

    const [total, bugs, suggestions, compliments, resolved, avgRatingResult] = await Promise.all([
      feedbacksCollection.countDocuments(),
      feedbacksCollection.countDocuments({ type: 'bug' }),
      feedbacksCollection.countDocuments({ type: 'suggestion' }),
      feedbacksCollection.countDocuments({ type: 'compliment' }),
      feedbacksCollection.countDocuments({ resolved: true }),
      feedbacksCollection
        .aggregate([
          { $match: { rating: { $exists: true, $ne: null } } },
          { $group: { _id: null, avg: { $avg: '$rating' } } },
        ])
        .toArray(),
    ]);

    const averageRating = avgRatingResult.length > 0 ? parseFloat(avgRatingResult[0].avg.toFixed(2)) : 0;

    res.status(200).json({
      success: true,
      data: {
        total,
        bugs,
        suggestions,
        compliments,
        resolved,
        averageRating,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
}

// Router principal
export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const pathname = url.pathname;

    // GET /api/feedbacks/stats
    if (req.method === 'GET' && pathname === '/api/feedbacks/stats') {
      return await getStats(req, res);
    }

    // GET /api/feedbacks/:id
    if (req.method === 'GET' && pathname.match(/^\/api\/feedbacks\/[^/]+$/)) {
      const id = pathname.split('/').pop();
      req.query = { ...req.query, id };
      return await getFeedbackById(req, res);
    }

    // PATCH /api/feedbacks/:id
    if (req.method === 'PATCH' && pathname.match(/^\/api\/feedbacks\/[^/]+$/)) {
      const id = pathname.split('/').pop();
      req.query = { ...req.query, id };
      return await updateFeedback(req, res);
    }

    // DELETE /api/feedbacks/:id
    if (req.method === 'DELETE' && pathname.match(/^\/api\/feedbacks\/[^/]+$/)) {
      const id = pathname.split('/').pop();
      req.query = { ...req.query, id };
      return await deleteFeedback(req, res);
    }

    // GET /api/feedbacks
    if (req.method === 'GET' && pathname === '/api/feedbacks') {
      return await getFeedbacks(req, res);
    }

    // POST /api/feedbacks
    if (req.method === 'POST' && pathname === '/api/feedbacks') {
      return await createFeedback(req, res);
    }

    res.status(404).json({ error: 'Route non trouvée' });
  } catch (error) {
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};