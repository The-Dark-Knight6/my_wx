let app = getApp();
const img = wx.getStorageSync("img");

Page({
    data: {
        title: '我的喵币',
        my_money: '0.00', //我的喵币
        money: img.miumoney,
        no_money: img.no_money,
        arr: [{
                name: '全部',
                id: 0
            },
            {
                name: '收入',
                id: 1
            },
            {
                name: '支出',
                id: 2
            }
        ],
        ischeck: 0,
        list: [{
                name: '连麦',
                time: '2020-08-08  14:52:32',
                long: '1小时10分钟',
                person: '叙利亚在逃小公主',
                much: -60.00
            },
            {
                name: '广告奖励',
                time: '2020-08-08  14:42:32',
                long: '',
                person: '',
                much: 1.00
            },
            {
                name: '礼物',
                time: '2020-08-08  14:38:32',
                long: '玫瑰花',
                person: '叙利亚在逃小公主',
                much: -50.00
            },
        ],
        arrlist: [],
        page: 1,
        userdata: null,
        arrlength: true,
        nodata: true,
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
            this.getuser();
            this.getdata();
        }
    },
      //获取用户信息 接口
      getuser() {
        let that = this,
            url = '/v1/user/get',
            params = {
                user_id: that.data.userdata.user_id
            };
        app.request.getdata(0, url, params, (res => {
            let my = res.data;
            if (my.status) {
                that.setData({
                    my_money: my.data.wallet.miudrive,
                });
            }
        }))
    },
    // 下拉触底加载更多
    onReachBottom() {
        this.setData({
            page: this.data.page + 1
        })
        this.getdata();
    },
    //获取我的喵币列表数据
    getdata() {
        wx.showLoading({
            title: '加载中',
        })
        let url = 'v1/wallet/muidrive/business',
            params = {
                source: 0,
                type: 2,
                relation_id: this.data.userdata.user_id,
                // relation_id: 5013583885235939,
                relation_type: 'user',
            };
        params.page = this.data.page;
        params.business_type = this.data.ischeck;
        app.request.getdata(3, url, params, (res => {
            let my = res.data;
            if (my.status) {
                if (my.data.total) {
                    this.setData({
                        arrlist: this.data.arrlist.concat(my.data.data),
                        arrlength: true,
                        nodata: true
                    })
                } else if (my.data.total == 0 && params.business_type > 0) {
                    this.setData({
                        nodata: false
                    })
                } else {
                    this.setData({
                        arrlength: false
                    })
                }
                wx.hideLoading();
            } else {
                wx.showToast({
                    title: my.info,
                    icon: 'none',
                    duration: 3000
                })
            }
        }))
    },
    //切换tab
    change_tab(val) {
        let indexs = val.currentTarget.dataset.index;
        this.setData({
            ischeck: indexs,
            page: 1,
            arrlist: []
        })
        this.getdata();
    }
})