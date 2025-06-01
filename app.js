import express from 'express';
import categoryRouter from './routes/categoryRouter.js'

const app = express();
const PORT = 3000;

app.use(express.json());


//routes
app.use('/category',categoryRouter)

app.listen(PORT, () => {
    console.log(`Listening in ${PORT}`);
});