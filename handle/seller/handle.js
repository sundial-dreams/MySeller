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
    const getIndex = async (req, res) => {
        try {
            if (req.cookies.seller_act) {
                let data = await db.exec('select * from seller where account=?', [req.cookies.seller_act]);

                res.render('index', {
                    data: data[0]
                });
            } else {
                res.redirect('/seller/');
            }

        } catch (e) {
            console.log(e);
        }

    };
    const getLogin = async (req, res) => {
        try {

            if (req.cookies.seller_act) {
                res.redirect('/seller/index/');
            } else {
                res.render('login');
            }
        } catch (e) {
            console.log(e);
        }
    };
    const ajaxLogin = async (req, res) => {
        try {
            let {
                user,
                password
            } = req.body;
            let result = await db.exec('select * from seller where account = ?', [user]);
            if (result.length) {
                if (result[0].password === password) {
                    res.cookie('seller_act', user, [{
                        maxAge: 1000 * 3600
                    }]);


                    res.json({
                        isOk: true
                    });
                } else {
                    res.json({
                        isOk: false,
                        errType: 1,
                        msg: '密码错误!'
                    })
                }
            } else {
                res.json({
                    isOk: false,
                    errType: 0,
                    msg: '用户不存在!'
                })
            }
        } catch (e) {
            console.log(e);
        }
    };
    const ajaxEroll = async (req, res) => {
        try {
            let {
                user,
                password,
                shop_name,
                charge,
                address
            } = req.body;
            let len = await db.exec('select * from seller');
            len = len.length;
            console.log(user);
            let result = await db.exec('select * from seller where account = ?', [user]);
            console.log(result);
            if (result.length) {

                res.json({
                    isOk: false,
                    errType: 0,
                    msg: '该手机号已注册!'
                })

            } else {
                await db.exec('insert into seller(id,account,password,phone,charge,shop_name,shop_image,description,address) values(?,?,?,?,?,?,?,?,?)', [len + 1, user, password, user, charge, shop_name, '1.jpg', '一家商店', address]);
                let Path = path.dirname(path.dirname(__dirname)),
                    basepath = `${Path}/src/image/seller`;
                    // fs.mkdir(`${basepath}/${len+1}`,err=>{
                    //     fs.mkdir(`${basepath}/${len+1}/goods`,err=>{
                    //         fs.mkdir(`${basepath}/${len+1}/head`,err=>{
                    //             fs.createReadStream(`${Path}/src/image/1.jpg`)
                    //             .pipe(fs.createWriteStream(`${basepath}/${len+1}/head/1.jpg`));
                    //         })
                    //     })
                    // })
                await afs.mkdir(`${basepath}/${len+1}`);
                await afs.mkdir(`${basepath}/${len+1}/goods`);
                await afs.mkdir(`${basepath}/${len+1}/head`);
                fs.createReadStream(`${Path}/src/image/1.jpg`)
                    .pipe(fs.createWriteStream(`${basepath}/${len+1}/head/1.jpg`));
                res.json({
                    isOk: true
                });
            }
        } catch (e) {
            console.log(e);
        }
    };
    const getGoods = async (req, res) => {
        try {
            if (req.cookies.seller_act) {
                let elect = req.params.elect;

                let seller_id = req.cookies.seller_act;

                let seller_data = await db.exec('select * from seller where account=?', [req.cookies.seller_act]);
                if (elect === 'all') {
                    let goods_classify = await db.exec('select * from goods_classify where seller_id=?',[seller_data[0].id]);
                    console.log(goods_classify);
                    let goods_data = await db.exec('select * from shopView where seller_id = ?', [seller_data[0].id]);
                    let map = new Map();
                    for (let v of goods_classify) {
                        map.set(v.classify, []);
                    }
                    for (let v of goods_data) {
                        let {
                            id,
                            name,
                            price,
                            image,
                            number
                        } = v;
                        map.get(v.classify).push({
                            name,
                            price,
                            number,
                            image,
                            id
                        })
                    }
                    res.render('goods', {
                        seller_data: seller_data[0],
                        map,
                        elect
                    });
                } else if (elect === 'addGoods') {
                    res.render('goods', {
                        seller_data: seller_data[0],
                        elect
                    });
                } else if (elect === 'addClassify') {
                    res.render('goods', {
                        seller_data: seller_data[0],
                        elect,
                        error: ''
                    });
                }
            } else {
                res.redirect('/seller/');
            }
        } catch (e) {
            console.log(e);

        }
    };
    const postGoodsClassify = async (req, res) => {
        try {
            let account = req.cookies.seller_act;
            if (account) {

                let seller = await db.exec('select id from seller where account = ?', [account]);

                let {
                    classify_name,
                    classify_des
                } = req.body;
                let t = await db.exec('select * from goods_classify where seller_id = ? and classify = ?', [seller[0].id, classify_name]);

                if (t.length === 0) {
                    let len = await db.exec('select * from goods_classify where seller_id = ?', [seller[0].id]);
                    len = len.length + 1;
                    await db.exec('insert into goods_classify(id,seller_id,classify,classify_des) values(?,?,?,?)', [len, seller[0].id, classify_name, classify_des]);
                    res.redirect('/seller/goods/all');
                } else {
                    res.render('goods', {
                        error: '该分类已存在!'
                    });
                }

            } else {
                res.redirect('/seller/')
            }
        } catch (e) {
            console.log(e)
        }
    };
    const postGoods = async (req, res) => {
        try {
            let account = req.cookies.seller_act;
            if (account) {

                let seller = await db.exec('select id from seller where account = ?', [account]);

                let {
                    goods_name,
                    goods_classify,
                    goods_info,
                    goods_number,
                    goods_price
                } = req.body;
                
                let projectPath = path.dirname(path.dirname(__dirname));
                let len = await db.exec('select * from goods where seller_id = ?', [seller[0].id]);
                len = len.length + 1;
                let filename = `${projectPath}/src/image/seller/${seller[0].id}/goods/${len}.jpg`;
                console.log('file=',req.file);
                
                await afs.rename(req.file.path, filename);
                
                await db.exec('insert into goods(id,seller_id,name,description,number,price,image,classify_id) values(?,?,?,?,?,?,?,?)',
                 [len,seller[0].id,goods_name,goods_info,goods_number,goods_price,`${len}.jpg`,goods_classify]);
                res.redirect('/seller/goods/all');
            } else {
                res.redirect('/seller/')
            }
        } catch (e) {
            console.log(e)
        }
    };


    const getSetting = async (req, res) => {
        try {
            if (req.cookies.seller_act) {
                let seller_data = await db.exec('select * from seller where account = ?', [req.cookies.seller_act]);
                res.render('setting', {
                    seller_data: seller_data[0]
                });
            } else {
                res.redirect('/seller/')
            }
        } catch (e) {
            console.log(e)
        }
    };


    const getExit = async (req, res) => {
        try {
            if (req.cookies.seller_act) {
                res.clearCookie('seller_act', [{
                    maxAge: 1000 * 3600
                }]);
                res.redirect('/seller/');
            } else {
                res.redirect('/seller/');
            }
        } catch (e) {
            console.log(e)
        }
    };

    return {
        getIndex,
        getLogin,
        ajaxEroll,
        ajaxLogin,
        getGoods,
        getSetting,
        getExit,
        postGoods,
        postGoodsClassify,
    }
})()