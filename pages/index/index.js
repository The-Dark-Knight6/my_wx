//获取应用实例
const app = getApp();
const img = wx.getStorageSync("img");

Page({
  data: {
    navBarHeight: app.globalData.navBarHeight,
    menuRight: app.globalData.menuRight,
    menuBotton: app.globalData.menuBotton,
    menuHeight: app.globalData.menuHeight,
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 500,
    background: [],
    userInfo: "",
    hasUserInfo: false,
    getnums: false,
    blogo: img.blogo,
    ercode: img.ercode,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    device_id: null,
    blogo_url: ''
  },
  //轮播图 跳转
  go_page(val) {
    // console.log(val);
    let urls = val.currentTarget.dataset.url;
    wx.navigateTo({
      url: "../logs/logs",
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: urls
        })
      }
    });
  },
  //教程 跳转
  tothe_newpage(val) {
    // console.log(val);
    let urls = val.currentTarget.dataset.url;
    wx.navigateTo({
      url: "../brands/brands",
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: urls
        })
      }
    });
  },
  //修改登录状态（已登录后）
  change_login(dev) {
    let url = '/v1/user/sync',
      params = {};
    params.device_id = dev;
    params.auth_token = wx.getStorageSync('auth_token');
    app.request.postdata(0, url, params, (res => {
      let my = res.data;
      if (my.status) {
        wx.showToast({
          title: '登录成功！',
          icon: 'success',
          duration: 3000
        });
        wx.setStorageSync('out',false);
      } else {
        wx.showToast({
          title: my.info,
          icon: 'none',
          duration: 3000
        });
      }
    }))
  },
  //扫码 （已经登录后再次扫码）
  toscan() {
    let that = this,
      number = wx.getStorageSync('auth_token');
    //授权了
    if (number) {
      wx.scanCode({
        success(res) {
          let url = res.result.split('=')[1];
          // console.log(url)
          that.setData({
            device_id: url
          });
          // that.tologin(url);
          that.change_login(url);
          wx.setStorageSync('device_id', url);
        },
      });
    } else {
      //没有授权手机号
      this.setData({
        getnums: true
      });
      this.getTabBar().setData({
        show: false
      });
    }
  },
  onLoad: function (options) {
    let dev = wx.getStorageSync('device_id'),
      scene = decodeURIComponent(options.q),
      dev_id = scene.split('=')[1];
    if (dev) {
      this.setData({
        device_id: dev
      })
      wx.setStorageSync('device_id', dev);
    } else {
      wx.setStorageSync('device_id', dev_id);
    }
    //判断是否授权用户信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      this.getTabBar().setData({
        show: true
      });
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        this.getTabBar().setData({
          show: true
        });
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          this.getTabBar().setData({
            show: true
          });
        }
      })
    }
  },
  //后台登录
  tologin(dev) {
    wx.showLoading({
      title: '加载中',
    })
    let url = '/v1/user/login',
      phonedata = wx.getStorageSync('phonedata'),
      params = {
        login_type: 'mini_program',
        code: app.code.code,
        encryptedData: phonedata.encryptedData,
        iv: phonedata.iv,
        nick_name: this.data.userInfo.nickName,
        avatar_url: this.data.userInfo.avatarUrl,
        sex: this.data.userInfo.gender,
        device_id: dev
      };
    app.request.postdata(0, url, params, (res => {
      let my = res.data;
      if (my.status) {
        wx.hideLoading();
        wx.showToast({
          title: '登录成功！',
          icon: 'success',
          duration: 3000
        });
        this.setData({
          device_id: dev
        });
        wx.setStorageSync('out',false);
        // wx.setStorageSync('mobile', my.data.mobile);
        wx.setStorageSync('userdata', my.data);
        wx.setStorageSync('auth_token', my.data.auth_token);
        // app.globalData.userdata = my.data;
        // console.log(app.globalData.userdata)
      } else {
        wx.showToast({
          title: my.info,
          icon: 'none',
          duration: 3000
        });
        wx.setStorageSync('device_id', '');
        this.setData({
          device_id: null
        })
      }
    }));
  },
  //手机号码 拒绝授权的关闭按钮
  dont() {
    wx.removeStorageSync('phonedata');
    app.globalData.userInfo = null;
    this.setData({
      getnums: false
    });
    this.getTabBar().setData({
      show: true
    });
  },
  //授权获取手机号码
  getphone(e) {
    let that = this,
      device_id = wx.getStorageSync('device_id'),
      auth_token = wx.getStorageSync('auth_token');
    //同意授权手机号
    // console.log(e.detail)
    if (e.detail.iv) {
      // app.globalData.phonedata = e.detail;
      wx.setStorageSync('phonedata', e.detail);
      that.setData({
        getnums: false
      });
      that.getTabBar().setData({
        show: true
      });
      if (auth_token) {
        // that.change_login(device_id);
        wx.scanCode({
          success(res) {
            let url = res.result.split('=')[1];
            wx.setStorageSync('device_id', url);
            that.setData({
              device_id: url
            })
            that.change_login(url);
          }
        });
      } else if (device_id) {
        that.tologin(device_id);
      } else {
        wx.scanCode({
          success(res) {
            let url = res.result.split('=')[1];
            wx.setStorageSync('device_id', url);
            that.setData({
              device_id: url
            })
            that.tologin(url);
          }
        });
      }
    } else {
      //拒绝授权手机号
      // app.globalData.phonedata = {};
      app.globalData.userInfo = null;
      wx.removeStorageSync('phonedata');
      that.setData({
        getnums: false
      });
      that.getTabBar().setData({
        show: true
      });
    }
  },
  //获取个人信息（头像、昵称）
  getUserInfo(e) {
    let number = wx.getStorageSync('phonedata'),
      that = this;
    //同意授权个人信息 
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo;
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      });
      if (number) {
        wx.scanCode({
          success(res) {
            let url = res.result.split('=')[1];
            wx.setStorageSync('device_id', url);
            that.setData({
              device_id: url
            })
            that.tologin(url);
          }
        });
        this.getTabBar().setData({
          show: true
        });
      } else {
        this.setData({
          getnums: true
        });
        this.getTabBar().setData({
          show: false
        });
      }
    } else {
      //拒绝授权反馈
      this.setData({
        userInfo: '',
        hasUserInfo: false,
        getnums: false
      });
      this.getTabBar().setData({
        show: true
      });
    }
  },
  //获取顶部轮播图
  getbanner() {
    let url = '/v1/cms/ui_banner/get',
      that = this,
      params = {};
    app.request.getdata(4, url, params, (res => {
      let my = res.data;
      if (my.status) {
        let list = my.data.banner,
          help = my.data.help,
          arr = [];
        for (let i in list) {
          arr.push({
            pic_url: list[i].pic_url,
            content: list[i].content
          });
        }
        if (arr.length) {
          that.setData({
            background: arr
          })
        }
        that.setData({
          blogo: help.pic_url,
          blogo_url: help.content
        })
        // console.log(my.data.banner);
      } else {
        wx.showToast({
          title: my.info,
          icon: 'none',
          duration: 2000
        })
      }
    }))
  },
  onShow() {
    //如果登录则从缓存中取出设备id
    let auth_token = wx.getStorageSync('auth_token'),
      device_id = wx.getStorageSync('device_id');
    if (auth_token) {
      this.setData({
        device_id: device_id
      });
    }else{
      this.setData({
        device_id: null
      });
    }
    //自定义组件选中状态的改变
    this.getTabBar().setData({
      selected: 0
    });
    this.setData({
      userInfo: app.globalData.userInfo
    });
    this.getbanner();
  }
})