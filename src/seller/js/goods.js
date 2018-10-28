((window,document,$,Model)=>{
    $(()=>{
        //get element
        const addGoods = $('section.right .addGoods');
        const addClassify = $('section.right .addClassify');
        const allGoods = $('section.right .goods-list');

        if(addGoods.get(0)){
            let goods_iamge = addGoods.find('input[type=file]');
            let goods_name = addGoods.find('input[name=goods_name]');
            let goods_classify = addGoods.find('input[name=goods_classify]');
            let goods_info = addGoods.find('textarea[name=goods_info]');
            let goods_number = addGoods.find('input[name = goods_number]');
            let goods_price = addGoods.find('input[name=goods_price]');
            let messageBox = addGoods.find('h2.error');
            let form = addGoods.find('form');
            form.submit(function(){
                messageBox.text('');
                if(goods_iamge.val() === ''){
                    messageBox.text('未上传图片');
                    return false;
                }
                if(goods_name.val() === ''){
                    messageBox.text('未输入商品名');
                    return false;
                }
                if(goods_classify.val() === ''){
                    messageBox.text('未选择商品类别');
                    return false;
                }
                if(goods_info.val() === ''){
                    messageBox.text('未输入商品描述');
                    return false;
                }
                if(goods_number.val() === ''){
                    messageBox.text('未输入商品数量');
                    return false;
                }
                if(goods_price.val() === ''){
                    messageBox.text('未输入商品价格');
                    return false;
                }

                if(!/[0-9]{1,5}/.test(goods_number.val())){
                    messageBox.text('商品数量输入有误');
                    return false;
                }
                if(!/[0-9]+|[0-9]+.[0-9]{1,2}/.test(goods_price.val())){
                    messageBox.text('商品价格输入有误');
                    return false;
                }

            })
        }
        if(addClassify.get(0)){
            let classify_name = addClassify.find('input[name=classify_name]');
            let classify_info = addClassify.find('textarea');
            let form = addClassify.find('form');
            let messageBox = addClassify.find('h2.error');
            form.submit(function(){
                messageBox.text('');
                if(classify_info.val() === ''){
                  messageBox.text('未输入分类信息');
                    return false;
                }
                if(classify_name.val() === ''){
                    messageBox.text('未输入分类名');
                    return false; 
                }
            });
        }
        if(allGoods.get(0)){
          
            
            
        }
    })
})(window,document,jQuery,Model);