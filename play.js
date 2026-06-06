"use strict"

const R_FIRST = 0
const R_SECOND = 1
const SECTIONS = 24

const ui = {
	section_map: [
		document.getElementById("section-map-0"),
		document.getElementById("section-map-1"),
		document.getElementById("section-map-2"),
		document.getElementById("section-map-3"),
	]
}

function on_init() {
	var i

	define_panel("#sections", "sections", 0)
	define_panel("#hand", "hand", 0)

	for (i = 0; i < 4; ++i) {
		define_html_thing("#section-map-"+i, "section_map", i)
			.action()
	}

	for (i = 1; i <= SECTIONS; ++i) {
		define_card("section", i, "s" + i, true)
	}
}

function on_update() {
	var i

	begin_update()

	for (i = 1; i <= SECTIONS; ++i) {
		populate("sections", 0, "section", i)
	}

	for (i of V.sections) {
		update_keyword("section", i, "selected", V.sections.includes(i))
	}

	for (i = 0; i < V.sections.length; ++i) {
		ui.section_map[i].className = "section map s"+V.sections[i]
		update_rotation("section_map", i, 90*V.section_rotations[i])
	}
	for (i = V.sections.length; i < 4; ++i) {
		ui.section_map[i].className = "section map s0"
	}

	roles[R_FIRST].stat.innerHTML = V.nations[R_FIRST]? V.nations[R_FIRST]: ""
	roles[R_SECOND].stat.innerHTML = V.nations[R_SECOND]? V.nations[R_SECOND]: ""

	action_button("fr", "France")
	action_button("gb", "Great Britain")

	action_button("done", "Done")
	action_button("clear", "Clear")
	action_button("undo", "Undo")
	end_update()
}
