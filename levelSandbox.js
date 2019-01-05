/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

let level = require('level');
let chainDB = './chaindata';

class LevelSandbox{
    constructor(){
        this.db = level(chainDB);
    }

    getLevelDBData(key){
        let self = this;
        return new Promise((resolve, reject) => {
            self.db.get(key, (err, value) => {
                if(err){
                    if(err.type == 'NotFoundError'){
                        resolve(undefined);
                    }else{
                        console.log('Block ' + key + ' get failed', err);
                        reject(err);
                    }
                }else{
                    resolve(value);
                }
            });
        });
    }

    addLevelDBData(key, value){
        let self = this;
        return new Promise((resolve, reject) => {
            self.db.put(key, value, (err) => {
                if(err){
                    console.log('Block ' + key + ' submission failed', err);
                    reject(err);
                }
                resolve(value);
            });
        });
    }

    getBlocksCount(){
        let self = this;
        return new Promise(function(resolve, reject){
            let i = 0;
            self.db.createReadStream()
            .on('data', (data) => {
                 i++;
             })
            .on('error', (err) => {
                reject(err)
             })
            .on('close', () => {
                resolve(i);
            });
        })
    }
}

module.exports.LevelSandbox = LevelSandbox;







