class Scheduler {
    private static allTheTask:Array<Function> = [];
    private static queue:Array<Function> = [];
    private static webSocketHandler:WebSocket;
    private static wsmsg:string;
    public static importTasks(tasks:Array<Function>) {
        for(var i = 0; i < tasks.length; i++) {
            var task=tasks[i];
            //检查 Task 是否为输入为(req, res,next)的函数,要检查是否有这三个参数，因为要放些express中间件机制
            if(task.length == 3) {

                Scheduler.allTheTask.push(tasks[i]);
            }
        }
    }
    private static mockReq() {
        try{
            var params1=JSON.parse(Scheduler.wsmsg);
            return{
                params:params1,
                input:Scheduler.wsmsg,
                ws:Scheduler.webSocketHandler,
            }
        }catch(e){
            console.log(Scheduler.wsmsg)
            return{
                params:{},
                input:Scheduler.wsmsg,
                ws:Scheduler.webSocketHandler,
            }
        }
    }
    private static mockRes() {
        return {
            send: function (data) {
                Scheduler.webSocketHandler.send(JSON.stringify(data));
            }
        }
    }
    private static mockNext() {
        //队列弹出
        Scheduler.queue.shift();
        if(Scheduler.queue.length > 0) {
            Scheduler.queue[0](Scheduler.mockReq(), Scheduler.mockRes(), Scheduler.mockNext());
        }
    }
    public static Start(webSocketHandler:WebSocket,wsmsg:string) {
        Scheduler.webSocketHandler = webSocketHandler;
        Scheduler.wsmsg = wsmsg;
        Scheduler.queue = Scheduler.allTheTask.slice();
        Scheduler.queue[0](Scheduler.mockReq(), Scheduler.mockRes(), Scheduler.mockNext());
    }
}

export default Scheduler;