
class Listener{
	constructor(){
		this._map=new Map();
	}
	flush(type,args){
		if(this._map.has(type))this._map.get(type).forEach(cb=>cb(...args));
	}
	add(type,cb){
		if(!this._map.has(type))this._map.set(type,[]);
		this._map.get(type).push(cb);
	}
}
module.exports={
	Listener
};