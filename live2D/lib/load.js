const initConfig = {
  mode: "fixed",
  content: {
    welcome: ["Hi!"],
    touch: "",
    custom: [
      { "selector": ".comment-form", "text": "Content Tooltip" },
      { "selector": ".home-social a:last-child", "text": "Blog Tooltip" },
      { "selector": ".list .postname", "type": "read" },
      { "selector": ".post-content a, .page-content a, .post a", "type": "link" }
    ],
  },
  model: [
    "/live2D/model/Diana/Diana.model3.json",
  ],
  tips: true,
  onModelLoad: onModelLoad
}

function loadModel() {
  live2d_reference = new live2d_load(initConfig)

  live2d_alignment = "left"

  // Then apply style
  live2d_refresh_style()
}

function onModelLoad(model) {
  const container = document.getElementById("live2d-container")
  const canvas = document.getElementById("live2d")
  const coreModel = model.internalModel.coreModel
  const motionManager = model.internalModel.motionManager

  let touchList = [
    {
      text: "点击展示文本1",
      motion: "Idle"
    },
    {
      text: "点击展示文本2",
      motion: "Idle"
    }
  ]

  function playAction(action) {
    action.text && live2d_reference.modules.render(action.text)
    action.motion && live2d_reference.model.motion(action.motion)

    if (action.from && action.to) {
      Object.keys(action.from).forEach(id => {
        const hidePartIndex = coreModel._partIds.indexOf(id)
        TweenLite.to(coreModel._partOpacities, 0.6, { [hidePartIndex]: action.from[id] });
        // coreModel._partOpacities[hidePartIndex] = action.from[id]
      })

      motionManager.once("motionFinish", (data) => {
        Object.keys(action.to).forEach(id => {
          const hidePartIndex = coreModel._partIds.indexOf(id)
          TweenLite.to(coreModel._partOpacities, 0.6, { [hidePartIndex]: action.to[id] });
        })
      })
    }
  }

  canvas.onclick = function () {
    if (motionManager.state.currentGroup !== "Idle") return

    const action = live2d_reference.modules.rand(touchList)
    playAction(action)
  }
  container.dataset.model = "Diana"
  playAction({ motion: "Tap抱阿草-左手" })

  touchList = [
    {
      text: "嘉心糖屁用没有",
      motion: "Tap生气 -领结"
    },
    {
      text: "有人急了，但我不说是谁~",
      motion: "Tap= =  左蝴蝶结"
    },
    {
      text: "呜呜...呜呜呜....",
      motion: "Tap哭 -眼角"
    },
    {
      text: "想然然了没有呀~",
      motion: "Tap害羞-中间刘海"
    },
    {
      text: "阿草好软呀~",
      motion: "Tap抱阿草-左手"
    },
    {
      text: "不要再戳啦！好痒！",
      motion: "Tap摇头- 身体"
    },
    {
      text: "嗷呜~~~",
      motion: "Tap耳朵-发卡"
    },
    {
      text: "zzZ。。。",
      motion: "Leave"
    },
    {
      text: "哇！好吃的！",
      motion: "Tap右头发"
    },
  ]
}

let live2d_reference
// window.onload = loadModel
