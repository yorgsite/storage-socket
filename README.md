# storage-socket
Communication socket between browser tabs using LocalStorage

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

```javascript
class StorageSocket{
	/**
	 * 
	 * @param {string} group clients shared group
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
	 * @param {function(msg: StorageMessage|any): void }} callback 
	*/
	on(type,callback){/*...*/}

	/**
	 * 
	 * @param {number|"all"} id : target peer id
	 * @param {any} data 
	 */
	send(id,data){/*...*/}

	/**
	 * 
	 * @param {number|"all"} id 
	 * @param {any} data 
	 * @return Promise<any>
	 */
	ask(id,data){/*...*/}

	// ------- for easyer ts mapping
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
