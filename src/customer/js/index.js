((window,document,$,Model)=>{
    $(()=>{
      const image =  $('div.container div.image'),
            spans = Array.from($('div.container span'),v=>$(v));
      const srcs = ['/customer/image/6.jpg',
                  '/customer/image/5.jpg',
                  '/customer/image/3.jpg'
                ];
     function removeClass(eles , className){
          for (let e of eles){
              e.removeClass(className);
          }
     }
     let i = 1;
      setInterval(()=>{
         image.css({background:`url('${srcs[i]}')`,backgroundSize:'100% 100%',backgroudPosition:'center center'});
         removeClass(spans,'main');
         spans[i].addClass('main');
         i++;
         if(i===3) i=0;
      },1500);
    
    })
  })(window,document,jQuery,Model);