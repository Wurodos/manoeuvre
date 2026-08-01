"use strict"

const R_FIRST = 0
const R_SECOND = 1
const SECTIONS = 24

const ui = {
	map: document.getElementById("map"),
	spaces: document.getElementById("spaces"),
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
	define_panel("#units", "units", 0)
	define_html_thing(ui.spaces, "spaces", 0)

	for (i = 0; i < 4; ++i) {
		define_html_thing("#section-map-"+i, "section_map", i)
			.action()
	}

	for (i = 1; i <= SECTIONS; ++i) {
		define_card("section", i, "s" + i, true)
	}

	for (i = 1; i <= 5; ++i) {
		define_card("card", i, "c" + i, true)
	}

	for (i = 1; i <= 16; ++i) {
		define_piece("unit", i, "u" + i, true)
	}

	for (i = 1; i <= 64; i++) {
		define_thing("mapspace", i)
			.action()
	}
}

function on_update() {
	var i

	begin_update()

	for (i = 1; i <= V.hand.length; ++i) {
		populate("hand", 0, "card", i)

		update_style("card", i, "background-image", `url(${V.hand[i-1].image_id})`)
	}

	for (i = 1; i <= 64; i++) {
	 	populate("spaces", 0, "mapspace", i)
		update_keyword("mapspace", i, "highlight", V.is_space_legal[i-1])
	}

	for (i = 1; i <= V.units[R].length; ++i) {
		const unit = V.units[R][i-1];
		update_style("unit", i, "background-image", `url(${unit.stats.image_id})`)
		
		if (V.active === R)
			update_keyword("unit", i, "selected", i == V.active_unit)

		if (unit.mapspace == -1) {
			populate("units", 0, "unit", i)
		} else {
			populate("mapspace", unit.mapspace, "unit", i)
		}
	}

	for (i = 1; i <= V.units[1-R].length; ++i) {
		const unit = V.units[1-R][i-1];
		update_style("unit", 8+i, "background-image", `url(${unit.stats.image_id})`)

		if (unit.mapspace != -1) {
			populate("mapspace", unit.mapspace, "unit", 8+i)
		}
	}

	


	if (V.border_colors.length === 0) {
		for (i = 1; i <= SECTIONS; ++i) {
			populate("sections", 0, "section", i)
		}
	} else {
		ui.spaces.style.zIndex = 1
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

	ui.map.style.borderColor = V.border_colors

	roles[R_FIRST].stat.innerHTML = V.nations[R_FIRST]? V.nations[R_FIRST]: ""
	roles[R_SECOND].stat.innerHTML = V.nations[R_SECOND]? V.nations[R_SECOND]: ""

	action_button("fr", "France")
	action_button("gb", "Great Britain")

	action_button("north", "North")
	action_button("south", "South")
	action_button("east", "East")
	action_button("west", "West")

	action_button("done", "Done")
	action_button("clear", "Clear")
	action_button("undo", "Undo")
	
	end_update()
}
