  import express from 'express'
  import { router } from './src/router/auth.router'
  import { json } from 'express'

  const app = express();

  app.use(json())
  app.use("/api/auth", router);

  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });