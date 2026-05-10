import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    credits: 'unknown',
    message: 'Usage endpoint not fully implemented in mock tier',
  });
});

export default router;
