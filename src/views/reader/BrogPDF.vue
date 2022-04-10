<template>
  <div class="pdf-touch-box" @mouseup="onSelect">
    <div
        v-show="!loading"
        class="pdf-canvas-wrap"
        :style="{
        top: viewTop + 'px',
        left: viewLeft + 'px',
        width: viewWidth + 'px',
        height: viewHeight + 'px'
      }"
    ></div>
    <p class="pdf-canvas-tips" v-show="loading">正在加载...</p>
  </div>
</template>

<script>
import * as PDFJS from 'pdfjs-dist/legacy/build/pdf'

import { TextLayerBuilder, EventBus } from 'pdfjs-dist/legacy/web/pdf_viewer'
import 'pdfjs-dist/legacy/web/pdf_viewer.css'

// 本地
// window.pdfjsWorker = require("pdfjs-dist/build/pdf.worker.js");

// cdn 2.8.335  2.6.347 2.5.207
PDFJS.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/legacy/build/pdf.worker.entry')

// https://github.com/mozilla/pdf.js/blob/master/examples/node/getinfo.js
// Requires single file built version of PDF.js -- please run
// `gulp singlefile` before running the example.
// const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

const CSS_UNITS = 96.0 / 72.0
// const PRINT_UNITS = 150 / 72.0;

let userAgent = (typeof navigator !== 'undefined' && navigator.userAgent) || ''
let platform = (typeof navigator !== 'undefined' && navigator.platform) || ''
let maxTouchPoints = (typeof navigator !== 'undefined' && navigator.maxTouchPoints) || 1

let maxCanvasPixels = 16777216
// PDF之外占据的宽度 -18 padding -18减去滚动条宽度（不确定）
let autoWidth = 36
let textLayerTop = 3
let scaleInterval = 0.05

