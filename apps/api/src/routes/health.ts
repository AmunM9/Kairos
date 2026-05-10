import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'kairos-api', uptime: process.uptime() });
});

export default router;
