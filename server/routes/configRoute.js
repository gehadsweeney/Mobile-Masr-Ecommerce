import express from "express";
const router = express.Router();

// Returns OpenAI key from server environment (do NOT expose in public deployments without auth)
router.get('/openai-key', (req, res) => {
    // env name in .env is `OPENAI_API_KEY` in this project
    const key = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || '';
    if (!key) return res.status(404).json({ error: 'OpenAI key not configured' });
    res.json({ key });
});

// Returns Cloudinary configuration used by the frontend
router.get('/cloudinary', (req, res) => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || '';
    // Return whatever is available; frontend can handle missing uploadPreset
    if (!cloudName) {
        return res.status(404).json({ error: 'Cloudinary cloud name not configured' });
    }
    res.json({ cloudName, uploadPreset });
});

export default router;
