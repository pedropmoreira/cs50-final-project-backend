import express from 'express';
import categoryRouter from './routes/categoryRouter.js'
import transactionRouter from './routes/transactionRouter.js'


const app = express();
const PORT = 3000;

app.use(express.json());


//routes
app.use('/category',categoryRouter)
app.use('/transaction',transactionRouter)


app.listen(PORT, () => {
    console.log(`Listening in ${PORT}`);
});