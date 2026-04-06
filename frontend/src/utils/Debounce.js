
function debounce(fn, delay = 1000) {
        
        let time = null
        
        function _debounce(...args) {
            if (time !== null) {
                clearTimeout(time)
            }
            
            time = setTimeout(() => {
                // 使用apply改变fn的this，同时将参数传递给fn
                fn.apply(this, args)  
            }, delay)
        }
        
        return _debounce
    }
export default debounce