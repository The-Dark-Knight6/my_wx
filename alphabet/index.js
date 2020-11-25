// component/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: ""
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    alpha: '',
    windowHeight: '',
    addBg: false,
    myindex: null,
    user_id: ''
  },
  ready: function () {
    let userdata = wx.getStorageSync('userdata');
    this.setData({
      user_id: userdata.user_id
    })
    try {
      var res = wx.getSystemInfoSync();
      //每一个字母所占的高度
      this.apHeight = res.windowHeight / 26;
      this.setData({
        windowHeight: res.windowHeight
      })
    } catch (e) {

    }
  },
  methods: {
    //调取后台接口 传入所选车型
    postcar(obj) {
      let url = '/v1/user/car/post',
        params = {};
      params = obj;
      params.user_id = this.data.user_id;
      wx.request({
        url: 'https://usertest.didi365.com' + url,
        data: params,
        method: 'POST',
        success(res) {
          let my = res.data;
          if (my.status) {
            setTimeout(() => {
              wx.navigateBack({});
            }, 500)
          } else {
            wx.showToast({
              title: my.info,
              duration: 2000
            })
          }
        }
      })
    },
    // 选择这个品牌车型
    getbrand(val) {
      let get = val.currentTarget.dataset,
        obj = {};
      obj.brand_id = get.brand.brandid;
      obj.brand_name = get.brand.name;
      obj.brand_tag_name = get.tag;
      obj.brand_logo = get.brand.avater;
      obj.model_id = get.model.modelid;
      obj.model_name = get.model.modelname;
      obj.model_logo = get.model.image;
      this.postcar(obj);
    },
    //点击触碰 展开折叠
    tapindex(val) {
      let index = val.currentTarget.dataset.index,
        that = this;
      if (index != that.data.myindex) {
        that.setData({
          myindex: index
        })
      } else {
        that.setData({
          myindex: null
        })
      }
      // console.log(val)
    },
    //点击
    handlerAlphaTap(e) {
      let {
        ap
      } = e.target.dataset;
      this.setData({
        alpha: ap
      });
    },
    //滑动
    handlerMove(e) {
      let {
        list
      } = this.data;
      this.setData({
        addBg: true
      });
      let rY = e.touches[0].clientY; //竖向滑动的距离
      if (rY >= 0) {
        let index = Math.ceil((rY - this.apHeight) / this.apHeight);
        if (0 <= index < list.length) {
          let nonwAp = list[index];
          nonwAp && this.setData({
            alpha: nonwAp.alphabet
          });
        }
      }
    },
    //滑动结束
    handlerEnd(e) {
      this.setData({
        addBg: false
      });
    }
  }
})