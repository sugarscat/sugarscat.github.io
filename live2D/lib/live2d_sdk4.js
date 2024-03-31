/* ----

# Pio SDK 2/3/4 support
# By: jupiterbjy
# Modify: journey-ad
# Last Update: 2021.5.4

<script src="https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/dylanNew/live2d/webgl/Live2D/lib/live2d.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/pixi.js@5.3.6/dist/pixi.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/pixi-live2d-display/dist/index.min.js"></script>

If you have trouble setting up this, check following example's sources.
https://jupiterbjy.github.io/PaulPio_PIXI_Demo/

---- */


function loadlive2d(canvas_id, json_object_or_url, on_load) {
    // Replaces original l2d method 'loadlive2d' for Pio.
    // Heavily relies on pixi_live2d_display.

    console.log("Loading new model")

    const canvas = document.getElementById(canvas_id)

    // When pio was start minimized on browser refresh or reload,
    // canvas is set to 0, 0 dimension and need to be changed.
    if (canvas.width === 0) {
        canvas.removeAttribute("height")
        live2d_refresh_style()
    }

    // Try to remove previous model, if any exists.
    try {
        app.stage.removeChildAt(0)
    } catch (error) {

    }

    let model = PIXI.live2d.Live2DModel.fromSync(json_object_or_url)

    model.once("load", () => {
        app.stage.addChild(model)

        const vertical_factor = canvas.height / model.height
        model.scale.set(vertical_factor)

        // match canvas to model width
        canvas.width = model.width;
        canvas.height = model.height;
        live2d_refresh_style()

        // check alignment, and align model to corner
        if (document.getElementsByClassName("live2d-container").item(0).className.includes("left")){
            model.x = 0
        } else {
            model.x = canvas.width - model.width
        }

        // Hit callback definition
        model.on("hit", hitAreas => {
            if (hitAreas.includes("body")) {
                console.log("Touch on body (SDK2)")
                model.motion('tap_body')

            } else if (hitAreas.includes("Body")) {
                console.log("Touch on body (SDK3/4)")
                model.motion("Tap")

            } else if (hitAreas.includes("head") || hitAreas.includes("Head")){
                console.log("Touch on head")
                model.expression()
            }
        })

        on_load(model)
    })

    return model
}

function _live2d_initialize_container(){
    // Generate structure
    let live2d_container = document.createElement("div")
    live2d_container.classList.add("live2d-container")
    live2d_container.id = "live2d-container"
    document.body.insertAdjacentElement("beforeend", live2d_container)

    // Generate action
    let live2d_action = document.createElement("div")
    live2d_action.classList.add("live2d-action")
    live2d_container.insertAdjacentElement("beforeend", live2d_action)

    // Generate canvas
    let live2d_canvas = document.createElement("canvas")
    live2d_canvas.id = "live2d"
    live2d_canvas.classList.add("cursor_none")
    live2d_container.insertAdjacentElement("beforeend", live2d_canvas)

    console.log("Initialized container.")
}


function live2d_refresh_style(){
    // Always make sure to call this after container/canvas style changes!
    // You can set alignment here, but still you can change it manually.

    let live2d_container = document.getElementsByClassName("live2d-container").item(0)

    live2d_container.classList.remove("left", "right")
    live2d_container.classList.add(live2d_alignment)

    // app.resizeTo = document.getElementById("live2d")
}


function _live2d_initialize_pixi() {
    // Initialize html elements and pixi app.
    // Must run before pio init.

    _live2d_initialize_container()

    app = new PIXI.Application({
        view: document.getElementById("live2d"),
        transparent: true,
        autoStart: true,
    })

    live2d_refresh_style()
}


// change alignment to left by modifying this value in other script.
// Make sure to call `pio_refresh_style` to apply changes!
let live2d_alignment = "right"


let app
window.addEventListener("DOMContentLoaded", _live2d_initialize_pixi)
