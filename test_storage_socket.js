
const {StorageSocket}=require('./lib/StorageSocket.js');

let test_storage_socket=()=>{
	// localStorage.clear();
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
	

};

module.exports=test_storage_socket;