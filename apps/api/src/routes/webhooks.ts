import { Router } from 'express';
import { handleWhatsAppWebhook, verifyWebhookToken } from '../services/whatsapp.service';

const router = Router();

// Webhook Verification (GET)
router.get('/whatsapp', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && verifyWebhookToken(token as string)) {
        res.status(200).send(challenge);
    } else {
        res.status(403).send('Forbidden');
    }
});

// Webhook Message Handling (POST)
router.post('/whatsapp', async (req, res) => {
    try {
        const success = await handleWhatsAppWebhook(req.body);
        if (success) {
            res.status(200).json({ success: true });
        } else {
            res.status(400).json({ success: false, error: 'Processing failed' });
        }
    } catch (error: any) {
        res.status(500).json({ error: 'Internal error' });
    }
});

export default router;