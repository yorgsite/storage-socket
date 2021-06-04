
/**
 * localStorage data handler
 */
 class StorageData{
	constructor(stkey,data={}){
		this.key=stkey;
		this.data=data;
		this.read();
	}
	get exists(){
		return localStorage.getItem(this.key)!==null;
	}
	read(){
		let data=null;
		try{data=JSON.parse(localStorage.getItem(this.key));}catch(e){}
		
		if(data!==null){
			this.data=data;
			return true;
		}
	}
	write(){
		localStorage.setItem(this.key,JSON.stringify(this.data));
	}
	destroy(){
		localStorage.removeItem(this.key);
	}
}

/**
 * localstorage data client interface
 */
 class StorageClient extends StorageData{
	constructor(stkey){
		super(stkey,{
			ssi:0,
			messages:[]
		});
	}
	save(){
		let time=Date.now();
		this.data.ssi=time+'_'+Math.floor(Math.random()*1E12);
		this.data.messages.forEach(msg => {
			if(!msg.ssi)msg.ssi=this.data.ssi;
		});
		this.write();
	}
}


module.exports={
	StorageData,
	StorageClient
};