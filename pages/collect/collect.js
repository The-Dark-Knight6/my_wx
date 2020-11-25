let app = getApp();
let img = wx.getStorageSync("img");
let innerAudioContext = wx.createInnerAudioContext();

Page({
    data: {
        title: '我的收藏',
        miumoney: img.miumoney,
        girl: img.girl,
        boy: img.boy,
        g_play: img.g_play,
        gplayed: img.gplayed,
        collection: img.collection,
        arrdata: [],
        userdata: null,
        arrlength: true,
        clcikindex: '',
        onlynum: true,
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
        // })
    },
    //音频播放与暂停
    play_music(val) {
        let the_url = val.currentTarget.dataset.src,
            that = this,
            dur = '',
            indexs = val.currentTarget.dataset.index,
            status = this.data.clcikindex;;
        innerAudioContext.src = the_url;
        //当点击的文件id 与当前文件id相同时
        if (indexs == status) {
            innerAudioContext.pause();
            that.setData({
                clcikindex: '',
            });
        } else {
            innerAudioContext.play();
            that.setData({
                clcikindex: indexs,
            });
        }
        // 监听音频进入可以播放状态的事件
        innerAudioContext.onCanplay(() => {
            // 必须。可以当做是初始化时长
            innerAudioContext.duration;
            // 必须。不然也获取不到时长
            setTimeout(() => {
                dur = parseInt(innerAudioContext.duration * 1000) ;
                // console.log(dur)
            }, 1000);

        });
        setTimeout(() => {
            // console.log('asdf', dur)
            setTimeout(() => {
                that.setData({
                    clcikindex: '',
                });
                innerAudioContext.pause();
            }, dur)
        }, 1100);
    },
    //页面消失时
    onUnload(){
        innerAudioContext.stop();
        innerAudioContext.destroy();
    },
    //获取收藏列表数据
    getdata() {
        wx.showLoading({
            title: '加载中',
        })
        let url = '/v1/user/collection/get',
            params = {
                user_id: this.data.userdata.user_id,
                // user_id: 5013583885235939,
                relation_type: 'anchor',
            }
        app.request.getdata(0, url, params, (res => {
            let my = res.data;
            if (my.status) {
                wx.hideLoading();
                if (my.data.total) {
                    this.setData({
                        arrdata: my.data.data,
                        arrlength: true,
                        onlynum: true
                    })
                    if (my.data.total == 12) {
                        this.setData({
                            onlynum: false
                        })
                    }
                } else {
                    this.setData({
                        arrlength: false
                    })
                }
            } else {
                wx.showToast({
                    title: my.info,
                    duration: 3000
                })
            }
        }))
    },
})