import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("❌ Erreur : EMAIL_USER et EMAIL_PASS sont requis !");
  process.exit(1);
}

// Transporteur Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message)
    return res.status(400).json({ message: "Champs manquants" });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `📩 Nouveau message de ${name}`,
    text: `
Nom : ${name}
Email : ${email}

Message :
${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email envoyé depuis :", email);
    res.status(200).json({ message: "Message envoyé avec succès !" });
  } catch (error) {
    console.error("❌ Erreur:", error);
    res.status(500).json({ message: "Erreur d’envoi du message" });
  }
});

app.get("/", (req, res) => {
  res.send("🚀 Serveur de contact pour portfolio Angular est en ligne !");
});

app.listen(PORT, () => console.log(`✅ Serveur actif sur le port ${PORT}`));
