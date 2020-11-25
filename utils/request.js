//请求方法的封装 

let host = 'https';
let order = 'https';
let didi = 'https'; //这个是获取的车型 测试api和正式api相同
let payment = 'https';
let cms = 'https';

//test为测试接口，没有test为正式接口，可根据开发上线环境更改
//函数所传参数分别为：请求的接口前缀、接口地址、所传的参数、返回的信息，失败的信息
//由于后台接口提供了多个接口来请求导致接口前缀不相同，所以需要进行判断，在调取接口的同时传入接口前缀的判断（具体见方法）

//get方法获取数据
function getdata(which, u_url, parmas, get_data, fails) {
    let theurl = connect(which) + u_url;
    wx.request({
        url: theurl,
        data: parmas,
        header: {
            "content-type": "application/json/charset=UTF-8"
        },
        method: 'GET',
        success(res) {
            return typeof get_data == "function" && get_data(res);
        },
        fail(res) {
            console.log(res);
        }
    })
}

//post方法传数据
function postdata(which, u_url, parmas, post_data, fails) {
    let theurl = connect(which) + u_url;
    wx.request({
        url: theurl,
        data: parmas,
        header: {
            "content-type": "application/json/charset=UTF-8"
        },
        method: 'POST',
        success(res) {
            return typeof post_data == "function" && post_data(res);
        },
        fail(res) {
            console.log(res);
        }
    })
}

//不同的前缀
function connect(val) {
    switch (val) {
        //订单接口（历史连麦）
        case 1:
            return order;
            break;
        //车型列表
        case 2:
            return didi;
            break;
        //我的喵币
        case 3:
            return payment;
            break;
        //首页轮播图
        case 4:
            return cms;
            break;
        //用户接口（获取手机号、用户user_id等） 调取时记得传 0
        default:
            return host;
    }
}

//对外暴露
module.exports.getdata = getdata;
module.exports.postdata = postdata;