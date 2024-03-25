<template>
  <div class="report-detail">
    <breadcrumb :breadcrumbList="breadcrumbList" />
    <div class="preview-word-wrapper es-commonPage">
      <Loading v-if="loading" class="loading" />
      <div class="iframe-wrapper">
        <div class="custom-toolbar">
          <span
            class="aside-scale-down point custom-toolbar_icon"
            style="opacity: 0; cursor: auto;"
          >
            <el-image :src="getIcon.EXPAND" />
          </span>
          <div
            v-if="getPDFInfo.pagesCount && getPDFInfo.pagesCount !== undefined"
            class="page-number-box"
          >
            <span class="text page-number">
              <span class="current">{{ getPDFInfo.page }}</span>
              <span class="total">/{{ getPDFInfo.pagesCount }}页</span>
            </span>
            <div class="to-page">
              <span>跳转至</span>
              <input
                v-model="pdfPage"
                autocomplete="off"
                style="height: 24px;"
                @focus=" focus($event)"
                @blur="handleUpdatePage"
                @keyup.enter="handleUpdatePage"
              />
              <span>页</span>
            </div>
          </div>

          <span class="text fn-scale">
            <span
              class="scale-down point custom-toolbar_icon"
              @click="handlePDFZoomOut"
            >
              <el-image :src="getIcon.NUM_DOWN" />
            </span>
            <span class="scaling">{{ getPDFInfo.zoom }}%</span>
            <span
              class="scale-up point custom-toolbar_icon"
              @click="handlePDFZoomIn"
            >
              <el-image :src="getIcon.NUM_UP" />
            </span>
          </span>
        </div>
        <iframe
          id="iframe"
          ref="iframe"
          class="iframe"
          :src="previewSrc"
          width="100%"
          height="100%"
        ></iframe>

        <div
          v-show="showMembersWrapper"
          class="pay-member"
        >
          <p class="pay-text">完整内容需订阅会员观看</p>
          <p
            class="pay-button pointer"
            @click="handleOpenPaySku"
          >
            立即订阅
            <el-image
              class="arrow"
              :src="getIcon.ARROW"
              :lazy="false"
            />
          </p>
        </div>

        <div
          class="go-top hidden point"
          :class="{
            show: getPDFInfo.page > 1
          }"
          @click="PDFViewerApplication.page = 1"
        >
          <el-image
            class="icon"
            :src="getIcon.GO_TOP"
            :lazy="false"
          />
        </div>
      </div>

      <div class="info">
        <div class="info-wrapper">
          <div class="report-info">
            <p
              class="more-hidden-ellipsis title"
              :title="report.reportName"
            >{{ report.reportName }}</p>
            <div class="report-sub-info one-hidden-ellipsis text">
              <span v-if="report.isTopping" class="status" >置顶</span>
              <span v-for="tag in report.reportTag" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <div class="split-el solid mg16"></div>
            <div class="annotation text">
              <p
                v-if="getReportAuthor !== '暂无'"
                class="author one-hidden-ellipsis"
              >分析师：{{ getReportAuthor }}</p>
              <p
                v-if="report.writingTime"
                class="compose-time one-hidden-ellipsis"
              >撰写时间：{{ report.writingTime?.slice(0, 10)
              }}</p>
            </div>
          </div>

          <div class="function">
            <span class="download">
              <el-button
                type="primary"
                class="download"
                @click="handleDownload"
              >下载</el-button>
            </span>
            <span class="collect">
              <el-button
                class="collect"
                @click="handleCollect"
              >{{ getCollectText }}</el-button>
            </span>
            <span class="share">
              <el-button
                id="share"
                class="share"
                @click="handleShare"
              >分享</el-button>
            </span>
          </div>

          <div class="score">
            <p class="score__label">
              <span class="label-text text">报告评分</span>
              <span class="grade-text text">{{ getGradeLabel }}</span>
            </p>
            <div
              class="score__grade"
              @mouseleave="handleGradeMoveOver"
            >
              <span
                v-for="(item, i) in gradeStars"
                :key="item.value"
                class="grade_star"
                @mousemove="handleGradeMoveHovering(item, i)"
                @click.stop="handleGradeClick(item, i)"
              >
                <el-image
                  :src="item.icon"
                  :lazy="false"
                />
              </span>
            </div>
          </div>

          <div class="feedback">
            <el-button
              class="feedback-btn"
              @click="handleOpenFeedbackDialog"
            >内容纠错</el-button>
          </div>
        </div>

        <div class="recommend">
          <p class="recommend-title">推荐报告</p>
          <div
            v-if="recommendList.length"
            class="recommend-list"
          >
            <div
              v-for="item in recommendList"
              :key="item.id + item.reportName"
              class="recommend__item"
              @click="handleSkipRecommend(item)"
            >
              <p
                class="item-label text one-hidden-ellipsis"
                :title="item.reportName"
              >{{ item.reportName }}</p>
              <p class="item-info text one-hidden-ellipsis">{{ getReportTag(item.reportTag) }}</p>
            </div>
          </div>
          <div
            v-else
            class="recommend-empty"
          >
            <el-image
              class="empty__icon"
              :src="getIcon.EMPTY"
              :lazy="false"
            />
            <p class="empty__text">精彩内容正在努力撰写～</p>
          </div>
        </div>
      </div>

      <MembersBuy
        v-if="showMembersBuy"
        :show-members-buy="showMembersBuy"
        :product-list="productList"
        :open-index="targetIndex"
        @onCancel="onOptionDialog"
      />
    </div>
  </div>
