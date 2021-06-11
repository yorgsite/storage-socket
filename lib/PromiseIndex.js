

class PromiseSplit{
	constructor(){
		this._promRef={};
		this._promWait={};
		this._promData={};
		this.promise=new Promise((resolve,reject)=>{
			this._promRef={resolve,reject};
			if(this._promData.reject)reject(this._promData.resolve);
			else if(this._promData.resolve)resolve(this._promData.resolve);
		});
	}
	_getMethod(key){
		return this._promRef[key]||this._promWait[key]||
		(this._promWait[key]=(data)=>{this._promData[key]=data});
	}
	get resolve(){
		return this._getMethod('resolve');
	}
	get reject(){
		return this._getMethod('reject');
	}
}
class PromiseIndex{
	constructor(timeout=200){
		this.idCnt=1;
		this._time=Date.now();
		this._pile=new Map();
		this.timeout=timeout;
	}
	wash(){
		let time=Date.now();
		if(time-this._time>50){
			this._time=time;
			// console.log('this._pile.keys()',Array.from(this._pile.keys()));	
			Array.from(this._pile.keys())
			.forEach(k=>{
				let prom=this._pile.get(k);
				if(prom.timeout&&time-prom.time>prom.timeout){
					prom.reject(prom.timeout+'ms timeout exceeded.');
					this._pile.delete(prom.id);					
				}
			});
		}
	}
	push(nb=1){
		setTimeout(() => this.wash(), this.timeout+2);
		if(nb>1){
			return this.pushMulti(nb);
		}else{
			return this.pushOne();
		}
	}
	pushMulti(nb){
		let psl=Array(nb).fill(0).map(v=>this.pushOne());

		return {
			list:psl,
			promise:Promise.all(psl.map(v=>v.promise))
		};
	}
	pushOne(){
		let ps=new PromiseSplit();
		ps.id=this.idCnt++;
		ps.time=Date.now();
		ps.timeout=this.timeout;
		this._pile.set(ps.id,ps);
		return {id:ps.id,promise:ps.promise};
	}
	resolve(id,data){
		if(this._pile.has(id)){
			this._pile.get(id).resolve(data);
			this._pile.delete(id);
		}
	}
	resject(id,data){
		if(this._pile.has(id)){
			this._pile.get(id).resject(data);
			this._pile.delete(id);
		}
	}
}


module.exports={
	PromiseSplit,
	PromiseIndex
};