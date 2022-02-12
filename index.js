const publicIp = require('public-ip');
const axios = require('axios');

var buffIP ="";
var nowIP ="";
const getIP = (async () => {
	return await publicIp.v4();
})();

function intervalFunc() {
    getIP.then(value => {
        nowIP = value.toString();
        console.log("IP = " + nowIP);
        var objectArray;
        
        
        // console.log("buffIP = " + buffIP);
        if(nowIP != buffIP){
            console.log("+++ UPDATE IP +++");
            axios.get("https://api.cloudflare.com/client/v4/zones/e1fabf1513f0bb24814815b8ef9af8ef/dns_records", {
                    headers : {
                        'X-Auth-Key':'46e46684fd5649839d3c11e71409cf5e9d9e9',
                        'X-Auth-Email':'kompanuwat@gmail.com'
                    }
                }).then((res) => {
                    objectArray = res.data.result;
                    // console.log(objectArray);
                    objectArray.map((data)=>{
                        // console.log("id = " + data.id + "  name = " + data.name + "  content = " + data.content + "  ttl = " + data.ttl + "  proxied = " + data.proxied);
                        axios.put("https://api.cloudflare.com/client/v4/zones/e1fabf1513f0bb24814815b8ef9af8ef/dns_records/" + data.id,
                            {
                                "type":data.type,
                                "name":data.name,
                                "content": nowIP,
                                "ttl":data.ttl,
                                "proxied":data.proxied
                            },
                            {
                                headers : {
                                    'X-Auth-Key':'46e46684fd5649839d3c11e71409cf5e9d9e9',
                                    'X-Auth-Email':'kompanuwat@gmail.com'
                                }
                            }
                        )
                    });
                })


            // axios.put("https://api.cloudflare.com/client/v4/zones/e1fabf1513f0bb24814815b8ef9af8ef/dns_records/7137d720b0bda498ae091d4a80d4f1fe",
            //     {
            //         "type":"A",
            //         "name":"phanuwat.info",
            //         "content": nowIP,
            //         "ttl":1,
            //         "proxied":true
            //     },
            //     {
            //         headers : {
            //             'X-Auth-Key':'46e46684fd5649839d3c11e71409cf5e9d9e9',
            //             'X-Auth-Email':'kompanuwat@gmail.com'
            //         }
            //     }
            // )
        }
        buffIP = nowIP;
    });
}

setInterval(intervalFunc,5000);