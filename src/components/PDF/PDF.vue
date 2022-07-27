<template>
  <div :class="`pdf-touch-box`">
    <div
        v-show="!loading"
        :class="`pdf-canvas-wrap`"
        :style="{
          width: viewWidth + 'px',
          height: viewHeight + 'px'
      }"
    ></div>
    <p v-show="loading" :class="`pdf-canvas-tips`">正在加载...</p>
  </div>
</template>

<script>
import * as PDFJS from 'pdfjs-dist/legacy/build/pdf'

import {EventBus, TextLayerBuilder} from 'pdfjs-dist/legacy/web/pdf_viewer'
import 'pdfjs-dist/legacy/web/pdf_viewer.css'

// 本地
window.pdfjsWorker = require("pdfjs-dist/build/pdf.worker.js");

const CSS_UNITS = 96.0 / 72.0
// const PRINT_UNITS = 150 / 72.0;

let maxCanvasPixels = 16777216

// PDF之外占据的宽度
let autoWidth = 0

let pdfDoc;
export default {
  props: ['type', 'src'],
  data() {
    return {
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
      totalPage: 0,
      renderedPage: 0,
      pageScale: 1, // pdf 适应窗口产生的 scale
      curCanvasCSSWh: null,
      transform: null,
      pageRenderedNum: 0,
      scaleTimer: null,
      lastStyleScale: 1,
      lastRerenderScale: 1,
      alloyFinger: null,
      textEls: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      //禁止下拉刷新
      this.$el.addEventListener(
          'touchmove',
          function (ev) {
            ev.preventDefault()
          },
          {passive: false}
      )
      this.boxEl = this.$el
      this.wrapEl = this.$el.getElementsByClassName(`pdf-canvas-wrap`)[0]
      this.btnWidth = this.areaWidth = this.boxEl.clientWidth

      const loadingState = await this.getPDF()
      if (loadingState === 'success') {
        this.initRenderOneByOne()
        //this.initTouch()
      } else this.boxEl.innerText = loadingState
    },

    getPDF() {
      return new Promise(resolve => {
        PDFJS.getDocument(this.src).promise.then(
            pdfDoc_ => {
              pdfDoc = pdfDoc_
              this.totalPage = Math.min(5, pdfDoc.numPages)
              this.loading = false
              resolve('success')
            },
            reason => {
              console.log(reason.message)
              this.loading = false
              resolve(reason.name)
            }
        )
      })
    },

    initRenderOneByOne() {
      for (let pageNum = 1; pageNum <= this.totalPage; pageNum++) {
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

        let pageDiv = document.createElement('div')
        pageDiv.setAttribute('id', `page-${pageNum}`)
        pageDiv.setAttribute('style', 'position: relative;')
        this.wrapEl.appendChild(pageDiv)
        pageDiv.appendChild(canvas)
        this.renderSinglePage(this.canvasEles[pageNum - 1], pageNum)
      }
    },

    renderSinglePage(canvas, pageNum) {
      let ctx = this.canvasCtxs[pageNum - 1]
      pdfDoc.getPage(pageNum).then(async page => {
        if (this.isFirstTimeRender) this.initView(page, ctx)
        this.renderedPage++;
        this.getCanvasCSSWH()
        this.setCanvasCSSWh.call(this, canvas)
        this.pageRender.call(this, page, ctx)
        this.textRender.call(this, canvas, pageNum, await page.getTextContent())
      })
    },
    textRender(canvas, pageIndex, textContent) {
      const textLayerDiv = document.createElement('div')
      textLayerDiv.setAttribute('class', 'textLayer')
      //textLayerDiv.setAttribute('style', `top: ${textLayerTop}px`)
      canvas.parentElement.appendChild(textLayerDiv)
      this.textEls[pageIndex - 1] = textLayerDiv
      this.renderTextLayer(textLayerDiv, pageIndex, textContent)
      setTimeout(() => {
        textLayerDiv.childNodes.forEach((text) => {
          if (text.localName === "span") {
            const style = text.style
            const fontSize = parseFloat(style.fontSize)
            if (fontSize < 12) {
              let transform = style.transform.match(/\d+(.\d+)?/g)
              if (transform === null) transform = 1
              transform *= fontSize / 12
              style.transform = `scaleX(${transform})`
            }
          }
        })
      }, 1000)

    },
    renderTextLayer(el, index, content) {
      const textLayer = new TextLayerBuilder({
        eventBus: new EventBus(),
        textLayerDiv: el,
        pageIndex: index,
        viewport: this.viewport
      });
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
      this.viewHeight = this.renderedPage * (this.viewport.height + 15) + 10

      this.curCanvasCSSWh = {width, height, styleWidth, styleHeight}
      return this.curCanvasCSSWh
    },
    approximateFraction(x) {
      if (Math.floor(x) === x) {
        return [x, 1]
      }

      const xinv = 1 / x;
      const limit = 8;

      if (xinv > limit) {
        return [1, limit]
      } else if (Math.floor(xinv) === xinv) {
        return [1, xinv]
      }

      const x_ = x > 1 ? xinv : x;
      let a = 0,
          b = 1,
          c = 1,
          d = 1;
      // eslint-disable-next-line
      while (true) {
        const p = a + c,
            q = b + d;

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

      let result;

      if (x_ - a / b < c / d - x_) {
        result = x_ === x ? [a, b] : [b, a]
      } else {
        result = x_ === x ? [c, d] : [d, c]
      }

      return result
    },
    roundToDivide(x, div) {
      const r = x % div;
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
      this.viewport = page.getViewport({
        scale: this.pageScale * CSS_UNITS
      })

      this.isFirstTimeRender = false
    }
  }
}
</script>

<style scoped>
.pdf-touch-box {
  height: 100%;
  position: relative;
}

.pdf-canvas-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  position: absolute;
}

.pdf-canvas-tips {
  margin-top: 44px;
}
</style>
