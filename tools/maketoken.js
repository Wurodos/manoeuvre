const cabinet = require("rally-the-troops/tools/cabinet")
const oklab = require("rally-the-troops/tools/oklab")

cabinet.set_outline_width(3)
cabinet.set_stroke_width(1)

cabinet.draw_cylinder(40, 20, "#ec1317", null, "images/token_red.svg")
cabinet.draw_cylinder(40, 20, "#2b6cee", null, "images/token_blue.svg")
cabinet.draw_cylinder(40, 20, "#f0f0f0", null, "images/token_white.svg")

cabinet.outline_cylinder(40, 20, "white", "images/outline_white.svg")
cabinet.outline_cylinder(40, 20, "yellow", "images/outline_yellow.svg")

console.log(oklab.css_bevel(".tile.gold", "#ebcf42"))
console.log(oklab.css_bevel(".tile.blue", "#1895d8"))
console.log(oklab.css_bevel(".tile.white", "#f0f0f0"))
console.log(oklab.css_bevel(".tile.red", "#ed0c0c"))
console.log(oklab.css_bevel(".tile.green", "#426645"))
