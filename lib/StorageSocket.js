

// ------------------------
const {StorageSocket_priv}=require('./StorageSocket_priv.js');
const sockets={};

class StorageSocket{
	/**
	 * 
	 * @param {string} group clients shared group
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
	 * @param {string} type 'ready' 'enter' 'leave' 'message'
	 * @param {function} callback 
	 */
	on(type,callback){
		this._priv.on(type,callback);
	}
	/**
	 * 
	 * @param {number|"all"} id : target peer id
	 * @param {any} data 
	 */
	send(id,data){
		this._priv.send('message',id,data);
	}
	/**
	 * 
	 * @param {*} id 
	 * @param {*} data 
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
	 * 
	 * @param {*} id 
	 * @param {*} data 
	 */
	askAll(data){
		return this._priv.askAll('message',data);
	}
}





module.exports={
	StorageSocket
};