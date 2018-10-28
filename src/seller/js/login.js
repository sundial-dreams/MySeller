((window,document,$,Model)=>{
    $(()=>{
       /**get elemet */
          const host = 'localhost';
          const loginUser = $('section#login .login-block input[name=user]'),
                loginPassword = $('section#login .login-block input[name=password]'),
                loginMessageBox = $('section#login .login-block .login-messegeBox'),
                erollUser = $('section#login .eroll-block input[name=user]'),
                erollPassword = $('section#login .eroll-block input[name=password]'),
                erollShopName = $('section#login .eroll-block input[name=shop_name]'),
                erollCharge = $('section#login .eroll-block input[name=charge]'),
                erolladdress = $('section#login .eroll-block input[name=address]'),
                erollMessageBox = $('section#login .eroll-block .eroll-messegeBox'),
                loginBlock = $('section#login .login-block'),
                erollBlock = $('section#login .eroll-block'),
                loginBtn = $('section#login  .login-block .bottom > button'),
                goErollBtn = $('section#login  .login-block .top button'),
                erollBtn = $('section#login .eroll-block .bottom button'),
                goLoginBtn = $('section#login .eroll-block .top button');
                
          const {configEvent,ajaxPromise} = Model;        
          function initAnimation(){
                loginBlock.addClass('show');
            }
          initAnimation();
          const Event = {
                login(){
                    loginMessageBox.text('');
                    if(!loginUser.val()){
                        loginMessageBox.text('未输入账号！'); 
                        return;
                    }
                    if(!loginPassword.val()){
                        loginMessageBox.text('未输入密码!'); 
                        return;
                    }
                    ajaxPromise({
                        url:`http://${host}/seller/login`,
                        type:'POST',
                        dataType:'json',
                        data:{
                            user:loginUser.val(),
                            password:loginPassword.val()
                        }
                    }).then(data=>{
                         
                        if(!data.isOk){
                             switch (data.errType){
                                 case 0:
                                   loginMessageBox.text(data.msg);
                                   loginUser.val('');
                                   loginPassword.val('');
                                   break;
                                 case 1:
                                   loginMessageBox.text(data.msg);
                                   loginPassword.val('');
                                   break;
                             }
                        }else{
                            window.location.href = `http://${host}/seller/index`;
                        }
                    })
                },
                eroll(){
                    erollMessageBox.text('');
                    if(!erollUser.val()){
                        erollMessageBox.text('未输入账号！'); 
                        return;
                    }
                    if(!erollPassword.val()){
                        erollMessageBox.text('未输入密码!'); 
                        return;
                    }
                    if(!erollShopName.val()){
                        erollMessageBox.text('未输入店铺名!'); 
                        return;
                    }
                    if(!erollCharge.val()){
                        erollMessageBox.text('未输入负责人姓名!'); 
                        return;
                    }
                    if(!erolladdress.val()){
                        erollMessageBox.text('未输入地址!'); 
                        return;
                    }
                    if(!/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(erollUser.val())){
                        erollMessageBox.text('电话号格式错误!');
                        return false;
                      }else if(!/^[a-zA-Z0-9]{8,16}$/.test(erollPassword.val())){
                        erollMessageBox.text('错误,密码只能是数字,字母且大于8位,小于16位!');
                        return false; 
                      }
                     
                    ajaxPromise({
                        url:`http://${host}/seller/eroll`,
                        type:'POST',
                        dataType:'json',
                        data:{
                            user:erollUser.val(),
                            password:erollPassword.val(),
                            shop_name:erollShopName.val(),
                            charge:erollCharge.val(),
                            address:erolladdress.val()
                        }
                    }).then(data=>{
                        if(!data.isOk){
                             switch (data.errType){
                                 case 0:
                                   erollMessageBox.text(data.msg);
                                   
                                   break;
                             }
                        }else{
                            window.location.href = `http://${host}/seller/`;
                        }
                    })
                },
                goEroll(){
                    
                    loginBlock.removeClass('show').then(500,()=>{
                        erollBlock.addClass('show');
                    })
                },
                goLogin(){
                    erollBlock.removeClass('show').then(500,()=>{
                        loginBlock.addClass('show');
                    })
                }
            };
             
            configEvent('click',
                   [goErollBtn,Event.goEroll],
                   [goLoginBtn,Event.goLogin],
                   [loginBtn,Event.login],
                   [erollBtn,Event.eroll]
                )
            
    })
  })(window,document,jQuery,Model);