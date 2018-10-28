const fs = require('fs');
const path = require('path');
function createFs(opts = Object.keys(fs)){
    let object = {};
    for(let v of opts){
        object[v] = (...args)=>new Promise((resolve,reject)=>
                fs[v](...args,(err,data)=>{
                    if(err) reject(err);
                    resolve(data);
                })
            )
    }
    return object;
}
Function.prototype.before = function(beforefn){
    const self = this;
    return function(){
        if(beforefn instanceof Function){
            beforefn.apply(this,arguments);
            return self.apply(this,arguments);
        }
    }
}
Function.prototype.after = function(afterfn){
    const self = this;
    return function(){
        const ret = self.apply(this,arguments);
        afterfn.apply(this,arguments);
        return ret;
    }
}


module.exports = createFs();