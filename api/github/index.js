export default async function handler(req, res) {
  const { owner, repo, path } = req.query;

  if (!owner || !repo) {
    return res.status(400).json({ error: 'owner and repo are required' });
  }

  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json'
  };

  try {
    // 📁 Récupérer l'arborescence
    if (!path) {
      const treeRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`,
        { headers }
      );

      const tree = await treeRes.json();
      return res.status(treeRes.status).json(tree);
    }

    // 📄 Récupérer un fichier
    const fileRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      { headers }
    );

    const file = await fileRes.json();
    return res.status(fileRes.status).json(file);

  } catch (err) {
    return res.status(500).json({ error: 'GitHub proxy failed', details: err });
  }
}
