  import express from 'express'
  import { authrouter } from './src/router/auth.router'
  import { rolerouter } from './src/router/roles.router'
  import { json } from 'express'

  const app = express();

  app.use(json())
  app.use("/api/auth", authrouter);
  app.use("/api/roles", rolerouter)

  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });