const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const BlockChain = require('./BlockChain.js');
const Utils = require('./helpers/utility.js');

let blockChain = new BlockChain.Blockchain();

class BlockController{

    constructor(app){
        this.app = app;
        this.blocks = [];
        this.getBlockByHeight();
        this.postNewBlock();
    }

    getBlockByHeight(){
        this.app.get("/block/:height", (req, res) => {
            const height = req.params.height;
            blockChain.getBlock(height).then((block) => {
                if(block === undefined){
                    res.send({error:`Block was not found for height #${height}`});
                }else{
                    res.send(JSON.stringify(block));
                }
            }).catch((err) => {
                res.send({error:`Block of height #${height} was not found`});
            });
        });
    }

    postNewBlock(){
        this.app.post("/block", (req, res) => {
            const body = req.body;
            if (Utils.isEmpty(body)){
                res.send("Unacceptable content...\n");
            }else{
                let newBlock = new BlockClass.Block(body.data);
                blockChain.addBlock(newBlock).then((result) => {
                    res.send(result);
                }).catch((err) => {
                    res.send({error: err});
                });
            }
        });
    }
}


module.exports = (app) => {return new BlockController(app);}
