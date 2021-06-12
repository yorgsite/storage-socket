

// ------------------------
const {StorageSocket_priv}=require('./StorageSocket_priv.js');
const sockets={};

class StorageSocket{
	/**
	* 
	* @param {string} group clients shared group.
	* Use different group names for separated information channels.
	*/
	constructor(group){// only one group instance per page
		this._priv=sockets[group]=sockets[group]||new StorageSocket_priv(group);
	}
	/**
	* {int} current instance id
	*/
	get id(){
		return this._priv.id;
	}

	/**
	* {number[]} all id list
	*/
	get clients(){
		return this._priv.clients;
	}
	/**
	* {number[]} peers id list (clients excluding current instance)
	*/
	get peers(){
		return this._priv.peers;
	}
	/**
	* {boolean} Ready state
	*/
	get ready(){
		return this._priv.ready;
	}

	/**
	* Socket events listening
	* @param {'ready'|'close'|'enter'|'leave'|'message'|'question'} type 
	* ready : Triggered when the socket is ready
	* close : Triggered when the socket closes
	* enter : Triggered when a peer enters.
	* enter : Triggered when a peer leaves.
	* message : Triggered when a peer used 'send(yourId|"all",data)'.
	* question : Triggered when a peer used 'ask(yourId|"all",data)'.
	* @param {function(msg: StorageMessage|any): void }} callback 
	*/
	on(type,callback){
		this._priv.on(type,callback);
	}

	/**
	* sends a "message" event
	* @param {number|"all"} id : target peer id ( ts must use sendAll(data) instead of send("all",data) )
	* @param {any} data 
	*/
	send(id,data){
		this._priv.send('message',id,data);
	}

	/**
	* sends a "question" event 
	* @param {number|"all"} id : target peer id ( ts must use askAll(data) instead of ask("all",data) )
	* @param {any} data 
	* @return Promise<any> : resolved when the question is answered
	*/
	ask(id,data){
		return this._priv.ask('message',id,data);
	}

	// ------- for easyer ts mapping
	
	/**
	* 
	* @param {any} data 
	*/
	sendAll(data){
		this._priv.sendAll('message',data);
	}
	
	/**
	* asks to all peers
	* @param {any} data 
	* @return Array<Promise<any>>
	*/
	askAll(data){
		return this._priv.askAll('message',data);
	}
}





module.exports={
	StorageSocket
};