let app = getApp();
const img = wx.getStorageSync("img");

Page({
    data: {
        title: '我的资料',
        userInfo: app.globalData.userInfo,
        miumoney: img.miumoney,
        rights: img.rights,
        g_play: img.g_play,
        collection: img.collection,
        closebut: img.closebut,
        checked: true,
        list: [{
                name: '头像',
                url: img.miumoney
            },
            {
                name: '昵称',
                text: '奔波儿灞'
            },
            {
                name: '性别',
                text: '男'
            },
            {
                name: '我的汽车',
                text: '去设置'
            },
            {
                name: '手机号码',
                text: '123123132'
            }
        ],
        the_sex: '请设置',
        the_nickname: '请设置',
        thedia: false,
        theclose: true,
        the_phone: '请设置',
        the_car: '请设置',
        brand_logo: null,
        userdata: null,
        input_value: ''
    },
    onShow() {
        let userdata = wx.getStorageSync('userdata'),
        out = wx.getStorageSync('out');
        if (userdata && !out) {
            this.setData({
                userInfo: app.globalData.userInfo,
                userdata: userdata
            });
            this.getuser();
        } else {
            this.setData({
                userInfo: app.globalData.userInfo,
                the_nickname: app.globalData.userInfo.nickName
            });
            wx.showToast({
                title: '请扫码登录车载设备!',
                icon: 'none',
                duration: 3000
            })
        }
    },
    //获取用户信息
    getuser() {
        wx.showLoading({
            title: '加载中',
        })
        let that = this;
        let url = '/v1/user/get',
            params = {
                user_id: that.data.userdata.user_id
            };
        app.request.getdata(0, url, params, (res => {
            let my = res.data;
            if (my.status) {
                // console.log(my.data);
                that.setData({
                    the_nickname: my.data.detail.nick_name,
                    the_phone: my.data.mobile,
                    the_sex: that.getsex(my.data.detail.sex)
                });
                // wx.setStorageSync('mobolie',my.data.mobile);
                if(my.data.car){
                    that.setData({
                        brand_logo: 'https://srctest.didi365.com/didi365' + my.data.car.brand_logo,
                        the_car: my.data.car.brand_name + ' ' + my.data.car.model_name
                    });
                }
                wx.hideLoading();
            } else {
                wx.showToast({
                    title: my.info,
                    icon: 'none',
                    duration: 2000
                })
            }
        }))
    },
    //更改用户信息
    changeinfo(item, val) {
        let url = '/v1/user/post',
            params = {
                user_id: this.data.userdata.user_id,
                device_id : wx.getStorageSync('device_id')
                // user_id: 5013583885235939,
            };
        params[item] = val;
        app.request.postdata(0, url, params, (res => {
            let my = res.data;
            if (my.status) {
                this.getuser();
            } else {
                wx.showToast({
                    title: my.info,
                    icon: 'success',
                    duration: 2000
                })
            }
        }))
    },
    //昵称 清除所输入的
    clearall() {
        this.setData({
            input_value: ''
        })
    },
    //昵称 失焦
    input_blur() {
        this.setData({
            theclose: true
        })
    },
    //昵称 聚焦
    input_focus() {
        this.setData({
            theclose: false
        })
    },
    //性别判断
    getsex(val) {
        switch (val) {
            case 1:
                return '男';
                break;
            case 2:
                return '女';
                break;
            default:
                return '未知';
        }
    },
    //退出登录调取后台接口
    user_out() {
        let url = '/v1/user/logout',
            dev = wx.getStorageSync('device_id'),
            params = {};
        params.device_id = dev;
        params.type = 'mini_program';
        app.request.postdata(0, url, params, (res => {
            let my = res.data;
            if (my.status) {
                wx.showToast({
                    title: '已退出',
                    icon: 'none',
                    duration: 3000
                });
            } else {
                wx.showToast({
                    title: my.info,
                    icon: 'none',
                    duration: 3000
                });
            }
        }))
    },
    //登出
    getout() {
        this.user_out();
        app.globalData.userInfo = null;
        app.globalData.mobile = null;
        // 秦清楚用户信息、设备信息、手机授权暂存信息、手机号码
        // wx.removeStorageSync('userdata');
        wx.removeStorageSync('device_id');
        wx.removeStorageSync('phonedata');
        wx.setStorageSync('out',true);
        wx.removeStorageSync('mobile');
        wx.reLaunch({
            url: "../myself/myself"
        })
        // this.getTabBar().setData({
        //     selected: 1
        // });
    },
    //选择汽车
    tocar() {
        let userdata = this.data.userdata;
        if (userdata) {
            wx.navigateTo({
                url: "../scroll/scroll"
            });
        } else {
            wx.showToast({
                title: '请扫码登录车载设备!',
                icon: 'none',
                duration: 2000
            })
        }
    },
    //手机号码 未扫码的提示
    myphone() {
        let userdata = this.data.userdata;
        if (!userdata) {
            wx.showToast({
                title: '请扫码登录车载设备!',
                icon: 'none',
                duration: 2000
            })
        }
    },
    //点击蒙层处隐藏
    thetap(val) {
        let tar = val.target.dataset.id;
        if (tar == 'the') {
            this.setData({
                thedia: false
            })
        }
    },
    //取消（昵称填写）
    tocancel() {
        this.setData({
            thedia: false
        })
    },
    //input输入框
    theinput(e) {
        this.setData({
            input_value: e.detail.value
        })
    },
    // 确定（昵称填写）
    tosure() {
        let that = this;
        if (that.data.input_value.trim()) {
            that.changeinfo("nick_name", that.data.input_value);
            that.setData({
                thedia: false
            });
        } else {
            wx.showToast({
                title: '昵称不能为空!',
                icon: 'none',
                duration: 2000
            })
        }
    },
    //性别选择
    popSelect() {
        let that = this,
            userdata = this.data.userdata;
        if (userdata) {
            wx.showActionSheet({
                itemList: ['男', '女'],
                success: function (res) {
                    that.changeinfo("sex", res.tapIndex + 1);
                }
            })
        } else {
            wx.showToast({
                title: '请扫码登录车载设备!',
                icon: 'none',
                duration: 2000
            })
        }
    },
    //昵称设置
    nickname() {
        let that = this,
            userdata = this.data.userdata;
        if (userdata) {
            that.setData({
                thedia: true,
                input_value: that.data.the_nickname
            })
        } else {
            wx.showToast({
                title: '请扫码登录车载设备!',
                icon: 'none',
                duration: 2000
            })
        }
    },
})