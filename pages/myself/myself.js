let app = getApp();

const img = wx.getStorageSync("img");

Page({
    data: {
        hostimg: img.weixin,
        userInfo: '',
        nickName: '',
        navBarHeight: app.globalData.navBarHeight,
        menuRight: app.globalData.menuRight,
        menuBotton: app.globalData.menuBotton,
        menuHeight: app.globalData.menuHeight,
        miumoney: img.miumoney,
        rights: img.rights,
        actlist: [{
                url: img.miumoney,
                name: '我的喵币'
            },
            {
                url: img.collet,
                name: '我的收藏'
            },
            {
                url: img.history,
                name: '历史连麦'
            }
        ],
        my_money: '0.00', //我的喵币
        userdata: null,
        out:''
    },
    onShow() {
        let data = wx.getStorageSync('userdata'),
            out = wx.getStorageSync('out'),
            that = this;
        // 授权扫码之后 和之前
        if (data && !out) {
            that.setData({
                userInfo: app.globalData.userInfo,
                // my_money: data.wallet.miudrive,
                userdata: data
            })
            that.getuser();
        } else if (app.globalData.userInfo) {
            that.setData({
                userInfo: app.globalData.userInfo,
                nickName: app.globalData.userInfo.nickName,
                out:out
            })
        }
        that.getTabBar().setData({
            selected: 1
        })
        console.log(app.globalData.userInfo)
    },
    //下拉刷新
    onPullDownRefresh: function () {
        wx.showLoading({
            title: '加载中',
        })
        // 未扫码登录直接返回
        if(!this.data.userdata){
            wx.hideLoading();
            wx.stopPullDownRefresh();
            return ;
        }
        let that = this,
            url = '/v1/user/get',
            params = {
                user_id: that.data.userdata.user_id
            };
        app.request.getdata(0, url, params, (res => {
            let my = res.data;
            if (my.status) {
                that.setData({
                    nickName: my.data.detail.nick_name,
                    my_money: my.data.wallet.miudrive,
                });
                wx.hideLoading();
                wx.stopPullDownRefresh();
            }
        }))
        // Do something when pull down.
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
                    nickName: my.data.detail.nick_name,
                    my_money: my.data.wallet.miudrive,
                });
            }
        }))
    },
    //获取个人信息（头像、昵称）wx api调取 用户授权
    getUserInfo(e) {
        console.log(e)
        //同意授权个
        if (e.detail.userInfo) {
            this.setData({
                userInfo: e.detail.userInfo,
                nickName: e.detail.userInfo.nickName
            });
            app.globalData.userInfo = e.detail.userInfo;
        } else {
            //拒绝授权
            this.setData({
                userInfo: '',
            });
        }
    },
    //用户资料
    userinfos() {
        wx.navigateTo({
            url: "../people/people"
        });
    },
    //跳转不同页面
    topage(val) {
        let indexs = val.currentTarget.dataset.index;
        switch (indexs) {
            case 1:
                wx.navigateTo({
                    url: "../collect/collect"
                });
                break;
            case 2:
                wx.navigateTo({
                    url: "../historys/historys"
                });
                break;
            default:
                wx.navigateTo({
                    url: "../wallet/wallet"
                });
        }
    }
})