</template>

<script>
import {
  getFile,
  getReportDetail_V2,
  getReportDetailRecommend_V2,
  getFilePath,
  setReportCollect_V2,
  setReportScore_V2,
  setReportFeedback_V2,
  fileUpload,
  recordReportShare,
  recordReportRead,
  recordReportClick,
  getPayInfoList
} from '@/api/reportDetail'
import EXPAND from '@/assets/img/reportDetail/i-Report-expand.png'
import NUM_DOWN from '@/assets/img/reportDetail/i-Report-number-down.png'
import NUM_UP from '@/assets/img/reportDetail/i-Report-number-up.png'
import STAR from '@/assets/img/reportDetail/i-Report-star.png'
import STAR_FILL from '@/assets/img/reportDetail/i-Report-star-fill.png'
import UPLOAD from '@/assets/img/reportDetail/i-Report-upload.png'
// import TOP from '@/assets/img/reportDetail/i-Report-online-top.png'
import EMPTY from '@/assets/img/reportDetail/i-Report-empty.png'
import GO_TOP from '@/assets/img/reportDetail/icon_go-top.png'
import ARROW from '@/assets/img/reportDetail/icon_drop_putAway.png'
import breadcrumb from '@/components/Common/breadcrumb.vue'
import { forIn, cloneDeep } from 'lodash'
import { toType } from '@/utils'
import ClipboardJS from 'clipboard'
import { SHARE, DOWNLOAD, COLLECT, DETAIL, VIEWER, RECOMMEND, READ, CLICK } from './constant'
export default {
  name: 'ReportDetailPdfV2',
  components: {
    Loading: () => import('@/components/Common/loading.vue'),
    breadcrumb,
    MembersBuy: () => import('@/views/V2/views/relation-servicer/subscription-member/membersBuy')
  },
  data() {
    return {
      breadcrumbList: [
        { text: '报告',path: '/report' },
        { text: '行业洞察',path: '/report' },
        { text: '报告',path: '/report' },
      ],
      targetIndex: 0, // 支付会员选中支付哪种
      data: null,
      previewSrc: '',
      loading: true,
      report: {},
      gradeStars: [],
      score: {
        grade: {},
        grade_enter: {}
      },
      pdfPage: null,
      recommendList: [],
      PDFViewerApplication: null,
      fileReady: false,
      fileError: false,
      infoReady: false,
      infoError: false,

      feedbackVisible: false,
      feedbackDialogLabelWidth: '85px',
      feedbackDialogWidth: '640px',
      feedbackDialogForm: {
        url: []
      },
      feedbackDialogLoading: false,
      showMembersBuy: false,
      productList: [],
      showMembersWrapper: false
    }
  },
  computed: {
    getIcon() {
      return {
        EXPAND, NUM_DOWN, NUM_UP, TOP, STAR, STAR_FILL, UPLOAD, EMPTY, GO_TOP, ARROW
      }
    },
    getGrade() {
      const { score } = this

      if (score.grade.level) return score.grade

      if (score.grade_enter) return score.grade_enter

      return {}
    },
    getGradeLabel() {
      return this.getGrade.level || ''
    },
    getGradeValue() {
      return this.getGrade.score || ''
    },
    getPDFInfo() {
      const { PDFViewerApplication } = this

      let zoom = PDFViewerApplication?.toolbar?.pageScale || 1

      zoom = (zoom.toFixed(2) * 100).toFixed(0)

      return {
        page: PDFViewerApplication?.page || 0,
        pagesCount: PDFViewerApplication?.pagesCount || 0,
        zoom
      }
    },
    getParams() {
      const { $route } = this

      const params = {}

      forIn($route.query, (val, key) => {
        params[key] = val
      })

      return params
    },
    getReportTag() {
      return (reportTag) => (reportTag || []).join(' | ')
    },
    getReportAuthor() {
      const { report } = this

      return report.author?.join('、') || '暂无'
    },
    getCollectText() {
      const { report } = this

      return report.isCollected ? '取消收藏' : '收藏'
    }
  },

  watch: {
    pdfPage:
    {
      handler(newVal) {
        this.pdfPage = (newVal + '').replace(/[^\d]/g, '')
        if (this.pdfPage * 1 > this.getPDFInfo.pagesCount || this.pdfPage * 1 === 0) {
          this.pdfPage = ''
        }
      }
    },
    getPDFInfo: {
      handler(val) {
        this.pdfPage = val.page
      }, deep: true, immediate: true
    },
  },
  created() {
    console.log('%cYES', 'color: red;')
    this.initData()
    this.getReportInfo()
    // this.getPayList()
  },
  beforeDestroy() {
    window.URL.revokeObjectURL(this.data)

    document.removeEventListener('contextmenu', this.handleStopContentMenu)
    document.removeEventListener('keydown', this.handleStopDevelopmentConsole)
    this.handleClearStopCommand()

    clearTimeout(this.readTimer)
    this.readTimer = null
  },
  methods: {
    handleUpdatePage() {
      this.PDFViewerApplication.page = this.pdfPage * 1
    },
    focus: function(event) {
      event.currentTarget.select()
    },
    getPdfInfoFn() {
      const self = this

      const t = window.setInterval(() => {
        const pdfIframe = document.querySelector('#iframe')

        if (pdfIframe) {
          const contentWindow = pdfIframe.contentWindow

          if (
            contentWindow &&
            contentWindow.PDFViewerApplication &&
            contentWindow.PDFViewerApplication.pdfViewer
          ) {
            window.clearInterval(t)

            self.PDFViewerApplication = contentWindow.PDFViewerApplication

            self.setPdfZoom()
          }
        }
      }, 1000 * 0.2)
    },
    setPdfZoom() {
      // const { PDFViewerApplication } = this

      // const eventBus = PDFViewerApplication.pdfViewer.eventBus

      // const renderedFn = () => {
      //   eventBus.off('pagerendered', renderedFn)

      //   PDFViewerApplication.pdfViewer.currentScaleValue = 1
      // }

      // eventBus.on('pagerendered', renderedFn)
    },
    initData() {
      this.gradeStars = [
        {
          icon: this.getIcon.STAR,
          level: '比较差',
          score: 1
        },
        {
          icon: this.getIcon.STAR,
          level: '较差',
          score: 2
        },
        {
          icon: this.getIcon.STAR,
          level: '一般',
          score: 3
        },
        {
          icon: this.getIcon.STAR,
          level: '较好',
          score: 4
        },
        {
          icon: this.getIcon.STAR,
          level: '比较好',
          score: 5
        }
      ]

      this.feedbackDialogRules = {
        name: [
          {
            required: true,
            message: '请输入您的姓名',
            trigger: ['change', 'input']
          }
        ],
        contactInformation: [
          {
            required: true,
            message: '请输入您的联系方式',
            trigger: ['change', 'input']
          }
        ],
        describe: [
          {
            required: true,
            message: '请输入内容描述',
            trigger: ['change', 'input']
          },
          { max: 200, message: '最多输入200个字符' }
        ]
      }

      this.feedbackMaxImg = 3

      const { moduleName, id } = this.$route.query

      this.readTimer = setTimeout(() => {
        clearTimeout(this.readTimer)
        this.readTimer = null

        recordReportRead(READ[moduleName], { reportId: id, reading: true })
      }, 1000 * 61)

      // 记录点击量
      recordReportClick(CLICK[moduleName], {
        reportId: id
      })
    },
    // 文件
    async getReportFile() {
      const { _getFile, $msg, report } = this
      const { fileId, moduleName } = report

      if (!fileId) {
        $msg.warning('文件可能已损坏，请联系管理员后再试')
        console.debug('文件可能已损坏，请联系管理员后再试', cloneDeep(fileId))
        return
      }

      const { datas } = await getFilePath({ fileId, fileType: 'pdf', moduleName })
      const { token, url, allData } = datas

      const pdf_blob = await _getFile(url, token || datas['x-oss-meta-token'])

      const pdf_blob_type = toType(pdf_blob)

      this.showMembersWrapper = !allData

      if (pdf_blob_type === 'object' || pdf_blob.size < 50) {
        $msg.warning('文件已被删除或不存在')

        this.fileError = true

        if (this.infoReady || this.infoError) this.loading = false

        return
      }

      if (pdf_blob_type === 'blob') {
        window.URL.revokeObjectURL(this.data)

        this.data = window.URL.createObjectURL(pdf_blob)

        this.previewSrc = `${VIEWER}?file=${this.data}`
      }

      this.fileReady = true

      this.getPdfInfoFn()
      this.getRecommendList()

      if (this.infoReady) this.loading = false
    },
    // 文件信息
    async getReportInfo() {
      const { getParams, score, handleGradeSetIcon, gradeStars, $router } = this
      const { id, moduleName } = getParams

      const url = DETAIL[moduleName]
      getReportDetail_V2(url, { id })
        .then(({ resp_code, datas }) => {
          if (resp_code === 0) {
            this.report = datas
            score.grade = {
              icon: this.getIcon.STAR_FILL,
              level: datas.ratingLevel,
              score: datas.reportScoring
            }
            const targetIndex = gradeStars.findIndex(item => item.score === datas.reportScoring)

            handleGradeSetIcon(targetIndex)
          } else {
            // $router.push('/')
            return
          }
        }).catch(err => {
          if (err.resp_code !== 0) {
            // $router.push('/')
            return
          }
        })
        .finally(() => {
          this.getReportFile()

          this.infoReady = true

          if (this.fileReady || this.fileError) this.loading = false
          this.loading = false
        })
    },
    // 推荐列表
    async getRecommendList() {
      const { getParams } = this
      const { id, moduleName } = getParams

      const url = RECOMMEND[moduleName]

      try {
        const { resp_code, datas } = await getReportDetailRecommend_V2(url, { id, limit: 10, hideError: true })
        resp_code === 0 && ( this.recommendList = datas )
      } catch (error) {
        return
      }
    },

    handleStopContentMenu(event) {
      event.preventDefault()
      return false
    },
    handleStopDevelopmentConsole(event) {
      if (event.key === 'F12' || event.keyCode === 123) {
        event.preventDefault()
        return false
      }
    },
    handleUseStopCommand() {
      const { handleStopContentMenu, handleStopDevelopmentConsole } = this
      // 禁止右键菜单
      document.addEventListener('contextmenu', handleStopContentMenu)
      // 禁止F12
      document.addEventListener('keydown', handleStopDevelopmentConsole)

      // 其他方式打开控制台阻止查看
      if (window.location.href.indexOf('#debug') === -1) {
        this.timer = setInterval(function() {
          (function(a) {
            return (function(a) {
              return Function('Function(arguments[0]+"' + a + '")()')
            })(a)
          })('bugger')('de', 0, 0, (0, 0))
        }, 1000)
      }
    },
    handleClearStopCommand() {
      window.URL.revokeObjectURL(this.data)

      document.removeEventListener('contextmenu', this.handleStopContentMenu)
      document.removeEventListener('keydown', this.handleStopDevelopmentConsole)

      clearInterval(this.timer)
      this.timer = null
    },

    // 评分
    // 悬浮
    async handleGradeSetIcon(i) {
      const { gradeStars, getIcon } = this

      gradeStars.forEach((_item, _i) => {
        if (_i <= i) _item.icon = getIcon.STAR_FILL
        else _item.icon = getIcon.STAR
      })
    },
    async handleGradeMoveHovering(item, i) {
      const { score, handleGradeSetIcon } = this

      handleGradeSetIcon(i)

      score.grade_enter = item
    },
    // 移出
    async handleGradeMoveOver() {
      const { score, handleGradeSetIcon, gradeStars } = this

      const targetScoreIndex = gradeStars.findIndex(
        (item) => item.score === score.grade.score
      )

      handleGradeSetIcon(targetScoreIndex)

      score.grade_enter = {}
    },
    // 点击
    async handleGradeClick(item, i) {
      const { score, report, getParams, handleGradeSetIcon } = this
      score.grade = item
      handleGradeSetIcon(i)
      const params = {
        ...item,
        reportId: report.id,
        moduleName: getParams.moduleName
      }
      setReportScore_V2(params)
    },

    // PDF command
    // 放大
    handlePDFZoomIn() {
      const { PDFViewerApplication } = this

      PDFViewerApplication?.zoomIn()
    },
    // 缩小
    handlePDFZoomOut() {
      const { PDFViewerApplication } = this

      PDFViewerApplication?.zoomOut()
    },
    // 下载
    _getFile(url, token) {
      return new Promise((resolve, reject) => {
        getFile(url, token, {
          hideError: true
        })
          .then((res) => {
            const blob = new Blob([res], { type: 'application/pdf' })

            resolve(blob)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    async handleDownload() {
      if (this.$hasPermission('REPORT_DOWNLOAD')) {
        return
      }
      const {
        $store,
        report,
        getParams,
        fileError,
        $msg,
        _download,
        _getFile,
        handleOpenPermissionsDialog,
        $route,
        showMembersWrapper
      } = this

      const { moduleName, id } = $route.query

      const {
        role: { download },
        message,
        code
      } = await $store.dispatch('user/checkUserRoles_V2', {
        report,
        routerSign: getParams.from
      })

      if (!download && getParams.moduleName !== 'REAL_TIME_INFORMATION') {
        if (code !== 'SYSTEM_BUSY') handleOpenPermissionsDialog(message)

        return
      }

      // 记录下载量
      recordReportShare(DOWNLOAD[moduleName], {
        reportId: id
      })

      if (fileError) {
        $msg.warning('文件不存在或已删除')
        return
      }
      if (showMembersWrapper) {
        // 没有权限
        this.$frequencyPermission('REPORT_DOWNLOAD')
        return
      }

      const { moduleName: reportModuleName } = report

      const {
        datas,
        resp_code
      } = await getFilePath({ fileId: report.fileId, fileType: 'pdf', moduleName: reportModuleName })

      if (resp_code === 0) {
        _getFile(datas.url, datas['x-oss-meta-token']).then((res) => {
          _download(res)
        }).catch(err => {
          console.log('ERR', err)
          if (err && err.response) {
            err.response.status === 403 && this.$frequencyPermission('REPORT_DOWNLOAD') // 没有权限
          }
          if (err && err.resp_code === 403) {
            this.$frequencyPermission('REPORT_DOWNLOAD') // 没有权限
          }
        })
      }
    },
    async _download(data, name) {
      const { report } = this

      if (toType(data) !== 'blob') return

      const a = document.createElement('a')
      a.download = name || `${report.reportName}.pdf`
      a.href = window.URL.createObjectURL(data)

      a.click()

      window.URL.revokeObjectURL(a.href)
    },

    // 收藏
    async handleCollect() {
      const { report, getReportInfo, $msg, getParams } = this

      const params = {
        reportId: report.id,
        collectionType: 'REPORT',
        uncollect: report.isCollected
      }

      const { resp_code } = await setReportCollect_V2(COLLECT[getParams.moduleName], params)

      let text = ''

      if (!report.isCollected) {
        text = '报告收藏'
      } else {
        text = '报告取消收藏'
      }

      if (resp_code === 0) {
        $msg.success(`${text}成功`)
      } else {
        $msg.warning(`${text}失败`)
      }

      getReportInfo()
    },

    // 分享
    async handleShare() {
      const { $msg, $route } = this

      const { moduleName, id } = $route.query

      // 记录分享量
      recordReportShare(SHARE[moduleName], {
        reportId: id,
        share: true
      })

      const curPath = window.location.href

      const clips = new ClipboardJS('#share', {
        text: () => {
          return curPath
        }
      })

      clips.on('success', () => {
        $msg.success('网址已复制，快去分享吧')
        clips.destroy()
      })

      clips.on('error', (e) => {
        $msg.warning('网址复制失败')
        clips.destroy()
      })
    },

    // 权限弹窗
    handleClosePermissionsDialog() {
      this.permissionsVisible = false

      this.permissionsText = ''
    },

    // 纠错
    handleOpenFeedbackDialog() {

      this.feedbackVisible = true
    },
    handleCloseFeedbackDialog() {
      this.feedbackVisible = false
      this.feedbackDialogForm = {
        url: []
      }
    },
    handleSubmitFeedback() {
      const { handleCloseFeedbackDialog, $refs, feedbackDialogForm, report, getParams, $msg } =
        this

      const formRef = $refs['feedbackForm']

      if (!formRef) return

      formRef.validate(async valid => {
        if (!valid) return

        this.feedbackDialogLoading = true

        const params = {
          ...feedbackDialogForm,
          reportId: report.id,
          moduleName: getParams.moduleName,
          reportName: report.reportName
        }

        const img_list = []

        if (feedbackDialogForm.url.length) {
          for (let index = 0, len = feedbackDialogForm.url.length; index < len; index++) {
            const val = feedbackDialogForm.url[index]

            const formData = new FormData()

            try {
              formData.append('file', val.raw, val.raw.name)
              const { datas } = await fileUpload(formData)

              img_list.push(datas)
            } catch (err) {
              img_list.push('')
            }
          }
        }

        params.url = img_list.filter(item => item).join(',')

        try {
          const { resp_code } = await setReportFeedback_V2(params)

          if (resp_code === 0) {
            $msg.success('感谢您的反馈，我们将及时进行跟进')

            handleCloseFeedbackDialog()
          } else {
            $msg.warning('提交失败')
          }
        } catch (error) {
          $msg.error('提交错误')
          handleCloseFeedbackDialog()
        }

        this.feedbackDialogLoading = false
      })
    },
    async handleSelectFeedbackImg(file, fileList) {
      const { feedbackDialogForm, feedbackMaxImg, $message } = this

      const imgList = cloneDeep(fileList)

      if (imgList.length > feedbackMaxImg) {
        imgList.splice(0, 1)

        $message.warning(`最多选择${feedbackMaxImg}张图片`)
      }

      feedbackDialogForm.url = imgList
    },

    // 推荐
    handleSkipRecommend(item) {

      // 记录点击量
      recordReportClick(CLICK[item.moduleName], {
        reportId: item.id
      })

      $router.replace({
        path: $route.path,
        query: {
          ...getParams,
          id: item.id,
          moduleName: item.moduleName
        }
      })

      getReportInfo()
    },

    // 获取会员列表
    async getPayList() {
      const { $msg } = this

      try {
        const { datas, resp_code, resp_msg } = await getPayInfoList()

        if (resp_code === 0) {
          datas.productSkuFrontList.forEach(item => {
            item.originalPrice = item.originalPrice < 100
              ? (item.originalPrice / 100).toFixed(2)
              : Math.floor(item.originalPrice / 100)

            item.preferentialPrice = item.preferentialPrice < 100
              ? (item.preferentialPrice / 100).toFixed(2)
              : Math.floor(item.preferentialPrice / 100)

            item.preferentialPriceCount = item.preferentialPriceCount < 100
              ? (item.preferentialPriceCount / 100).toFixed(2)
              : Math.floor(item.preferentialPriceCount / 100)
          })
          this.productList = datas
        } else {
          $msg.warning(resp_msg || '获取会员列表失败')
        }
      } catch (error) {
        $msg.error(error.resp_msg || '获取会员列表错误')
      }
    },
    // 打开购买会员
    async handleOpenPaySku() {
      this.targetIndex = 2
      this.onOptionDialog(true)
    },
    onOptionDialog(value) {
      value && (this.showMembersBuy = value)
      !value && setTimeout(() => {
        this.showMembersBuy = value
      }, 400)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/style";
@import "@/style/mixin.scss";
.report-detail{
  min-height: 100vh;
  @include padding(56px,0,24px,0);
}
.preview-word-wrapper {
  height: calc( 100vh - 56px - 48px - 24px );
  display: flex;

  .loading {
    @include widthAndHeight(calc(100% - 48px),calc(100% - 24px));
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .text {
    font-size: 14px;
    font-weight: normal;
    line-height: 22px;
  }

  .iframe-wrapper {
    flex: 1;
    height: 100%;
    border-radius: $es-bd-radius;
    overflow: hidden;
    position: relative;

    .custom-toolbar {
      background-color: $es-white-10;
      height: $es-lh-28 * 2;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $es-mg-16;

      .custom-toolbar_icon {
        width: 24px;
        height: 24px;
        display: inline-block;
        vertical-align: middle;
      }

      .aside-scale-down {}

      .page-number-box {
        display: flex;
        align-items: center;
      }

      .page-number {
        color: $es-text-title;
        margin-right: 32px;
      }

      .to-page {
        display: flex;
        align-items: center;

        span {
          font-size: 14px;
          font-weight: 400;
          color: #1D232E;
          line-height: 22px;
        }

        input {
          width: 40px;
          height: 24px;
          background: #F1F2F7;
          border-radius: 4px;
          border: 0;
          outline: none;
          margin: 0 4px;
          padding: 4px 2px;
          text-align: center;
        }
      }

      .fn-scale {
        color: #1d232e;

        .scale-down {}

        .scaling {
          padding: 0 $es-mg-8;
        }

        .scale-up {}
      }
    }

    .iframe {
      width: 100%;
      height: calc(100% - 56px);
      border: none;
    }

    .pay-member {
      @include fontSize(16px);
      @include color($es-text-color-title);
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 96px;
      background-image: linear-gradient(180deg, rgba(233, 235, 240, 0) 0%, #E9EBF0 58%);
      text-align: center;
      padding-top: 34px;

      .pay-text {}

      .pay-button {
        @include color($es-bg-color-main);
        @include fontSize(14px);

        .arrow {
          width: 16px;
          height: 16px;
          vertical-align: middle;
          transform: rotate(90deg);
          margin-left: 4px;
        }
      }
    }

    .go-top {
      @include color($es-black-10, 0.3, background-color);
      position: absolute;
      right: $es-bd-radius;
      bottom: $es-bd-radius;
      width: 40px;
      height: 40px;
      border-radius: $es-bd-radius;
      padding: 4px;
      transition: bottom 0.75s, opacity 0.5s;

      .icon {}

      &.hidden {
        bottom: -40px;
        opacity: 0;
      }

      &.show {
        bottom: $es-bd-radius;
        opacity: 1;
      }
    }
  }

  .info {
    padding: 0 $es-mg-24 0 $es-mg-16;
    height: 100%;
    display: flex;
    flex-direction: column;
    width: 312px;

    &>div {
      &+div {
        margin-top: $es-mg-16;
      }
    }

    .info-wrapper {
      background-color: $es-white-10;
      padding: $es-mg-24;
      border-radius: $es-bd-radius;

      &>div {
        &+div {
          margin-top: $es-mg-24;
        }
      }

      .split-el {
        width: 100%;
        margin: 8px 0;

        &.solid {
          height: 1px;
          background-color: $es-bd-color-dotted;
        }

        &.mg16 {
          margin: 16px 0;
        }

        &.mg24 {
          margin: 24px 0;
        }
      }

      .report-info {
        .title {
          -webkit-line-clamp: 2;
          font-size: $es-fs-24;
          font-weight: $es-fw-bold;
          color: $es-text-title;
          line-height: $es-lh-26;
          margin-bottom: $es-mg-4;
        }

        .report-sub-info {
          font-size: 14px;
          font-weight: normal;
          line-height: 22px;
          color: $es-text-color-main;
          @include flex(center,flex-start);

          .status {
            display: inline-block;
            width: 40px;
            height: 24px;
            vertical-align: middle;
            margin-right: $es-mg-8;
            background: #F75964;
            border-radius: 4px;
            @include flex();
            @include font(12px,400,rgba(255,255,2550.9),20px);
          }
          .tag {
            @include widthAndHeight(40px,24px);
            background: #FFF3EA;
            border-radius: 4px;
            border: 1px solid #FF8D32;
            @include flex();
            @include font(12px,400,#FF8D32,20px);
            margin-right: $es-mg-8;
          }
        }

        .annotation {
          &>p {
            &+p {
              margin-top: $es-mg-4;
            }
          }

          .author {
            color: $es-text-color-title;
            font-weight: $es-fw-bold;
          }

          .compose-time {
            color: $es-text-color-main;
          }
        }
      }

      .function {
        display: grid;
        grid:
          "a a" max-content "b c" 32px / 1fr 1fr;
        grid-gap: 8px;

        &>span {
          &>.el-button {
            width: 100%;
          }
        }

        .download {
          grid-area: a;
        }

        .collect {
          grid-area: b;
        }

        .share {
          grid-area: c;
        }
      }

      .score {
        .score__label {
          display: flex;
          justify-content: space-between;
          margin-bottom: $es-mg-8;

          .label-text {
            font-weight: $es-fw-bold;
          }

          .grade-text {
            font-size: 12px;
            line-height: 20px;
            color: $es-bg-color-warning;
          }
        }

        .score__grade {
          display: flex;
          justify-content: space-evenly;
          align-items: center;
          height: 24px;

          .grade_star {
            width: 22px;
            height: 20px;
          }
        }
      }

      .feedback {
        .feedback-btn {
          width: 100%;
        }
      }
    }

    .recommend {
      padding: $es-mg-16;
      background-color: $es-white-10;
      border-radius: $es-bd-radius;
      flex: 1;
      min-height: 54px;

      .recommend-title {
        font-size: $es-fs-16;
        font-weight: $es-fw-bold;
        line-height: $es-lh-24;
        color: $es-text-color-title;
      }

      .recommend-list {
        overflow: auto overlay;
        height: calc(100% - 24px);

        .recommend__item {
          border-bottom: 1px solid $es-bd-color-dotted;
          padding: $es-mg-16 0;
          cursor: pointer;

          &:hover {
            background-color: #F7F7F7;
          }

          .item-label {
            color: $es-text-color-title;
          }

          .item-info {
            font-size: $es-fs-12;
            font-weight: normal;
            line-height: $es-lh-20;
            color: $es-text-color-main;
          }
        }
      }

      .recommend-empty {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .empty__icon {
          max-width: 96px;
          max-height: 96px;
        }

        .empty__text {
          font-size: $es-fs-12;
          line-height: $es-lh-20;
          color: $es-text-color-main;
          font-weight: normal;
        }
      }
    }
  }

  .permissions-dialog {}

  .feedback-dialog {
    z-index: 2000;

    .feedback-dialog-form {
      .feedback-dialog-form__label {
        display: inline-block;
        color: $es-text-color-main;
        text-align: center;
        width: calc(100% - 4px);

        .label {}

        .sub-label {
          line-height: $es-lh-20;
          color: $es-text-color-assist;
        }
      }

      .feedback-dialog-form__content {
        .feedback-dialog-upload-wrapper {
          .feedback-dialog-upload {
            width: 100%;
            height: 100%;
            background-color: #f4f5f7;
            border-radius: $es-bd-radius / 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .feedback-dialog-upload__icon {
              width: $es-mg-8 * 3;
              height: $es-mg-8 * 3;
              vertical-align: middle;
            }

            .feedback-dialog-upload__text {
              line-height: $es-lh-20;
              font-size: $es-fs-12;
              font-weight: normal;
            }
          }
        }
      }
    }
  }

  .empty {
    height: 100%;
    padding: 50px;

    .no-preview {
      text-align: center;
    }
  }
}
</style>

<style lang="scss">
@import "@/style";

.feedback-dialog {
  .es-dialog__wrapper {
    max-height: 85vh;
    overflow: overlay;
  }

  .feedback-dialog-form {
    .feedback-dialog-form__label {}

    .feedback-dialog-form__content {

      .el-input,
      .el-textarea {

        .el-input__inner,
        .el-textarea__inner {
          background-color: #f4f5f7;
          border-color: transparent;

          &:hover {
            background-color: $es-bd-color-dotted;

            &+.el-input__count {
              background-color: $es-bd-color-dotted;
            }
          }

          &:focus {
            border-color: $es-bg-color-main;
            background-color: $es-white-10;

            &+.el-input__count {
              background-color: $es-white-10;
            }
          }
        }

        .el-input__count {
          background-color: #f4f5f7;
          line-height: $es-lh-20;
          right: 17px;
        }
      }

      .feedback-dialog-upload-wrapper {
        .el-upload--picture-card {
          width: 80px;
          height: 80px;
        }

        .el-upload-list--picture-card {
          .el-upload-list__item {
            width: 80px;
            height: 80px;
          }
        }
      }
    }
  }
}
.more-hidden-ellipsis{
  @include textOverflow(2)
}
</style>
