import { app } from './server';
import { env } from './config/env';

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
