const {MessageData,StorageMessage}=require('./lib/MessageData.js');

const {StorageSocket}=require('./lib/StorageSocket.js');
const test_storage_socket=require('./test_storage_socket.js');

module.exports={
	StorageSocket,
	MessageData,
	StorageMessage,
	test_storage_socket
};