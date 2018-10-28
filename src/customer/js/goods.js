((window,document,$,Model)=>{
    $(()=>{
        const dns = 'localhost';
        const {ajaxPromise,configEvent} = Model;
        const goods_id =  $.trim($('span#data').text());
        const selects = $('div.select button');
        const footer = $('section.footer');
        const viewPage = $('section.context .view');
        const commentPage = $('section.context .comment-view');
        const infoPage = $('section.context .info-view');
        const commentUl = $('ul.comment-ul');

        let selectBtns =  Array.from(selects,v=>$(v));
        function removeClass(eles,classname){
            eles.forEach(v=>{
                v.removeClass(classname);
            });
        }
        selectBtns[0].on('click',function(){
            removeClass(selectBtns,'main');
            selectBtns[0].addClass('main');
            commentPage.css({transform:'translateX(0)'});
            infoPage.css({transform:'translateX(0)'});
            viewPage.css({transform:'translateX(0)'});
            footer.css({transform:'translateY(0)'});
        });
        selectBtns[1].on('click',function(){
            removeClass(selectBtns,'main');
            selectBtns[1].addClass('main');
            commentPage.css({transform:'translateX(-110%)'});
            infoPage.css({transform:'translateX(0)'});
            viewPage.css({transform:'translateX(-110%)'});
            footer.css({transform:'translateY(150%)'});
            commentUl.html('');
            commentUl.append(`<li class = 'preload'><p>加载中</p><span></span><span></span><span></span></li>`);
            ajaxPromise(
                {
                    url:`http://${dns}/customer/goods/commentData`,
                    dataType:'json',
                    type:'POST',
                    async:true,
                    data:{id:goods_id}
                }
            ).then(data=>{
                console.log(data);
                commentUl.html('');
                for(let v of data.data){
                    let template = ` <li>
                    <div class="top">
                        <h3>${v.customer_act}</h3>
                        <h5>${new Date(v.publish_time).toLocaleDateString()}</h5>
                        <h5 class="level">${v.level}</h5>
                    </div>
                    <div class="bottom">
                        ${v.comment}
                    </div>
                </li>`;
                    commentUl.append(template);
                }
                if(data.data.length === 0){
                    commentUl.append(`<li class='message'><h3>暂无评论</h3></li>`)
                }
            })
        });
        selectBtns[2].on('click',function(){
            removeClass(selectBtns,'main');
            selectBtns[2].addClass('main');
            commentPage.css({transform:'translateX(-220%)'});
            infoPage.css({transform:'translateX(-110%)'});
            viewPage.css({transform:'translateX(-110%)'});
            footer.css({transform:'translateY(150%)'});
        });
       
    })
})(window,document,jQuery,Model)