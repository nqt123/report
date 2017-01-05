function noOp() {
};

exports.Cleanup = function Cleanup(callback) {

    callback = callback || noOp;
    process.on('cleanup', callback);

    process.on('exit', function () {
        process.emit('cleanup');
    });

    process.on('SIGINT', function () {
        _ActiveMQ.disconnect(function(e){
            process.exit(2);
        });
    });

    process.on('uncaughtException', function (e) {
        console.log('Uncaught Exception...');
        log.error(e);

        if (QUEUE_TernalPublish){
            QUEUE_TernalPublish.queueError(e);
        }

        process.exit(99);
    });
};