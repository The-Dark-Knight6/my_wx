let app = getApp();

Component({
    data: {
        btuBottom :0,
        show: true,
        selected: 0,
        color: 'gray',
        selectedColor: "#3874ff",
        tab: [{
                "pagePath": "/pages/index/index",
                "text": "车载语聊",
                "iconPath": "/images/home.png",
                "selectedIconPath": "/images/homed.png"
            },
            {
                "pagePath": "/pages/myself/myself",
                "text": "我的",
                "iconPath": "/images/my.png",
                "selectedIconPath": "/images/myed.png"
            }
        ]
    },
    //判断是否为iphonex型号
    attached() {
        let isPhone = app.globalData.isIphoneX,that= this;
        if (isPhone) {
            that.setData({
                btuBottom: "68rpx",
            })
        }
    },
    methods: {
        switchTab(e) {
            const data = e.currentTarget.dataset
            const url = data.path
            //切换tab时，改变路由地址
            wx.switchTab({
                url: url
            })
        }
    }
})