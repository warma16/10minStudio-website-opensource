const tool=require('./tool.js')
class request_item{
    constructor(id=""){
        this.id = '';
        this.name = '';
        this.method = '';
        this.url = '';
        this.status = 0;
        this.statusText = '';
        this.readyState = 0;
        this.header = null; 
        this.requestHeader = null;
        this.startTime = 0;
        this.endTime = 0;
        this.costTime = 0;
        this.getData = null;
        this.postData = null;
        this.actived = false;
        this.id = id;
    }
}
class Api   {
    constructor(visitorId){
        this.console=[]
        this.nativeconsole=[]
        this.visitorId=visitorId
        this.reqList=[]
        this.mockConsole()
        this.mockAjax()
        //this.mockConsole()
        this.mockError()
    }
    mockConsole() {
        const that = this;
        const methodList = ['log', 'info', 'warn', 'debug', 'error'];
        const method2CN = {'log':"正常", 'info':"信息", 'warn':"警告", 'debug':"调试", 'error':"错误"};
        if (!window.console) {
            window.console = {};
        } else {
            methodList.map(function(method) {
                that.console[method] = window.console[method];
                that.nativeconsole[method] = window.console[method]
            });
            that.nativeconsole.time = window.console.time;
            that.nativeconsole.timeEnd = window.console.timeEnd;
            that.nativeconsole.clear = window.console.clear;
            that.console.time = window.console.time;
            that.console.timeEnd = window.console.timeEnd;
            that.console.clear = window.console.clear;
            
        }

        methodList.map(method => {
            window.console[method] = (...args) => {
                this.report(String(method),"console",{
                    logs:args,
                    TMSVisitorId:this.visitorId
                });
               
            };
        });

        const timeLog = {}
        window.console.time = function(label) {
            timeLog[label] = Date.now();
        };
        window.console.timeEnd = function(label) {
            var pre = timeLog[label];
            if (pre) {
                console.log(label + ':', (Date.now() - pre) + 'ms');
                delete timeLog[label];
            } else {
                console.log(label + ': 0ms');
            }
        };
        window.addEventListener("consoleegg",(e)=>{
            let data=e.detail
            let text=data.text
            that.nativeconsole["log"]("%c+",`font-size: 1px;padding: 122px 217px;background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAMAAAAJixmgAAAA/WlDQ1BpY2MAACjPY2BgkmAAAiYBBobcvJKiIHcnhYjIKAUGJJCYXFzAgBswMjB8uwYiGRgu6zKQDjhTUouTgfQHIC4pAloONDIFyBZJh7ArQOwkCLsHxC4KCXIGshcA2RrpSOwkJHZ5SUEJkH0CpD65oAjEvgNk2+TmlCYj3M3Ak5oXGgykI4BYhqGYIYjBncGJDD/gBYjwzF/EwGDxlYGBeQJCLGkmA8P2VgYGiVsIMRWgH/hbGBi2nS9ILEoEC7GAIiktjYHh03IGBt5IBgbhCwwMXNGYdiDiAodfFcB+dWfIB8J0hhyGVKCIJ0MeQzKDHpBlxGDAYMhgBgBMpUCR+j/+1wAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAClFBMVEX////+/v75+fn9/f38+/z39/fl5eW9vb2dnZ2cnJybm5uTk5ONjY2QkJCUlJSSkpKZmZmqqqro6Oj19fXh4eFbW1tfX19HR0cdHR0AAAAaGhqAgICHh4eGhoaFhYUWFhZCQkLU1NT6+vrAwMBBQUErKysBAQECAgIDAwPV1dXz8/MUFBQ4ODjX19f4+PgqKirg4OC4uLhUVFQKCgp9fX0sLCwPDw9jY2MMDAzc3Nzr6+tlZWUODg6Li4sHBwfa2toYGBjW1tYjIyPd3d3GxsbBwcG7u7u3t7egoKA9PT3Ly8urq6sNDQ06OjpaWlpYWFhkZGSioqLx8fGMjIwTExMpKSne3t5wcHAxMTEzMzOCgoKampqsrKwcHBxFRUUfHx/u7u50dHTy8vIwMDBXV1cRERHi4uIiIiJiYmIFBQUICAgyMjLq6upVVVWvr69GRkZ5eXnZ2dlPT0/j4+MGBgZNTU00NDRvb2/T09P29vaysrItLS3CwsIQEBDk5ORMTExTU1Oenp4mJiahoaE5OTmWlpbw8PDv7++EhIQoKCgkJCQlJSUeHh4JCQkVFRUhISEXFxcvLy82NjY3NzcbGxvHx8fn5+fp6enOzs5paWlqamrIyMiPj48/Pz+xsbHb29uJiYlhYWE7Oztzc3OlpaV7e3u+vr62trZycnLs7Ow+Pj7ExMSBgYF2dnZdXV3S0tJ4eHikpKRra2t6enqoqKjFxcVERES6urrMzMynpqd3d3fQ0NCpqalJSUmXl5dcXFyVlZVWVlZLS0vJyclxcXFOTk6IiIiwsLBtbW25ublAQEBmZmZsbGxQUFBSUVKzs7NoaGheXl6jo6O/v79ISEjNzc1/f3+tra20tLSOjo7Pz89+fn5mezvqAAAAAWJLR0QAiAUdSAAAAAd0SU1FB+YLEwcXO4hy4GgAAAE9elRYdFJhdyBwcm9maWxlIHR5cGUgaWNjAAA4y61UW5KEIAz85xR7BAh5wHEUpGrvf4ENj+w4O/oxU9tViMbYCd2g+y7FfXVQZOc7ICRvgDAmrnwIChCgIICnRJk28HdwHDhKFP8hRtWmVZ09dNQI9VNG92Z+ZmSSyHE+thUWdKrCWP1slHF1jCznuKTf+FN+KhbvRKiCzgphM8WTEl3Hb/KdiHqjrc0X5VFZDRCweF2VY1Fdi5At7SG6aVSY+CCilUBGqASiMVLftZ7HW//fFfvfXHuBbdQnIm5z68bUaEqSL3c0Q8593iXRNK9u7ioRcLnR0hB759LEcxDgcEpDS2fF6KjBNs9IpVEpxLXBN9rvlnLG5RG5s3fNf9w1wlDctJXbGv1eLWeaSagd8qFDP4RjxqJeOk9Ucv19/ABRgdz3xWU5swAAAAFvck5UAc+id5oAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjItMTEtMTlUMDc6MjM6NTkrMDA6MDDZxJ7cAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIyLTExLTE5VDA3OjIzOjU4KzAwOjAwDu4t1AAAAB50RVh0aWNjOmNvcHlyaWdodABHb29nbGUgSW5jLiAyMDE2rAszOAAAABR0RVh0aWNjOmRlc2NyaXB0aW9uAHNSR0K6kHMHAAAAWmVYSWZNTQAqAAAACAAFARIAAwAAAAEAAQAAARoABQAAAAEAAABKARsABQAAAAEAAABSASgAAwAAAAEAAgAAAhMAAwAAAAEAAQAAAAAAAAAAAEgAAAABAAAASAAAAAEfUvc0AAAQg0lEQVR42u2c+0PUxr7Av3msqKigK5ZQKxBdHqsEH+UpRQStiugKAspRBBcEUdGKlrpyikoViqwKPhDRSr320NIqVGyP9EilqK21x7Y+Su3l/jN3Jtn3JgusS+Uxnx92s0lmMp/MZB7ZTAAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgjHgo2rrMAEtTFINgBw2AinrdDkODBYaGCV4TJ06cNHmy95Sp07wRPoPGd/qM120wNNQAM/1mveHPIQLe9PGZPfstxJxBExgU/LoVBgfLSN/83HkajgsJCQ0NC9OEa0Eqzvygmb8g4nWrDA6aAQH4mcFhiNDQ0BCcw5ELh345jhZhhgEK+EWLl4wXYVQ9A7wdFRJtK6yZOfRoRo0wao1i5nOxXKjEmBdmtHFviJK4ujIbj2FhiolfmsBJSMpjXJiBd2LDEu2EEWNXmGKWJXEcN26EGVieHMZxNsohI6dZQt1zLdApK1a+u2r1u7SaQrxynELwGo4bqcLIMXXtFE3auvW6DemQ4RFh7cbMRDnhrGzUHRniATwtzKq8Nm3O+ceWrctoAfUGh5weWSJyOW6kCk/clrdtRUQ+j7JaxaKhHLyisBh4e+gIFOaB1mekFkQVhosjdI/kLIZRM/E7QrnQkSaMslRb9HbxziJQCR4VRtXAFq5kV1jICBNGxG/bvVpt/uE5YWDXpIVyISNLmAVeu6c0KoXBV61nhQXYm8lxI+0apkFI3bfOI4LOUb/HjTxhgP1lugPDIgyw9OAIE2Zp0FLvly8fHl0mpTBESRj3pV9PDjMfaA4ZVMMiTB1OUizSFa4KlcKJ8IzwP5NXiL2q4RCe/qGicFTRaxKuPHKUgVcSVg5JHStRFK6K4xkXvsMmzH90HEVC8ewrCCtfiic4ReHiCIOg12dkVFfXODGcwgeiPo7HfWfefWFGWdg3tvYkog5RZaIWgb9LisvrIiOzsvCvzcnGqmL/JVxIyam0qKREH6X4TqdFRZrRbM6Kqi2PTOO4XYH+Z+Zz9Q0NZ2tNNESeO5kXi0bhBxPmn+diizUSkQ0LCiITAisKklFq6ioqlpREFWgcwXHvrg9NjjKRXHu2LquiqiqaS0iM3RGQ57+JEoXlpVeXXmhEzEBcNLEHgb8rmmoaFy7Mzk5JiYsLLpoQ533pTLGu+R/TLp8IuKJ0/nI/udpSZGJCfFHKhU+vRf/Ptes+n6UWcj7ZlQvN2yKKWiZ9EFAXM+tf6a2fGy+FZ0sUTchuvFjxRWPGxfi2+Mb4oi8rvtLOdGQh4uKW3BWm5DY21sxo29N47IYm4ej1mz6LgpEwqyw8zS8D/0WC/1BhTOAd8XdDimC5JEB7dVZA+9S5OAr+3cAtSqXtw+Md1nIF7JtBUV/famLZDABdmC9QljpBWNUZeC19hZblaTo16bbWfGwwwMLaDr20o8CUaZpop2OIIt8kf2v6d4dCvSd25Yasf0++Ewf4byEsbPZwTqF34QSljWfCrcsd65JudGlx08jQsMg4VeniOb0gG1Qm6LUFO/Z2VaNxDzpJhua076DNIny86j93JwCrp1FnednJTmubS9Pp5QJDM2JqqPdz4xQO1J152byIRlYbKr6/08LTwOBwSJhXFr7Xs0cp8VUzQUoge+CjhOZg3hwBddj4g1KYpKBgwAerBj7lSNKcNosH28ytFuMCNRg21vfetaYl2Lg0wyZlmzehrrR0XP5+VBwvn8PT5z/Ay2g4xWunZm3W4oJgUjQ+BPaVhPlU3bo5FKiHIswyF3J+vGNtWCzCILAH/Ap+aqNZSxh74UrNI9Z8ogcWBlDl/1wwR4yO8pRw15qylTjN/BCEYW1UcyOScxTWA7Qc+bHVIF55ssKtJ801B7ogjwwkTFEXmwse14hnh/WU8CfFc60HGoQwNo5Ivp9tsFlvzWG+M8mLzwC1dRsWNl/cDKQbbQK9r2lRqLQsOXybmwv4SDzNv6pwbRHqojH5b/yy3D7cgMKo71A3K5+1PaBZmGl8eHIFgJ1FeN5/9WZhHm4nma1QASmTExZZezoVdyBrbme1iiWKwjksSbpdaWFhff6TyHCDzQU3GGFq/76YPQaQFZ6d865jGCxsPgAPneX4NIupVbG/Ri4T5A+EhFEY+uOTd1SMDa8srOquSqccTvKAwm0Pa9FAyyAnvHX3JK0rYYCfCylT9cOomN9cCQtArdRMksbsHhGORMJNuW+ywNqvdyk8DzXet6oegZqVzeHADwx6x0JqL/xVx2CF1cD+2EsD7TFhTTatrrruXEvC73knlMLU/7Icuk53o+uXpRyFPwK6vIxxHoAtP/NUa38UKSAlUEcVr+GtgV0C6GpNe9vhtnDWfvDdHS4ztnQhHIuElz5rc+rLYuFHKJXLZaJzFoZBCcPcqi7PCrdkG5+reecsdiGcsGbZi6RWGuSEr0YceQ8ocDKQEZasBxCesPhmvPUMWcHNkvLgwYWwMXx7MtNGDUk493hK6Taels3hz1YHRsjdUXBX+HLW79Z9PSGc1xo03UA7B3JVaX0YdOuM3Hos/JPuiuwgyy3h7oBFWQ/lN7kt7H87aiYtkyWuhHes+eN7JeHO4q9kw7gjTD03FtY9ZmW3uS1cX/a1nK9L4fNnTr5QEj53jZVNoTvCTHdAmsbAyt5by/tC6hIPWTj0oK/s7T9XwoFcbJ+S8Kk/5cO4lcOfp5VsQj4eFea2RbBDFT4fcl22p4CF/S/L31t37xpOiG5RkHJfeKnAygVyJZwbOke22GLh4/huiaeEb2U+AYXbse4LfwFDFk4KnSi7HgvnoBGNx4S/i76jJOW+cIxhyMKBYS8Vha8DeC6HX8amel74Jsh20FwJn877XXY9Fv5UYRzglvDe6D5QwG3hgOdDFw6s9ZL9ewYLX+Hlw7iXw/M9L1x1iOaHXKTLHygK36PAcz2t4RDWtMjX0sxh4zRF4S87FIWPUZTnKq3hEE4uYmSrffaw0dsd4XSW91hPa5iE5QPx0wN93BF+ztMju0gnK/whzh9boihc/8khWSme6eRuyTfDo0D4ROj4Ehb+5N5RCpP0i/zMNI8Lb83s+tuEU86HzRlTwuYdlYRXlHCKf5cGzAuXXc9ST7jPGPkB+4gXDt+ReWXcCOOYdmnyNo4bYZSw1IY5Sb7jRphiVKV/7C2eMm6Egf0rM7zbfxxVWvFlX8Kq8/87boRVc4IiYFXu+BF+sWaLfjwIU+YHVGv9qoH6K2DMN0t4hRb4/ZvXqwzjQljMYPrbeWU0MBTcyVMcLY0VYfzbsH/ezoXikotrWGnwMNqEUXk2zN3840K0pOfhsfKzliNf2Lc93nGVrTA6nAp1KCk6IibrBlqkgHIp7PYNAJlQw3MDYABhqTTzRTfKgx5RNEi3bRf5K46WRr2wGjdIKRvLzky+y6rM21wIK93EGzXCKlB77Y480x3HoNLNA8OOCmHKzsOee2WtqYgHNlxG4O+Th1ff3IXISu+/i+jvD+9AH/39wd7R2x8ocL7i5comB1CQpm8v+5XcCO7qk2N6vZ/XhdS+VPHAiAsm+ppWfpn8uKnprjMdEe8Evuzr6upKTUUfDtFWPWGUhdmrusL1CJ0NhQj8/ey/uvt+fn660sJfdbre3tJSv0L0gek9erRUFp1fb0+vzs+enp4ev8XPfut9f2dPoTM63fr1hT097bPae0z7r5d4dm29X8/65tL2xc6ULo7pffasvb0dBUQ8s0OXDi5yWKiu1uvxZB0r1Qj8VdOmr6lBi/pqQ021VqvXC2ot3ler1qsMWln0Wl4taB2m/OD41Gg9w6oz5Ig37GEy1Copcmta1KoadU2GNp+udkavrdFrcUKl2O3jq6wWlIUphf9sLVvx7I9GU3hzJPngMohcNU3jh/+BVRlUzgBfoxQTTatYaQaKPQyeQia96ct2eor0uKU5BfI5bI7dBtvH9hx/DxjRkFF6vMi0kXG5lVJ4wHDg9I0x4cEelgg7CIur8A9TW+uet8OEAhyzdCzLFsq6MFzCcvKOv3FPmmVBrCN4huUFwaYjwaoY8SYuhseTV0wCGbYx4/ePAC9Nlc03vXlQfBSMws/sMnq0SQuMOHnAXJcaWEY/yIxyTPcrC9egVKz2PSD+FmZ+c6UbGMs+M7xPVAPc8cXLQuVfa/G32iv9AMRNs0y7FgTQ+t6btggvd3x0LP3evZl6qM5YexV10afih5B46s4Pvr7BNHZlH4uTYAyg7vbZ8pIdKK3DIoxO+qeZ9S8EvNy4qe5Srs0DO/1ppy6oir7nxOLYv28BXle9lOuCHxIv28T8dugvecdx+BPnYsPqKrZio7M5FBi4GOxENYRV1B8XZ4GoYxLwfqz644A1Df7/8Zgw5SISmd8Rz2sfietb/KfVLLhkPfH9CdxE6ruSRLE0xp39BK/L38kVw+TEB+Z99MAYz86IOITjqg7fefDzcB53z8/hnblmdDppiNq9f1X9vgxc+JtFYeabgCfB2b0JAIxsuocszIvTquzfPmt+KafcKOBuspSt/SX3WN8jlZb1Dw7Wp+Vv/zlZnEMUHCS+g6OteWPF2qmnLDOoaWDvR3+6vBonioYN3DIGv0wT1lVQwIR0UvjslZ/loScKdXQo1dKDYlyTw1oZ+D9ur4MwTrfSK0YVp7WLZ4gxKG+T6YTZCk/SHLLEnXrqX7W3tt0PEGs0JIyl9myY8tbutxMt82trgL6qS/B/aCvMQkZDMirXSBi3Ajk5IFype4F0zMKfcSj8m6eOOVgMNd0WWAjue4FotcHLRCo4nytbYe9fJ1jmIPWHnvi14LdLnNjRMwnXtD+HJVlck3kfnEbD1nWcrTCw6qAc4A3cBtTFpFRRdUAXNuCbToYNJeLkYG+uD4TtS+ayIDim2zattsil24rqZpUR4W9DromyAYq0cYM14su7JnVwTzfGiq9cRsI4d2bM8mUeLSlZaS2GVDO6NhMtwryYHU+MX0FbbCduntic4/CoqsGA51o/3SVej4dzFzMHZnGMqf2yTbdtWm0pA0/Bwr5A46k/xOVvdsw/b/N4WseOE9S2bzcaxWJ4d919/H0x5geqsjzW5rn/7oIlITt2i7UvNIf1mUqeJsF/178rGQNq29dEJ9afw4VBgM5MqWXwns+lJR+WJgd7zGSQqOD57Cl/dovLwqTmq7T1ge/Kn4JRLew1WxSe4btanDS9tgvgn2/lWyOgU2489Zkh1aTT30PtuthTCf/60gfL1WIReP7O7KvV0r4vP5b24/962ryCxpPV/m5dnKAMlrFcShmgtX3dOKpkDW2UWOEDrlQYiq9B2wWHt1MIWql/KtjdszVPjkI5j3Iaz7unpQmXIBjUvEALLOWy7h0eKKkyEBPK4BpIZXPWcf+PZ/GMMDyVV2AZ8zbaLIzyyL7FoFjzBlStGkCQ3gXHigNaU0de2sEgzi98bcIiMq+OkQYeOGXilHinFNqnWdwP7AcJYDMpGyj7Z29fg6/zCXB8jtpmtMUwAwzLHfXN4zGbURo1hoUtgorCI4FxJ6x8ItxI7miRI8LuCo9mxp0wgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFA+Nv4fxWKWVlJfgXMAAAAAElFTkSuQmCC);background-size: contain;background-repeat: no-repeat;color: transparent;`);
            that.nativeconsole["log"](text)
        })
        window.console.clear = (...args) => {
            that.clearLog();
            that.console.clear.apply(window.console, args);
        };
    }
    report(type,clas,data=""){
        //this.nativeconsole.log(data)
        if (window._hmt) {
            
              window._hmt.push(['_trackEvent',String(type),String(clas),JSON.stringify(data),1])
            
              

        }
    }
    mockError(){

        window.onerror = function(errorMessage, scriptURI, lineNo, columnNo, error) {
            window.console.log('errorMessage: ' + errorMessage); // 异常信息
            console.log('scriptURI: ' + scriptURI); // 异常文件路径
            console.log('lineNo: ' + lineNo); // 异常行号
            console.log('columnNo: ' + columnNo); // 异常列号
            console.log('error: ' + error); // 异常堆栈信息
            // ...
            // 异常上报
            this.report("error","js",{
                errorMessage:errorMessage,
                scriptURI:scriptURI,
                lineNo:lineNo,           
                columnNo:columnNo,           
                error:error,
                TMSVisitorId:this.visitorId

            })
          };
    }
    mockAjax() {
        let _XMLHttpRequest = window.XMLHttpRequest;
        if (!_XMLHttpRequest) { return; }
        //将this存储起来
        let that = this;
        let _open = window.XMLHttpRequest.prototype.open,
            _send = window.XMLHttpRequest.prototype.send;
        that._open = _open;
        that._send = _send;

        // 模拟XMLHttpRequest的open方法
        window.XMLHttpRequest.prototype.open = function() {
            let XMLReq = this;
            //分割请求的参数
            let args = [].slice.call(arguments),
                method = args[0],
                url = args[1],
                id = that.getUniqueID(); //设置一个值存储当前请求的唯一id，唯一标识
            //定义一个时间计时器
            let timer = null;

            // may be used by other functions
            XMLReq._requestID = id;
            XMLReq._method = method;
            XMLReq._url = url;

            //  模拟XMLHttpRequest的onreadystatechange
            let _onreadystatechange = XMLReq.onreadystatechange || function() {};
            let onreadystatechange = function() {
                let item = that.reqList[id] || {};
                // update status
                item.readyState = XMLReq.readyState;
                item.status = 0;
                if (XMLReq.readyState > 1) {
                    item.status = XMLReq.status;
                }
                item.responseType = XMLReq.responseType;

                if (XMLReq.readyState == 0) {
                    // UNSENT
                    if (!item.startTime) {
                        item.startTime = (+new Date());
                    }
                } else if (XMLReq.readyState == 1) {
                    // OPENED
                    if (!item.startTime) {
                        item.startTime = (+new Date());
                    }
                } else if (XMLReq.readyState == 2) {
                    // HEADERS_RECEIVED
                    item.header = {};
                    let header = XMLReq.getAllResponseHeaders() || '',
                        headerArr = header.split("\n");
                    // extract plain text to key-value format
                    for (let i = 0; i < headerArr.length; i++) {
                        let line = headerArr[i];
                        if (!line) { continue; }
                        let arr = line.split(': ');
                        let key = arr[0],
                            value = arr.slice(1).join(': ');
                        item.header[key] = value;
                    }
                } else if (XMLReq.readyState == 3) {
                    // LOADING
                } else if (XMLReq.readyState == 4) {
                    // DONE
                    clearInterval(timer);
                    item.endTime = +new Date(),
                        item.costTime = item.endTime - (item.startTime || item.endTime);
                    item.response = XMLReq.response;
                } else {
                    clearInterval(timer);
                }

                if (!XMLReq._noVConsole) {
                    that.updateRequest(id, item);
                }
                return _onreadystatechange.apply(XMLReq, arguments);
            };
            //覆盖原始默认的onreadystatechange
            XMLReq.onreadystatechange = onreadystatechange;
            //为了怕请求过程占用第三方应用汇修改xhr默认的方法，所以用了一个定时器循环来监听readyState的变化
            let preState = -1;
            timer = setInterval(function() {
                if (preState != XMLReq.readyState) {
                    preState = XMLReq.readyState;
                    onreadystatechange.call(XMLReq);
                }
            }, 10);

            return _open.apply(XMLReq, args);
        };

        // 默认send方法
        window.XMLHttpRequest.prototype.send = function() {
            let XMLReq = this;
            let args = [].slice.call(arguments),
                data = args[0];
            //重请求池找出相应的请求
            let item = that.reqList[XMLReq._requestID] || {};
            item.method = XMLReq._method.toUpperCase();
            //处理url后面跟着的参数，
            //1,先以？分割为数组
            let query = XMLReq._url.split('?'); // a.php?b=c&d=?e => ['a.php', 'b=c&d=', '?e']
            // 2,在去除最前面的数组
            item.url = query.shift(); // => ['b=c&d=', '?e']
            if (query.length > 0) {
                item.getData = {};
                //3,然后剩下的？又重新连接在一起
                query = query.join('?'); // => 'b=c&d=?e'
                //4,在以& 去键值对
                query = query.split('&'); // => ['b=c', 'd=?e']
                for (let q of query) {
                    q = q.split('=');
                    item.getData[q[0]] = q[1];
                }
            }
            //处理post请求方式，注意这里 会有url接参数，但又是post请求的情况，这里也能处理
            if (item.method == 'POST') {
                // save POST data
                if (tool.isString(data)) {
                    let arr = data.split('&');
                    item.postData = {};
                    for (let q of arr) {
                        q = q.split('=');
                        item.postData[q[0]] = q[1];
                    }
                } else if (tool.isPlainObject(data)) {
                    item.postData = data;
                }

            }

            if (!XMLReq._noVConsole) {
                
                that.updateRequest(XMLReq._requestID, item);
            }

            return _send.apply(XMLReq, args);
        };

    }
    getUniqueID(){
        return Number(Math.random().toString().substr(3,length) + Date.now()).toString(36);
    }
    updateRequest(id, data){
        var preCount = Object.keys(this.reqList).length;
        // update item
        var item = this.reqList[id] || new request_item(id);
        for (var key in data) {
            item[key] = data[key];
        }
        this.reqList[id] = item;
        // console.log(item);
        
        
        if (item.status >= 400) {
            
            this.report("error","network",{
                logType: "network_error",
                logs: {
                    status: item.status,
                    url:item.url
                    ,req_header:item.requestHeader,
                    method:item.method,
                    postdata:item.postData,
                    res:item.response,
                    getData:item.getData,
                    TMSVisitorId:this.visitorId
                }
            });
                
  
          
        }else if(item.status>=300&&item.status<400){
            this.report("success","network",{
                logType: "network_redirect",
                logs: {
                    status: item.status,
                    url:item.url,
                    req_header:item.requestHeader,
                    method:item.method,
                    postdata:item.postData,
                    getData:item.getData,
                    TMSVisitorId:this.visitorId
                }
            });
        }else{
            this.report("success","network",{
                logType: "network_ok",
                logs: {
                    status: item.status,
                    url:item.url,
                    req_header:item.requestHeader,
                    method:item.method,
                    postdata:item.postData,
                    getData:item.getData,
                    TMSVisitorId:this.visitorId
                }
            });
        }
        
        // update header
        
    }


}

export default Api