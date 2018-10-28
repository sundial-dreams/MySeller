((window,document,$)=>{
    Function.prototype.throttle = function (t = 500) {
        let self = this,
            timer,
            firstTime;
        return function (...args) {
            if (firstTime) {
                self.call(this, ...args);
                return firstTime = false;
            }
            if (timer) {
                return false;
            }
            timer = setTimeout(() => {
                clearTimeout(timer);
                timer = null;
                self.call(this, ...args);
            }, t);
        }
    };
    Function.prototype.curry = function (...args) {
        let self = this;
        return function (callback) {
            return self(...[...args, callback]);
        };
    };
    $.fn.extend({
        then: function (time, callback) {
            Timer(time).then(callback);
            return this;
        },
        writeType:function (data,time=80) {
            let self = this;
            let sum ='',i=0;
            let inter = setInterval(()=>{
                sum+=data[i++];
                self.text(sum);
                if(i===data.length){
                    clearInterval(inter);
                }
            },time);
        }
    });


    const Timer = time => new Promise(resolve => setTimeout(() => resolve(), time));
    const Thunk = fn => (...args) => callback => fn(...[...args, callback]);
    function configEvent(event,...mapArray) {
        console.log(mapArray);
        let map = new Map(mapArray);
        for (let [k, v] of map) {
            k.on(event, v)
            console.log(k,v);
        }
    }
    
    const ajaxPromise = ({
        url="",
        data="",
        dataType="json",
        type="GET",
        async=true
    }={}) => new Promise((resolve,reject)=>{
        object = {url,data,dataType,type,async};
             $.ajax(Object.assign(object,
               {
                success(data){
                   resolve(data);
                },error(){
                    reject(new Error('error'))
                }
               }
            ));
    });
    window.Model = {
    Timer,Thunk,configEvent,ajaxPromise
    }

})(window,document,jQuery);