let isAndroid = /Android/.test(userAgent)
let isIOS = /\b(iPad|iPhone|iPod)(?=;)/.test(userAgent) || (platform === 'MacIntel' && maxTouchPoints > 1)
;(function checkCanvasSizeLimitation() {
  if (isIOS || isAndroid) {
    maxCanvasPixels = 5242880
    autoWidth -= 18
    textLayerTop -= 1
    // 手机上面缩放对清晰度影响更小
    scaleInterval = 0.4
  }
})()
import AlloyFinger from 'alloyfinger'
import {readonly, ref} from "vue";
import {ElMessage} from 'element-plus';
//包装一下 不然 eslint 报警告
class FingerTouch {
  constructor(element, options) {
    Object.assign(this, AlloyFinger.prototype)
    AlloyFinger.call(this, element, options)
  }
}
let pdfDoc;
export default {
  inject: ['bus', 'axios'],
  props: ['type'],
  data() {
    return {
      src: '',
      loading: true,
      pdfDoc: null,
      boxEl: null,
      wrapEl: null,
      areaWidth: 0,
      btnWidth: 0,
      viewWidth: 0,
      viewHeight: 0,
      pixelRatio: 2,
      isFirstTimeRender: true,
      viewport: null,
      canvasEles: [],
      canvasCtxs: [],
      totallPage: 0,
      pageScale: 1, // pdf 适应窗口产生的 scale
      curCanvasCSSWh: null,
      transform: null,
      pageRenderedNum: 0,
      scaleTimer: null,
      lastStyleScale: 1,
      lastRerenderScale: 1,
      alloyFinger: null,
      viewTop: 0,
      viewLeft: 9,
      textEls: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    onSelect(e) {
      if (!this.bus.isWatching || e.path[0].localName !== "span" || e.path[1].className !== "textLayer") {
        return
      }
      const selectedText = window.getSelection().toString();
      if (selectedText.length === 0) {
        return;
      }
      for (let i = 0; i < 4; i++) {
        const id = e.path[i].id;
        if (id.indexOf("page-") >= 0) {
          this.bus.selectedText = readonly(ref(selectedText));
        }
      }
    },
    async getReaderPDF(){
      let status = await this.getPDFPath();
      console.log(status);
    },
    getPDFPath(){
      this.axios.withCredentials = true;
      if(this.bus.main_pdf != undefined){
        let that = this;
        return new Promise((resolve, reject) => {
          this.axios.get('/file/get_file_path', {
            params: {
              bid: this.bus.main_pdf
            }
          }).then((res) => {
            let res_body = res.data;
            if (res_body.status === 'success') {
              that.src = 'http://' + res_body.file_obj.file_path;
              resolve(true);
            } else {
              console.log(res_body);
              resolve(false);
              ElMessage.error('获取书籍路径错误！');
            }
          }).catch((error) => {
            console.log(error);
            reject(error);
          })
        })
      }
    },
    async init() {
      await this.getReaderPDF();
      //禁止下拉刷新
      document.addEventListener(
          'touchmove',
          function (ev) {
            ev.preventDefault()
          },
          {passive: false}
      )
      this.boxEl = document.querySelector('.pdf-touch-box')
      this.wrapEl = document.getElementsByClassName('pdf-canvas-wrap')[0]
      this.btnWidth = this.areaWidth = this.boxEl.clientWidth

      const loadingState = await this.getPDF()
      if (loadingState === 'success') {
        this.initRenderOneByOne()
        this.initTouch()
      } else this.boxEl.innerText = loadingState
    },
    initTouch() {
      this.alloyFinger = new FingerTouch(this.wrapEl, {})
      this.alloyFinger.on('pinch', e => {
        let zoom = e.zoom
        let curScale = this.lastStyleScale * zoom
        if (curScale <= this.pageScale / 2 || curScale >= 5) return
        this.scaleEvent(curScale)
      })

      this.alloyFinger.on('pressMove', e => {
        this.viewTop += e.deltaY
        this.viewLeft += e.deltaX
      })
    },
    scaleEvent(scale) {
      // 渲染中 不让缩放 也不让重绘
      if (this.pageRenderedNum != this.totallPage || this.totallPage === 0) return

      // 没在渲染中 随意缩放
      this.scaleCanvas(scale)

      // 说明是第一次事件 或重绘完成 开始计时
      if (this.scaleTimer === null) {
        this.scaleTimer = this.renderDelayer(666)
      }
      //时间间隔内再次触发缩放 重新计时
      clearTimeout(this.scaleTimer)
      this.scaleTimer = this.renderDelayer(666)
    },
    renderDelayer(interval) {
      return setTimeout(() => {
        this.scaleRenderAll()
        this.scaleTimer = null
      }, interval)
    },
    scaleTopLeft(width, height) {
      if (Math.abs(this.viewTop) > height / 2) this.viewTop *= 1 / 2
      if (Math.abs(this.viewLeft) > width / 2) this.viewLeft *= 1 / 2
    },
    scaleCanvas(scale) {
      this.lastStyleScale = scale
      // 改变 viewport 大小
      this.viewport = this.viewport.clone({
        scale: (this.pageScale * CSS_UNITS * scale).toFixed(3)
      })

      const { styleWidth, styleHeight } = this.getCanvasCSSWH()

      // 计算一下 top left 不然可能会显示到 窗口外面 看不到了
      this.scaleTopLeft(styleWidth, styleHeight)

      // 改变CSS canvas 会变模糊
      this.canvasEles.forEach(canvas => {
        // 不修改 width height 不然会重置 canvas 变空白
        canvas.style.width = styleWidth + 'px'
        canvas.style.height = styleHeight + 'px'
      })
    },
    // 使用新渲染的 canvas  替换 缩放过后不清晰的 canvas
    scaleRenderAll() {
      let curInterval = Math.abs(this.lastStyleScale - this.lastRerenderScale)
      let curScaleInterval = scaleInterval
      let isNarrow = this.lastStyleScale < this.lastRerenderScale
      // 如果是变小 变化不大时 清晰度影响更小
      if (isNarrow) curScaleInterval = scaleInterval * 2

      // 变化很小的时候就不计时重新渲染了 清晰度影响不大 1.1 - 1 = 0.10000000000000009
      if (curInterval <= curScaleInterval) return

      this.lastRerenderScale = this.lastStyleScale

      this.pageRenderedNum = 0
      const len = this.canvasEles.length
      for (let pageNum = 1; pageNum <= len; pageNum++) {
        let newCanvas = document.createElement('canvas')
        let newCtx = newCanvas.getContext('2d', {
          alpha: false
        })
        newCanvas.setAttribute('id', `pdf-canvas${pageNum}`)

        this.canvasCtxs[pageNum - 1] = newCtx

        let that = this
        pdfDoc.getPage(pageNum).then(function (page) {
          that.setCanvasCSSWh.call(that, newCanvas)

          let renderTask = that.pageRender.call(that, page, newCtx)

          renderTask.promise
              .then(function () {
                let oldCanvas = that.canvasEles[pageNum - 1]
                oldCanvas.parentElement.replaceChild(newCanvas, oldCanvas)
                that.canvasEles[pageNum - 1] = newCanvas
                that.pageRenderedNum++

                return page.getTextContent()
              })
              .then(textContent => that.textRerender.call(that, pageNum, textContent))
              .catch(e => console.log(e))
        })
      }
    },

    getPDF() {
      let that = this
      return new Promise(resolve => {
        PDFJS.getDocument(that.src).promise.then(
            function (pdfDoc_) {
              pdfDoc = pdfDoc_
              that.totallPage = 30;
              that.loading = false
              resolve('success')
            },
            function (reason) {
              console.log(reason.message)
              that.loading = false
              resolve(reason.name)
            }
        )
      })
    },

    initRenderOneByOne() {
      for (let pageNum = 1; pageNum <= this.totallPage; pageNum++) {
        let canvas = document.createElement('canvas')
        canvas.setAttribute('id', `pdf-canvas${pageNum}`)
        canvas.setAttribute('class', `pdfcanvas`)
        // alpha 设定 canvas 背景总是不透明，可以加快浏览器绘制透明的内容和图片 初始化出来 canvas 为黑色背景
        // 实际上 导致 重新渲染的时候 闪黑屏
        // let ctx = canvas.getContext("2d", {
        //   alpha: false,
        // });
        let ctx = canvas.getContext('2d')
        this.canvasCtxs.push(ctx)
        this.canvasEles.push(canvas)
        //  this.wrapEl.appendChild(canvas);

        let pageDiv = document.createElement('div')
        pageDiv.setAttribute('id', 'page-' + pageNum)
        pageDiv.setAttribute('style', 'position: relative;')
        this.wrapEl.appendChild(pageDiv)
        pageDiv.appendChild(canvas)
      }
      this.renderSinglePage(this.canvasEles[0], 1)
    },

    renderSinglePage(canvas, pageNum) {
      let ctx = this.canvasCtxs[pageNum - 1]
      let that = this
      pdfDoc.getPage(pageNum).then(function (page) {
        if (that.isFirstTimeRender) that.initView(page, ctx)

        //if (pageNum === 1) that.getCanvasCSSWH()
        that.getCanvasCSSWH()

        that.setCanvasCSSWh.call(that, canvas)
        let renderTask = that.pageRender.call(that, page, ctx)

        renderTask.promise
            .then(function () {
              if (that.totallPage > pageNum) {
                that.renderSinglePage(that.canvasEles[pageNum], pageNum + 1)
              }
              that.pageRenderedNum++
              return page.getTextContent()
            })
            .then(textContent => that.textRender.call(that, canvas, pageNum, textContent))
      })
    },
    textRerender(pageIndex, textContent) {
      const oldDiv = this.textEls[pageIndex - 1]

      const newDiv = document.createElement('div')
      newDiv.setAttribute('class', 'textLayer')
      newDiv.setAttribute('style', `top: ${textLayerTop}px`)

      oldDiv.parentElement.replaceChild(newDiv, oldDiv)
      this.textEls[pageIndex - 1] = newDiv
      this.renderTextLayer(newDiv, pageIndex, textContent)
    },
    textRender(canvas, pageIndex, textContent) {
      const textLayerDiv = document.createElement('div')
      textLayerDiv.setAttribute('class', 'textLayer')
      textLayerDiv.setAttribute('style', `top: ${textLayerTop}px`)
      canvas.parentElement.appendChild(textLayerDiv)
      this.textEls[pageIndex - 1] = textLayerDiv
      this.renderTextLayer(textLayerDiv, pageIndex, textContent)
    },
    renderTextLayer(el, index, content) {
      var textLayer = new TextLayerBuilder({
        eventBus: new EventBus(),
        textLayerDiv: el,
        pageIndex: index,
        viewport: this.viewport
      })

      textLayer.setTextContent(content)
      textLayer.render()
    },
    setCanvasCSSWh(canvas) {
      canvas.width = this.curCanvasCSSWh.width
      canvas.height = this.curCanvasCSSWh.height
      canvas.style.width = this.curCanvasCSSWh.styleWidth + 'px'
      canvas.style.height = this.curCanvasCSSWh.styleHeight + 'px'
      canvas.style['border'] = '#d6d6d6 solid 1px'
      canvas.style.margin = '0 0 9px 0'
    },
    pageRender(page, ctx) {
      return page.render({
        canvasContext: ctx,
        transform: this.transform,
        viewport: this.viewport,
        enableWebGL: false,
      })
    },

    drawBorder(canvas, ctx) {
      ctx.save()
      ctx.fillStyle = 'rgb(255, 255, 255)'
      ctx.strokeRect(0, 0, canvas.width, canvas.height)
      ctx.restore()
    },
    getCanvasCSSWH() {
      let outputScale = {
        sx: this.pixelRatio,
        sy: this.pixelRatio,
        scaled: this.pixelRatio !== 1
      }

      let pixelsInViewport = this.viewport.width * this.viewport.height
      let maxScale = Math.sqrt(maxCanvasPixels / pixelsInViewport)

      if (outputScale.sx > maxScale || outputScale.sy > maxScale) {
        // 这里触发会出错
        // outputScale.sx = maxScale;
        // outputScale.sy = maxScale;
        // outputScale.scaled = true;
      }

      let sfx = (0, this.approximateFraction)(outputScale.sx)
      let sfy = (0, this.approximateFraction)(outputScale.sy)
      const width = (0, this.roundToDivide)(this.viewport.width * outputScale.sx, sfx[0])
      const height = (0, this.roundToDivide)(this.viewport.height * outputScale.sy, sfy[0])
      const styleWidth = (0, this.roundToDivide)(this.viewport.width, sfx[1])
      const styleHeight = (0, this.roundToDivide)(this.viewport.height, sfy[1])

      if (this.pixelRatio !== 1) this.transform = [this.pixelRatio, 0, 0, this.pixelRatio, 0, 0]

      this.viewWidth = styleWidth + 2
      // 12 加上 canvas border margin 误差？2 + 9 + 1
      this.viewHeight = this.totallPage * (this.viewport.height + 12) + 9

      this.curCanvasCSSWh = { width, height, styleWidth, styleHeight }
      return this.curCanvasCSSWh
    },
    approximateFraction(x) {
      if (Math.floor(x) === x) {
        return [x, 1]
      }

      var xinv = 1 / x
      var limit = 8

      if (xinv > limit) {
        return [1, limit]
      } else if (Math.floor(xinv) === xinv) {
        return [1, xinv]
      }

      var x_ = x > 1 ? xinv : x
      var a = 0,
          b = 1,
          c = 1,
          d = 1
      // eslint-disable-next-line
      while (true) {
        var p = a + c,
            q = b + d

        if (q > limit) {
          break
        }

        if (x_ <= p / q) {
          c = p
          d = q
        } else {
          a = p
          b = q
        }
      }

      var result

      if (x_ - a / b < c / d - x_) {
        result = x_ === x ? [a, b] : [b, a]
      } else {
        result = x_ === x ? [c, d] : [d, c]
      }

      return result
    },
    roundToDivide(x, div) {
      var r = x % div
      return r === 0 ? x : Math.round(x - r + div)
    },

    initView(page, ctx) {
      let devicePixelRatio = window.devicePixelRatio || 1
      let backingStoreRatio =
          ctx.webkitBackingStorePixelRatio ||
          ctx.mozBackingStorePixelRatio ||
          ctx.msBackingStorePixelRatio ||
          ctx.oBackingStorePixelRatio ||
          ctx.backingStorePixelRatio ||
          1
      this.pixelRatio = devicePixelRatio / backingStoreRatio

      this.viewport = page.getViewport({
        scale: CSS_UNITS
      })

      this.pageScale = (this.areaWidth - autoWidth) / this.viewport.width
      let curViewport = page.getViewport({
        scale: this.pageScale * CSS_UNITS
      })
      this.viewport = curViewport

      this.isFirstTimeRender = false
    }
  }
}
</script>

<style scoped>
.pdf-touch-box {
  padding: 9px;
  width: calc(100% - 18px);
  height: calc(100% - 18px);
  position: relative;
}
.scale-btn-box {
  position: fixed;
  top: 0;
  left: 0;
  height: 44px;
  display: flex;
  justify-content: space-around;
  z-index: 99;
}
.scale-btn-box::after {
  content: '';
  width: 100%;
  height: 100%;
  position: absolute;
  background: #fff;
  top: 0;
  left: 0;
  filter: blur(18px);
  opacity: 0.8;
}
.scale-btn {
  position: relative;
  z-index: 2;
  width: 25%;
  height: 100%;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}
.pdf-canvas-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  margin-top: 44px;
  padding-top: 9px;
  position: absolute;
}
.pdf-canvas-tips {
  margin-top: 44px;
}
</style>
