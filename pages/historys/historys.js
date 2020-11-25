let app = getApp();
let img = wx.getStorageSync("img");

Page({
    data: {
        title: '历史连麦',
        arr_length: true,
        miumoney: img.miumoney,
        girl: img.girl,
        boy: img.boy,
        g_play: img.g_play,
        dataarr: [],
        chatting: img.chatting,
        userdata: null,
        arrlength: true,
        page: 1,
        out:''
    },
    onShow() {
        let userdata = wx.getStorageSync('userdata');
        //同意授权手机号才调取接口
        if (userdata) {
            this.setData({
                userdata: wx.getStorageSync('userdata'),
                out:wx.getStorageSync('out')
            });
            this.getdata();
        }
        // this.setData({
        //     userInfo: userdata
        // });
    },
    // 下拉触底加载更多
    onReachBottom() {
        this.setData({
            page: this.data.page + 1
        })
        this.getdata();
    },
    //获取历史连麦列表
    getdata() {
        wx.showLoading({
            title: '加载中',
        })
        let url = '/v3/gift/index',
            params = {
                seller_id: this.data.userdata.user_id,
                user_id: this.data.userdata.user_id,
                // seller_id: 5013583885235939,
                // user_id: 5013583885235939,
                trade_type: 1
            }
        params.page = this.data.page;
        app.request.getdata(1, url, params, (res => {
            let my = res.data;
            if (my.status) {
                wx.hideLoading();
                if (my.data.total) {
                    this.setData({
                        dataarr: this.data.dataarr.concat(my.data.data),
                        arrlength: true
                    });
                } else {
                    this.setData({
                        arrlength: false
                    });
                }
            } else {
                wx.showToast({
                    title: my.info,
                    duration: 3000
                })
            }
        }))
    }
})