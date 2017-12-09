let fs= require("fs");
let ary=fs.readdirSync("./");
let result=[];
ary.forEach(function (item) {
    if(/\.(png|gif|jpg)/i.test(item)){
        result.push("img/"+item)
    }
})
fs.writeFileSync("./result.txt",JSON.stringify(result),"utf-8");