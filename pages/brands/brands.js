let app = getApp();
const img = wx.getStorageSync("img");

Page({
    data: {
        title: '品牌',
        thestatus: -1,
        miumoney: img.miumoney,
        the_page:'',
        arr: [{
                name: '热',
                brand: '本田',
                car: [
                    "A", "B", "C", "D"
                ]
            },
            {
                name: 'A',
                brand: '保时捷',
                car: [
                    "E300", "132132B", "23C", "扫码懂啊"
                ]
            },
            {
                name: 'B',
                brand: '长安',
                car: [
                    "E300", "132132B", "23C", "扫码懂啊"
                ]
            }
        ]
    },
    onLoad() {
        let eventChannel = this.getOpenerEventChannel(),
        that = this;
        //通知上一页，传回参数，响应函数
        //改变上一页监听的数据时调用
        // eventChannel.emit('acceptDataFromOpenedPage', {
        //     data: 'test'
        // });
        // eventChannel.emit('someEvent', {
        //     data: 'test'
        // });
        // 监听acceptData事件，获取上一页面通过eventChannel传送到当前页面的数据
        eventChannel.on('acceptDataFromOpenerPage', function (data) {
            // console.log(data)
            that.setData({
                the_page:data.data
            })
        })

    },
    //打开折叠
    openitem(val) {
        let the = val.currentTarget.dataset;
        this.setData({
            thestatus: the.index
        })
    }
})