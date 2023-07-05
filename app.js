require('dotenv').config();
require('express-async-errors');

//extra security package
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')

//swagger
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')


const express = require('express');
const app = express();


// connectDB
const connectDB=require('./db/connect')
const autheticateUser = require('./middleware/authentication')

app.get('/', (req,res) => {
  res.send('<h1>jobs API</h1><a href="/api-docs">documentation</a>')
})

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

//routes
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());

// extra packages
app.set('trust proxy', 1);
app.use(rateLimit({
  windowMs: 15*60*1000, //15
  max: 100, //limit each ip to requed per windowMS
})
);
app.use(helmet())
app.use(cors())
app.use(xss())


// routes
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/jobs', autheticateUser, jobsRouter)

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
