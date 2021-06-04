





// declare module "storage-socket" {
	
	export interface MessageData {
		// constructor(data: any|undefined);
		type:string;
		from:number;
		to:number;
		data:any;
		// metha:any;
	}

	export interface StorageMessage extends MessageData{
		send(data:any):void;
		ask(data:any):void;
	}
	
	export class StorageSocket {
		constructor(group: string);
		get id():number;
		get clients():number;
		get peers():number;
		get ready():boolean;
		on(type:'ready'|'close'|'enter'|'leave'|'message'|'question',callback:{ (msg: StorageMessage|any): void }):void;
		send(id:number|"all",data:any):void;
		ask(id:number|"all",data:any):Promise<any>;
		sendAll(data:any):void;
		askAll(data:any):Array<Promise<any>>;
	}
	

	export function test_storage_socket();
// }