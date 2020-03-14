const express =require('express');
const app = express();
const morgan=require('morgan');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');


const productRoute=require('./api/routes/products');
const ordersRoute=require('./api/routes/orders')
mongoose.connect('mongodb+srv://leosuresh:'+ process.env.MONGO_ATLAS_PW +'@node-rest-api-3eeyo.mongodb.net/test?retryWrites=true&w=majority',{useUnifiedTopology: true,useNewUrlParser: true})





app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use((req,res,next)=>{
    res.header('Acsess-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Header','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        res.header('ccess-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
})




//routes setup
app.use('/products',productRoute);
app.use('/orders',ordersRoute);





//Error message
app.use((req,res,next)=>{
    const error=new Error('Not Found');
    error.status=404;
    next(error);
})


app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    })
})
module.exports=app