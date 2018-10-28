const mysql = require('mysql');
const connection = mysql.createPool({
  host:'cdb-3xgx1lpe.cd.tencentcdb.com',
  user:'root',
  password:'2031163243abcd',
  port:10005,
  database:'pos_system1',
  connectionLimit:1000
});

const db = function(){
    const  asyncMysql = (sql,args=[])=>new Promise((resolve,reject)=>{
        connection.query(sql,args,(err,result)=>{
            if (err) reject(err);
            resolve(result);
        });
    });
    return {exec:asyncMysql}
}();
module.exports = db;