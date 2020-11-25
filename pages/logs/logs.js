//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: [],
    the_page:''
  },
  onLoad: function () {
    let eventChannel = this.getOpenerEventChannel(),
      that = this;
    // 监听acceptData事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      // console.log(data)
      that.setData({
        the_page: data.data
      })
    });
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }
})