# storage-socket
Communication socket between browser tabs using LocalStorage

Compatible js & ts

install :

`npm install storage-socket`


```javascript

const {StorageSocket} = require('storage-socket');

const myGroup='group 1';//

const socket = new StorageSocket(myGroup);

```

### Methods
```javascript
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
	 * @param {'ready'|'close'|'enter'|'leave'|'message'|'question'} type 
	 * @param {function(msg: StorageMessage|any): void }} callback 
	*/
	on(type,callback){}

	/**
	 * 
	 * @param {number|"all"} id : target peer id
	 * @param {any} data 
	 */
	send(id,data){}

	/**
	 * 
	 * @param {number|"all"} id 
	 * @param {any} data 
	 * @return Promise<any>
	 */
	ask(id,data){}

	// ------- for easyer ts mapping
	/**
	 * sends to all peers
	 * @param {any} data 
	 */
	sendAll(data){}

	/**
	 * asks to all peers
	 * @param {any} data 
	 * @return Array<Promise<any>>
	 */
	askAll(data){
		return this._priv.askAll('message',data);
	}
}
```

`on(type:'ready'|'close'|'enter'|'leave'|'message'|'question',callback:{ (msg: StorageMessage|any): void }):void;`

=======================


	let socket=new StorageSocket('ys2');
	console.log('peers',socket.peers);
	socket.on('message',msg=>{
		console.log('on msg !!',msg);
	});
	socket.on('enter',msg=>{
		console.log('on enter',msg);
	});
	socket.on('leave',msg=>{
		console.log('on leave',msg);
	});
	socket.on('question',msg=>{
		console.log('on question asked ',msg);
		if(msg.data.txt==='OO R U ?'){
			msg.send({txt:'i am '+document.location.href});
		}
		
	});
