

const {StorageData,StorageClient}=require('./StorageData.js');
const {MessageData,StorageMessage}=require('./MessageData.js');
const {Listener}=require('./Listener.js');
const {PromiseIndex}=require('./PromiseIndex.js');
const {Pinger}=require('./Pinger.js');


// ----------- 

class StorageSocket_priv{
	constructor(group){
		
		this.clientSuffix='-storsok-client-';
		this.group=group;
		this.listener=new Listener();
		this.id=this.freeId;
		this.client=new StorageClient(this.id2key(this.id));
		this.client.save();
		this.promIndex=new PromiseIndex();
		this.responseTypes={};
		this.ready=false;
		this.cmd=0;
		this._init();
	}
	_init(){
		new Pinger(this);

		requestAnimationFrame(()=>{
			this.ready=true;
			this.listener.flush('ready',[{id:this.id}])
		});
		this.registerResponseType('message');

		window.addEventListener('storage', evt=>this._on_evt(evt));
		window.addEventListener("beforeunload",evt=>this.destroy());
	}
	_on_evt(evt){
		if(this.validKey(evt.key)){
			let _id=this.key2id(evt.key);
			if(evt.oldValue===null){
				this.listener.flush('enter',[{id:_id}]);
			}else if(evt.newValue===null){
				if(_id===this.id)this.listener.flush('close',[{id:_id}]);
				else this.listener.flush('leave',[{id:_id}]);
			}else{
				if(_id===this.id){
					// console.log('===========-%con-evt%c-[','color:#f00');
					// console.log(evt);
					this._on_messages(evt);
					// console.log('===========-on-evt-]');
				}
			}

		}
	}
	_on_messages(evt){
		this.client.read();
		let msgs=this.client.data.messages;
		if(msgs.length){
			let ssi=this.client.data.ssi;
			this.client.data.messages=[];
			this.client.save();
			msgs.filter(msg=>msg.ssi===ssi)
			.forEach(msg=>{
				// console.log('-on-msg-',msg);
				let result=new StorageMessage(this,msg);
				
				if(msg.type==='message=question'){
					this.listener.flush('question',[result]);
				}else{
					this.listener.flush(msg.type,[result]);
				}
			});
		}
	}
	get baseKey(){
		return this.group+this.clientSuffix;
	}
	get freeId(){
		let id,cl=this.clients;
		for(id=1;cl.includes(id);id++);
		return id;
	}
	get clients(){//clients ids
		let bk=this.baseKey;
		return Object.keys(localStorage)
		.filter(k=>k.indexOf(bk)===0)
		.map(v=>parseInt(v.substr(bk.length)));
	}
	get peers(){//peers ids (clients excluding current instance)
		return this.clients.filter(id=>id!==this.id);
	}
	id2key(id){
		return this.baseKey+id;
	}
	key2id(key){
		return parseInt(key.substr(this.baseKey.length));
	}
	/** checks if key belongs to same group */
	validKey(key){
		return key.indexOf(this.baseKey)===0;
	}
	send(type,id,data){
		if(id==='all')return this.sendAll(type,data);
		else return this.sendTo(type,id,data);
	}
	sendAll(type,data,metha){
		return this.peers.map(id=>this.sendTo(type,id,data,metha))
	}
	sendTo(type,id,data,metha){
		let msg=MessageData.fromArgs(type,this.id,id,data,metha);
		let key=this.id2key(id);
		// console.log('--- sendTo ',type,id,data,metha,key,localStorage.getItem(key));
		if(localStorage.getItem(key)!==null){
			let cl=new StorageClient(key);
			cl.data.messages.push(msg);
			cl.save();
			// console.log('--- push ');
		}
		
	}
	ask(type,id,data){
		if(id==='all')return this.askAll(type,data);
		else return this.askTo(type,id,data);
	}
	askAll(type,data){
		return this.peers.map(id=>this.askTo(type,id,data));
	}
	registerResponseType(type){
		if(!this.responseTypes[type]){
			this.responseTypes[type]=1;
			// console.log('*add responseTypes "'+type+'=response"');
			this.on(type+'=response',msg=>{
				// console.log('on "'+type+'=response"');
				this.promIndex.resolve(msg.metha.promid,msg.data);
			});
		}
	}
	askTo(type,id,data){
		this.registerResponseType(type);
		let promsplit=this.promIndex.push();
		this.sendTo(type+'=question',id,data,{promid:promsplit.id});
		return promsplit.promise;
	}
	on(type,callback){
		this.listener.add(type,callback);
	}
	
	destroy(){
		this.client.destroy();
	}
}





module.exports={
	StorageSocket_priv,
	StorageSocketMessage: StorageMessage
};