let b =[[1,2,3,4,],['a','b','c','d','e','f','g','h','i','j'],[23,24,36,75]]
let c = '';

b.some(s=>{
    s.some(a=>{
        if(a === 'h'){
            return true;
        }
        console.log(a)
    })
})