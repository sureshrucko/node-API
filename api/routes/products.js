const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Product = require('./models/product')




//for get method

router.get('/', (req, res, next) => {
    Product.find().exec().then(
        docs => {
            console.log(docs)
            res.status(200).json(docs);
        }
    ).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
});


router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
        .exec()
        .then(doc => {

            console.log("from Database", doc);
            if (doc) {
                res.status(200).json(doc)
            } else {
                res.status(404).json({
                    message: "No valid entry found id"
                })
            }

        })
        .catch(error => {
            console.log(error);
            res.status(500).json(error)
        });
})



//for post method


router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    })
    product.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'handling post method to products',
                createdProduct: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

});





//for petch method
router.patch('/:id', (req, res, next) => {
    const id = req.params.id;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(docs => {
            res.status(200).json(docs)
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});




router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    Product.remove({
        _id: id
    })
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
})

module.exports = router;