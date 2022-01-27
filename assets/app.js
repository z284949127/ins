
    axios.defaults.adapter = xhrAdapter
    axios.defaults.timeout = appConfig.axiosTimeOut
    unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest
    unsafeWindow.apis = apis
    unsafeWindow.appConfig = appConfig
    unsafeWindow.axios = axios
    unsafeWindow.sha1 = sha1
    unsafeWindow.Vue = Vue
    unsafeWindow.VueRouter = VueRouter
    let appMain = document.createElement('div')
    unsafeWindow.appMain = appMain
    let appPos = {w: 400, h: 800}
    unsafeWindow.appPos = appPos
    appMain.onmousemove = e => e.target.style.cursor = e.offsetX < 5 ? 'col-resize' : 'auto'
    appMain.setAttribute('id', 'app-main')
    appMain.style.setProperty('border', '1px solid black')
    appMain.style.setProperty('width', '500px')
    appMain.style.setProperty('min-height', '800px')
    appMain.style.setProperty('position', 'absolute')
    appMain.style.setProperty('top', '10px')
    appMain.style.setProperty('right', '10px')
    appMain.style.setProperty('background', 'rgba(255, 255, 255, 0.8)')
    appMain.onmousedown = (e) => {
        let startX = e.clientX
        let offsetX = e.offsetX
        if (offsetX > 5) {
            return
        }
        let startWidth = appMain.clientWidth
        document.onmousemove = function (e) {
            appMain.style.setProperty('width', (startWidth + startX - e.clientX) + 'px')
        }
        document.onmouseup = function (evt) {
            evt.stopPropagation()
            document.onmousemove = document.onmouseup = null
            appMain.releaseCapture && appMain.releaseCapture()
        }
        appMain.setCapture && appMain.setCapture()
        return false
    }
    document.body.appendChild(appMain)
    let appMsg = document.createElement('div')
    unsafeWindow.appMsg = appMsg
    appMsg.setAttribute('id', 'app-message')
    appMain.appendChild(appMsg)
    let appBody = document.createElement('div')
    unsafeWindow.appBody = appBody
    appBody.setAttribute('id', 'app-body')
    appMain.appendChild(appBody)
    let cloneApis = JSON.parse(JSON.stringify(apis));
    let api = build(cloneApis);
    unsafeWindow.api = api;
    const router = VueRouter.createRouter({history: VueRouter.createWebHashHistory(), routes,});
    const app = Vue.createApp(App);
    app.config.globalProperties.$api = api;
    app.use(router);
    app.mount(appBody)
    const {createApp, h} = Vue;
    const message = props => {
        const container = document.createElement("div");
        const vm = createApp({
            render() {
                return h(Message, props);
            },
        });
        const appMessage = appMsg;
        appMessage.appendChild(vm.mount(container).$el);
        let {duration = 3} = props;
        setTimeout(() => vm.unmount(), duration * 1000);
        return {
            close: () => vm.component.proxy.isShow = false,
        };
    };
    app.config.globalProperties.$message = message;
