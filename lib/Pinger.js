const {StorageClient}=require('./StorageData.js');

/** 
 * ping helps to clear unused storages
 * */
class Pinger{
	constructor(socket){
		this.socket=socket;
		this.pingDelay=1000;
		this.pingRid=0;
		this.pingPeers=[];
		this.socket.on('ping=question',msg=>msg.send(msg.data));
		this.socket.on('ping=response',msg=>{
			if(!this.pingRid)return; 
			let pid=this.pingPeers.indexOf(msg.from);
			this.pingPeers.splice(pid,1);
			if(!this.pingPeers.length){
				clearTimeout(this.pingRid);
				this.pingRid=0;
			}
		});
		requestAnimationFrame(()=>this.ping());
	}
	/** ping helps to clear unused storages */
	ping(){
		if(!this.pingRid){
			this.pingPeers=this.socket.peers;
			this.socket.sendAll('ping=question',{time:Date.now()});
			this.pingRid=setTimeout(() => {
				this.pingPeers.forEach(id=>(new StorageClient(this.socket.id2key(id))).destroy());
				this.pingPeers=[];
				this.pingRid=0;
			}, this.pingDelay);
		}
		
	}
}
module.exports={
	Pinger
};