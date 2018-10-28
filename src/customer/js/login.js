((window,document,$,Model)=>{
    $(()=>{
       /**get elemet */
          const accountInput = $('section#login input[name=account]'),
                passwordInput = $('section#login input[name=password]'),
                messageBox = $('section#login .message-box'),
                form = $('section#login form');
  
        
          const Event = {
                formSubmit:function(e){
                    messageBox.text('');
                    if(!accountInput.val()){
                        messageBox.text('未输入账号');
                        return false;
                    } 
                    if(!passwordInput.val()){
                        messageBox.text('未输入密码');
                        return false;
                    }
                }
          };
       form.get(0).onsubmit = Event.formSubmit;
  
    })
  })(window,document,jQuery,Model);