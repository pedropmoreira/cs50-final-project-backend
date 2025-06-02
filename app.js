import express from 'express';
import categoryRouter from './routes/categoryRouter.js'
import transactionRouter from './routes/transactionRouter.js'
import userRouter from './routes/userRouter.js'

const app = express();
const PORT = 3000;

app.use(express.json());


//routes
app.use('/category',categoryRouter)
app.use('/transaction',transactionRouter)
app.use('/user',userRouter)


app.listen(PORT, () => {
    console.log(`Listening in ${PORT}`);
});