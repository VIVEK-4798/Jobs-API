require('dotenv').config();
require('express-async-errors');

// Extra Security Pacakges
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')
const path = require('path'); 

const express = require('express');
const app = express();


app.get("/job.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "task.html"));
});

// connect DB
const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/authentication')


// Routers
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs:15 * 60 * 1000, // 15 minutes
    max:100, // limit each IP to 100 requests per windows
  })
);

// Serve login.html when visiting the root URL
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './public/login.html'));
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs',authenticateUser ,jobsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;


const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
