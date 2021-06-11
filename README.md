# storage-socket
Communication socket between browser tabs using <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" target="_blank">LocalStorage</a>.

NB : Sharing tabs must share the same origin and protocol.

Compatible js & ts

install :

`npm install storage-socket`

<hr>

## Import 

js

```javascript
const {StorageSocket} = require('storage-socket');
```
ts
```javascript
import {StorageSocket} from "storage-socket";
```

### Use

```javascript

const myGroup='group 1';//

const socket = new StorageSocket(myGroup);

```

<hr>

## API

### StorageSocket

```javascript
class StorageSocket{
	/**
	* 
	* @param {string} group clients shared group.
	* Use different group names for separated information channels.
	*/
	constructor(group){/*...*/}

	/**
	* readonly {int} current instance id
	*/
	id

	/**
	* readonly {number[]} all id list
	*/
	clients

	/**
	* readonly {number[]} peers id list (clients excluding current instance)
	*/
	peers

	/**
	* readonly {boolean} Ready state
	*/
	ready

	/**
	* Socket events listening
	* @param {'ready'|'close'|'enter'|'leave'|'message'|'question'} type 
	* callback trigger types :
	* ready : When the socket is ready
	* close : When the socket closes
	* enter : When a peer enters.
	* enter : When a peer leaves.
	* message : When a peer used 'send(yourId|"all",data)'.
	* question : When a peer used 'ask(yourId|"all",data)'.
	* @param {function(message: StorageMessage|any): void }} callback
	*/
	on(type,callback){/*...*/}

	/**
	* sends a "message" event
	* @param {number|"all"} id : target peer id ( ts must use sendAll(data) instead of send("all",data) )
	* @param {any} data 
	*/
	send(id,data){/*...*/}

	/**
	* sends a "question" event 
	* @param {number|"all"} id : target peer id ( ts must use askAll(data) instead of ask("all",data) )
	* @param {any} data 
	* @return Promise<any> : resolved when the question is answered ( using message.send(reponse) )
	*/
	ask(id,data){/*...*/}
	
	/**
	* sends to all peers
	* @param {any} data 
	*/
	sendAll(data){/*...*/}

	/**
	* asks to all peers
	* @param {any} data 
	* @return Array<Promise<any>>
	*/
	askAll(data){/*...*/}
}
```

### StorageMessage

```javascript

	class StorageMessage extends MessageData{
		/**
		* {'ready'|'close'|'enter'|'leave'|'message'|'question'} the message type
		*/
		type:string;
		/**
		* {number} the sender id
		*/
		from:number;
		/**
		* {number} the target id
		*/
		to:number;
		/**
		* {any} the sent data
		*/
		data:any;
		/**
		* sends a message to the sender
		* @param {any} data 
		*/
		send(data:any):void;
		/**
		* asks question to the sender. Does not work if message.type = 'question'.
		* @param {any} data 
		*/
		ask(data:any):void;
	}
```

<hr>

## Test

open several tabs containig this script :

js
```javascript
const {test_storage_socket} = require('storage-socket');
test_storage_socket();
```
ts
```javascript
import {test_storage_socket} from "storage-socket";
test_storage_socket();
```

## Exemple :


```javascript
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
	
	setTimeout(() => { 
		socket.send('all','hello!'+Math.random());
	}, 1000);
	setTimeout(() => { 
		
		console.log('ss2 ask');
		socket.askAll({txt:'OO R U ?'})
		.map(p=>{
			p.then(r=>{
				console.log('reponse',r);
			});
		});
	}, 3000);
```
