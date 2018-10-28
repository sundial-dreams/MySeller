const express = require('express');
const CustomerHandle = require('./handle');
const router = express.Router();


router.get('/index',CustomerHandle.getIndex);
router.get('/',CustomerHandle.getLogin);
router.post('/',CustomerHandle.postLogin);
router.get('/eroll',CustomerHandle.getEroll);
router.post('/eroll',CustomerHandle.postEroll);
router.get('/order',CustomerHandle.getOrder);
router.get('/user',CustomerHandle.getUser);
router.get('/:user/setting',CustomerHandle.getSetting);
router.get('/user/exit',CustomerHandle.userExit);
router.get('/shop/:id',CustomerHandle.getShop);
router.post('/shop/classifyGoodsData',CustomerHandle.ajaxClassifyGoodsData);
router.post('/shop/commentData',CustomerHandle.ajaxCommentData);
router.get('/shop/:shop_id/goods/:goods_id',CustomerHandle.getGoods);
router.post('/goods/commentData',CustomerHandle.ajaxGoodsCommentData);

module.exports = router