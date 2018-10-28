const express = require('express');
const router = express.Router();
const SellerHandle = require('./handle');
const multer = require('multer');
const path = require('path');
const upload = multer({dest:`${path.dirname(path.dirname(__dirname))}/upload`});



router.get('/index',SellerHandle.getIndex);
router.get('/',SellerHandle.getLogin);
router.post('/login',SellerHandle.ajaxLogin);
router.post('/eroll',SellerHandle.ajaxEroll);
router.get('/goods/:elect',SellerHandle.getGoods);
router.post('/goods/addGoods',upload.single('goods_image'),SellerHandle.postGoods);
router.post('/goods/addClassify',SellerHandle.postGoodsClassify);
router.get('/setting',SellerHandle.getSetting);
router.get('/exit',SellerHandle.getExit);


module.exports = router