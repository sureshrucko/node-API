const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('./models/order')
const Product = require('./models/product')






router.get('/', (req, res, next) => {
    Order.find()
        .select('prodct quantity _id')
        .exec()
        .then(ord => {
            console.log(ord);
            res.status(200).json({
                count: ord.length,
                orders: ord.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            types: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});

router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            order.save()
                .then(ord => {
                    console.log(ord);
                    res.status(201).json({
                        message: "order stored",
                        createdOrder: {
                            _id: ord._id,
                            quantity: ord.quantity,
                            product: ord.product
                        },
                        request: {
                            types: 'POST',
                            url: 'http://localhost:3000/orders/' + ord._id
                        }
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                })
        })
        .catch(err => {
            res.status(500).json({
                message: 'Product not found',
                error: err
            });
        })
});


router.get('/:id', (req, res, next) => {
    res.status(201).json({
        message: 'order details',
        id: req.params.id
    });
});

router.delete('/:id', (req, res, next) => {
    res.status(201).json({
        message: 'order deleted',
        id: req.params.id
    });
});


module.exports = router;