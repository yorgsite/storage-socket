
class MessageData{
	constructor(data=null){
		this.type=null;
		this.from=null;
		this.to=null;
		this.data=null;
		this.metha=null;
		if(data)MessageData.fromData(data,this);
	}
	static fromArgs(type,from,to,data,metha){
		return MessageData.fromData({type,from,to,data,metha});
	}
	static fromData(data,target=new MessageData()){
		return (function(md){
			md.type=data.type;
			md.from=data.from;
			md.to=data.to;
			md.data=data.data;
			md.metha=typeof(data.metha)!=='undefined'?data.metha:null;
			return md;
		})(target);
	}
}

/**
 * Message data received by a client
 */
class StorageMessage extends MessageData{
	constructor(socket,data){
		super(data);
		let fromType=this.type.split('=');
		this.baseType=fromType[0];
		this.xType=fromType[1]||null;
		Object.defineProperty(this,'_socket',{get:()=>socket,enumerable:false});
	}
	/**
	 * Sends message to the sender
	 * @param {*} data 
	 * @param {*} metha 
	 */
	send(data,metha=null){
		let type=this.type;
		if(this.xType==='question'){
			type=this.baseType+'=response';
			metha=Object.assign(metha||{},this.metha);
		}
		this._socket.sendTo(type,this.from,data,metha||this.metha);
	}
	/**
	 * Ask a question to the sender (not usabe with question messages)
	 * @param {*} type 
	 * @param {*} data 
	 */
	ask(data,type='message'){
		if(this.xType==='question'){
			throw('\nStorageMessage.ask Error:\n'+
			' - This message is a question, you can only use StorageSocketMessage.send.');
		}
		this._socket.ask(type,this.from,data);
	}
}
(function(types){
	Object.defineProperty(StorageMessage,'types',{get:()=>types.slice(0)});
})(['message']);


module.exports={
	MessageData,
	StorageMessage: StorageMessage
};