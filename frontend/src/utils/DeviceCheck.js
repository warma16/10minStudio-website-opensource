class DeviceCheck{
    constructor(){
        this.Type={
            Phone:0,
            Pad:1,
            PC:2,
            ApplePlatform:3,
            PCPlatform:4,
            AndroidPlatform:5,

        }
    }
    DisplayCheck(){
        let maxWidth=window.screen.width;
        if(maxWidth<=734){
            return this.Type.Phone;
        }
        if(maxWidth<=1068){
            return this.Type.Pad;
        }
        return this.Type.PC;
    }
    PlatformCheck(){
        let ua=navigator.userAgent;
        if(ua.indexOf('iPhone')>-1){
            return this.Type.ApplePlatform;
        }
    }
}

export default new DeviceCheck();