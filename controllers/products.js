const Product = require('../modals/product')
const fs = require('fs')
const path = require('path')
exports.index = {
    json: function (req, res) {
        Product.find({}, function (error, products) {
            if (error)
                return res.send(error)
            res.json(products)
        })
    },
    html: function (req, res) {
        const searchTerm = req.query.searchTerm
        const page = req.query.page || 0
        Product.find(searchTerm ? { name: new RegExp(searchTerm, 'i') } : this.null, null, { skip: page * 15, limit: 10 }).then(function (products) {
            return _.render(req, res, 'products',
                {
                    title: 'Product',
                    products: products,
                    plugins: [['bootstrap-select'], ['chosen']]
                }, true
            )
        })
    }
}
exports.create = function (req, res) {
    const images = []
    for (let i = 0; i < req.files.length; i++) {
        const destination = req.files[i].destination
        const imageName = req.files[i].path.split('\\').pop()
        const fileExtension = req.files[i].originalname.split('.').pop()
        images.push(imageName + '.' + fileExtension)
        fs.renameSync(req.files[i].path, path.join(destination, '../assets/uploads/productImages/') + imageName + '.' + fileExtension)
    }
    if (images.length > 5) {
        return res.send('Maximum images upload is 5')
    }
    const product = new Product(req.body)
    product.images = images
    product.creator = req.session.user._id
    product.save().then(result => {
        res.redirect('/products/' + product.id)
    })
}
exports.show = function (req, res) {
    Product.findById(req.params.product).then(result => {
        _.render(req, res, 'products-detail', {
            product: result,
            plugins: [['bootstrap-select']]
        }, true)
    })
}

exports.update = function (req, res) {
    const id = req.params.id
    const updateProduct = req.body
    Product.update(id, updateProduct, function (error, updatedProduct) {
        if (error)
            return res.json(error)
        res.json(updateProduct)
    })

}
exports.destroy = function (req, res) {
    Product.findByIdAndRemove(req.body.id, function (error, product) {
        if (error)
            return res.json(error)
        res.json(product)
    })
}
exports.edit = function (req, res) {
    Product.findById(req.params.product).then(result => {
        _.render(req, res, 'products-edit', {
            product: result,
            plugins: [['bootstrap-select']]
        }, true)
    })
}
exports.new = function (req, res) {
    _.render(req, res, 'products-new', {
        title: 'Product',
        plugins: [['bootstrap-select']]
    }, true
    )
}
