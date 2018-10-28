((window,document,$,Model)=>{
  $(()=>{
     /**get elemet */
        const phoneInput = $('section#eroll input[name=phone]'),
              passwordInput = $('section#eroll input[name=password]'),
              repasswordInput = $('section#eroll input[name=repassword]'),
              messageBox = $('section#eroll .message-box'),
              erollBtn = $('section#eroll form button'),
              form = $('section#eroll form');

      
        const Event = {
              formSubmit:function(e){
                  messageBox.text('');
                 
                  if(!/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(phoneInput.val())){
                    messageBox.text('电话号格式错误!');
                    return false;
                  }else if(!/^[a-zA-Z0-9]{8,16}$/.test(passwordInput.val())){
                    messageBox.text('错误,密码只能是数字,字母且大于8位,小于16位!');
                    return false; 
                  }else if(passwordInput.val()!==repasswordInput.val()){
                    messageBox.text('错误,两次密码不一致!');
                    return false;
                  } 
              }
        };
     form.get(0).onsubmit = Event.formSubmit;

  })
})(window,document,jQuery,Model);