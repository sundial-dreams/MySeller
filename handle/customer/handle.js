const db = require('../../model/database');
const afs = require('../../model/model');
const fs = require('fs');
const path = require('path');
const Event = (()=>{
    let cache = new Map()
    const on = (event,callback)=>{
        if(!cache.get(event)) cache.set(event,[])
        cache.get(event).push(callback)
    }
    const emit = (event,...args)=>{
        let fns = cache.get(event)
        if(fns instanceof Array){
            fns.forEach(v=>{
                if(v instanceof Function)  v(...args)
            })
        }
        else {
            return false;
        }
    }
    const removeListen = event=>{
        if (cache.has(event)) cache.delete(event)
    }
    return {
        on,emit,removeListen
    }
})();
module.exports = (() => {
    //登陆
    
    const getLogin = async (req, res) => {
        try {
            //console.log(req.cookies.account);
            if (req.cookies.account) {
                res.redirect('/customer/index');
            } else {
                res.render('login', {
                    error: ""
                });
            }
        } catch (e) {
            console.log(e);
        }
    };



    const postLogin = async (req, res) => {
        try {
            let {
                account,
                password
            } = req.body;
            // console.log(account,password);
            let data = await db.exec('select account,password from customer where account = ?', [account]);
            //console.log("db", data[0], data[0]);
            if (data[0]) {

                if (data[0].password === password) {
                    res.cookie('account', account, [{
                        maxAge: 1000 * 3600
                    }]);
                    res.redirect('/customer/index');
                } else {
                    res.render('login', {
                        error: "密码错误"
                    });
                }
            } else {
                res.render('login', {
                    error: "账号不存在"
                });
            }
        } catch (e) {
            console.log(e);
        }
    };



    const getEroll = async (req, res) => {
        if (req.cookies.account) {
            res.redirect('/customer/index');
        } else {
            res.render('eroll', {
                error: ""
            });
        }
    }



    const postEroll = async (req, res) => {
        try {
            let {
                phone,
                password
            } = req.body;
            let result = await db.exec('select account,phone from customer where phone = ?', [phone]);
            if (result[0]) {
                res.render('eroll', {
                    error: "该手机号已注册"
                });
            } else {
                let sql = 'insert into customer(account,password,nickname,phone,headimage,address,realname,age,sex) values(?,?,?,?,?,?,?,?,?)',
                    data = [phone, password, 'onePerson', phone, '1.jpg', '', '', 18, '男'];
                
      
                let filePath = path.dirname(path.dirname(__dirname));
               
                let baseppath = `${filePath}/src/image/customer/${phone}`;
                await db.exec(sql, data);
                await afs.mkdir(baseppath);
                await afs.mkdir(`${baseppath}/head`);
                fs.createReadStream(`${filePath}/src/image/1.jpg`)
                  .pipe(fs.createWriteStream(`${baseppath}/head/1.jpg`));
                res.redirect('/customer/');
            }
        } catch (e) {
            console.log(e);
        }
    };



    const getIndex = async (req, res) => {
        try {
            let data = req.cookies.account;
            if (!data) {
                res.redirect('/customer/');
            } else {
                let sellerResult = await db.exec('select id,shop_name,description,address,shop_image from seller');
              
                res.render('index', {
                    datas: {
                        data: data,
                        result: sellerResult
                    }
                });
            }
        } catch (e) {
            console.log(e);
        }
    };



    const getOrder = async (req, res) => {
        try {
            let data = req.cookies.account;
            if (!data) {
                res.redirect('/customer/');
            } else {
                let result = await db.exec('select * from shopCartView where customer_act =?', [data]);
                //console.log(result);
                let car_array = new Map();
                let len = result.length;
                for (let v of result) {
                    car_array.set(v.seller_id, []);
                }
                for (let v of result) {
                    car_array.get(v.seller_id).push({
                        shop_name: v.shop_name,
                        id: v.id,
                        goods_id: v.goods_id,
                        number: v.number,
                        goods_price: v.total_price,
                        goods_name: v.name,
                        goods_img: v.image
                    });
                }

                res.render('order', {
                    data: car_array,
                    len
                });
            }
        } catch (e) {
            console.log(e);
        }
    };


    const getUser = async (req, res) => {
        try {
            let data = req.cookies.account;
            if (!data) {
                res.redirect('/customer/');
            } else {
                // console.log(data);
                let result = await db.exec('select nickname , headimage,account from customer where account = ?', [data]);
                // console.log(result);
                res.render('user', {
                    userData: result[0]
                });
            }
        } catch (e) {
            console.log(e);
        }
    };


    const getSetting = async (req, res) => {
        try {
            let data = req.cookies.account;
            if (!data) {
                res.redirect('/customer/');
            } else {
                let account = req.params.user;
                // console.log(account);
                let result = await db.exec('select nickname , headimage,account from customer where account = ?', [account]);
                //console.log(result);  
                res.render('setting', {
                    userData: result[0]
                });
            }
        } catch (e) {
            console.log(e);
        }
    };



    const userExit = async (req, res) => {
        try {
            res.clearCookie('account', [{
                maxAge: 1000 * 3600
            }]);
            res.redirect('/customer/');
        } catch (e) {
            console.log(e);
        }
    };



    const getShop = async (req, res) => {
        try {
            let data = req.cookies.account;
            if (!data) {
                res.redirect('/customer/');
            } else {
                 
                let seller_id = req.params.id;
                
                let seller = await db.exec('select * from seller where id = ?', [seller_id]);
                let shopData = {
                    shop_id: seller[0].id,
                    shop_name: seller[0].shop_name,
                    shop_image: seller[0].shop_image,
                    shop_address: seller[0].address,
                    shop_des: seller[0].description,
                    shop_charge: seller[0].charge,
                    shop_phone: seller[0].phone

                };
                let classify = await db.exec('select * from goods_classify where seller_id = ?',[seller_id]);
                let result = await db.exec('select * from shopView where seller_id =?', [seller_id]);
                console.log(classify);
               
                let classifyData = new Map(),
                    classifyList = [];
                for (let v of classify) {
                    classifyData.set(v.classify, []);
                    classifyList.push(v.classify);
                }
                for (let v of result) {
                    classifyData.get(v.classify).push({
                        goods_id: v.id,
                        goods_name: v.name,
                        goods_price: v.price,
                        goods_image: v.image,
                        classify_des: v.classify_des
                    });
                }
               
                res.render('shop', {
                    shopData,
                    classifyList,
                    classifyData:(classifyData.get(classifyList[0])===undefined)?new Map():classifyData.get(classifyList[0])
                });
            }
        } catch (e) {
            console.log(e);
        }
    };



    const ajaxClassifyGoodsData = async (req, res) => {
        try {
            let data = req.cookies.account;
            if (!data) {
                res.redirect('/customer/');
            } else {
                let {
                    id,
                    classify
                } = req.body;
                let result = await db.exec('select * from shopView where seller_id =? and classify = ?', [id, classify]);
                let classifyData = [];
                console.log(result);
                for (let v of result) {
                    classifyData.push({
                        goods_id: v.id,
                        goods_name: v.name,
                        goods_price: v.price,
                        goods_image: v.image,
                        classify_des: v.classify_des
                    });
                }
                //console.log(classifyData);
                res.json({
                    data: classifyData
                });

            }
        } catch (e) {
            console.log(e);
        }
    };


    const ajaxCommentData = async (req, res) => {
        try {
            let data = req.cookies.account;
            if (!data) {
                res.redirect('/customer/');
            } else {
                let {
                    id
                } = req.body;
                let comments = await db.exec('select * from seller_comment where seller_id=?', [id]);
                res.json({
                    data: comments
                });
            }
        } catch (e) {
            console.log(e);
        }
    };



    const getGoods = async (req, res) => {
        try {
            let data = req.cookies.account;
            
            if (!data) {
                res.redirect('/customer/');
            } else {
                let {
                    goods_id,shop_id
                } = req.params;
                
                let result = await db.exec('select * from goods where id = ? and seller_id = ?', [goods_id,shop_id]);
               
                let classify = await db.exec('select * from goods_classify where id=? and seller_id = ?', [result[0].classify_id,shop_id]);
                res.render('goods', {
                    result: result[0],
                    classify: classify[0]
                });
            }
        } catch (e) {
            console.log(e);
        }



    };



    const ajaxGoodsCommentData = async (req, res) => {
        try {
            let data = req.cookies.account;
            if (!data) {
                res.redirect('/customer/');
            } else {
                let {
                    id
                } = req.body;
                let data = await db.exec('select * from goods_comment where goods_id = ?', [id]);
                res.json({
                    data
                });
            }
        } catch (e) {
            console.log(e);
        }
    };
    return {
        getLogin,
        postLogin,
        getEroll,
        postEroll,
        getIndex,
        getOrder,
        getUser,
        getSetting,
        userExit,
        getShop,
        ajaxClassifyGoodsData,
        ajaxCommentData,
        ajaxGoodsCommentData,
        getGoods,
    }
})()
