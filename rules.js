"use strict"

const R_FIRST = 0
const R_SECOND = 1


// Terrain

const T_CLEAR = 0
const T_HILL = 1
const T_TOWN = 2
const T_FOREST = 3
const T_SWAMP = 4
const T_FIELD = 5
const T_LAKE = 6

// Card Types

const C_REDOUBT = 0
const C_SUPPLY = 1
const C_FORCED_MARCH = 2
const C_WITHDRAW = 3
const C_ENGINEERS_SAPPERS = 4
const C_SPY_SCOUT = 5
const C_LEADER = 6
const C_UNIT = 7
const C_SKIRMISH = 8
const C_REGROUP = 9
const C_AMBUSH = 10
const C_COMMITED_ATTACK = 11
const C_GUERILLA = 12

// Edges

const EDGE_NORTH = 0
const EDGE_EAST = 1
const EDGE_SOUTH = 2
const EDGE_WEST = 3

const UNIT_STARTING_SPACES = {
	[EDGE_NORTH]: Array(64).fill(false).map((_, i) => i < 16),
	[EDGE_SOUTH]: Array(64).fill(false).map((_, i) => i >= 48),
	[EDGE_EAST]: Array(64).fill(false).map((_, i) =>  i % 8 >= 6),
	[EDGE_WEST]: Array(64).fill(false).map((_, i) => i % 8 <= 1)
}



// Nations

const N_FRANCE = "France"
const N_GREAT_BRITAIN = "Great Britain"
const N_RUSSIA = "Russia"
const N_PRUSSIA = "Prussia"
const N_AUSTRIA = "Austria"
const N_SPAIN = "Spain"
const N_OTTOMAN_EMPIRE = "Ottoman Empire"
const N_UNITED_STATES = "United States"

const NATION_COLORS = {
	[N_FRANCE]: "rgb(38, 0, 255)",
	[N_GREAT_BRITAIN]: "rgb(255, 24, 24)"
}

const NATION_SHORT = {
	[N_FRANCE]: "FR",
	[N_GREAT_BRITAIN]: "GB"
}

const ROLES = ["First", "Second"]
const SCENARIOS = []
const state = {}
const procedures = {}


var G, L, R, V = {}
const P = {}

const data = require("./data.js")


P.game = script(`
	call setup
	while true {
		call discard_phase
		call fill_hand
		call move_phase
		call combat_phase
		call restoration_phase
		set G.active 1-G.active
	}
`)

// TODO draft nations
P.setup = script(`
	call pick_boards
	call pick_nations
	call pick_edge

	call fill_hand
	call place_units
	set G.active R_FIRST
	
	call fill_hand
	call place_units


	return
`)

P.restoration_phase = {
	prompt() {
		prompt(`You may restore one unit by playing a card`)
		button("done")
	},

	done() {
		end()
	}
}

P.combat_phase = {
	prompt() {
		prompt(`You may initiate one combat by playing a card`)
		for (let i = 0; i < G.hands[R].length; i++) {
			if (G.hands[R][i].type === C_UNIT)
				action("card", i)
		}
		button("done")
	},

	card(c) {

	},

	done() {
		end()
	}
}

P.move_phase = {
	_begin() {
		L.movement_left = 0
		L.units_left_to_move = 1
	},

	prompt() {
		if (L.units_left_to_move > 0) {
			prompt(`You may move one of your units`)
			for (let i = 1; i <= G.units[R].length; i++) {
				action("unit", i)
			}
		} else {
			// TODO 'Supply' card
			prompt(`Proceed to combat phase`)
		}
		button("done")
	},

	_resume() {
		clear_undo()
		G.units[R][G.active_unit-1].mapspace = L.$
		L.movement_left--

		if (L.movement_left > 0) {
			this.pick_adjacent()
		} else {
			G.active_unit = -1
			G.is_space_legal = Array(64).fill(false)
			L.units_left_to_move--
		}
	},

	unit(u) {
		push_undo()
		G.active_unit = u
		L.movement_left = G.units[R][G.active_unit-1].stats.is_cavalry? 2: 1
		this.pick_adjacent()
	},

	pick_adjacent() {
		G.is_space_legal = Array(64).fill(false)
		for (const adj of get_adjacent_spaces(G.units[R][G.active_unit-1].mapspace)) {
			if (!get_unit_in_space(adj))
				G.is_space_legal[adj-1] = true
		}
		call("pick_legal_space")
	},

	done() {
		end()
	}
}

function get_adjacent_spaces(space) {
	const adj = []
	if (space % 8 != 0) adj.push(space+1)
	if (space % 8 != 1) adj.push(space-1)
	if (space > 8) adj.push(space-8)
	if (space < 57) adj.push(space+8)
	return adj
}

P.discard_phase = {
	prompt() {
		prompt(`You may discard any of your cards`)

		for (let i = 0; i < G.hands[R].length; i++) {
			action("card", i)
		}
		button("done")
	},

	done() {
		end()
	},

	card(c) {
		G.discards[R].push(G.hands[R][c])
		array_delete(G.hands[R], c)
	}
}

P.pick_nations = {
	_begin() {
		L.left_to_pick = [N_FRANCE, N_GREAT_BRITAIN]
	},

	prompt() {
		prompt(`Pick a nation to play as`)
		button("fr", L.left_to_pick.includes(N_FRANCE))
		button("gb", L.left_to_pick.includes(N_GREAT_BRITAIN))
	},

	fr() {
		this.nation(N_FRANCE)
	},

	gb() {
		this.nation(N_GREAT_BRITAIN)
	},

	nation(n) {
		G.nations[R] = n

		G.decks[R] = data.decks[n].slice()
		G.decks[R] = prepare_deck(G.decks[R])

		for (const unit_stats of data.units[n]) {
			G.units[R].push({
				stats: unit_stats,
				is_reduced: false,
				mapspace: -1
			})
		}

		shuffle(G.decks[R])

		array_delete_item(L.left_to_pick, n)

		if (R == R_FIRST) {
			G.active = R_SECOND
		} else {
			end()
		}
	},
}


// Adds necessary copies of cards, makes image URLs
function prepare_deck(deck) {
	const full_deck = []

	for (let c of deck) {
		const card = object_copy(c)
		const copies = card.copies || 1

		if (!card.image_id) 
			card.image_id = get_image_id(card.type)

		card.image_id = "images/Cards" + NATION_SHORT[G.nations[R]] + "/" + card.image_id + ".JPG"

		for (let i = 0; i < copies; i++) {
			full_deck.push(card)
		}
	}

	return full_deck
}

function get_image_id(card_type) {
	switch(card_type) {
		case C_AMBUSH: return "Ambush"
		case C_COMMITED_ATTACK: return "CommitedAttack"
		case C_ENGINEERS_SAPPERS: return "EngineersSappers"
		case C_FORCED_MARCH: return "FMarch"
		case C_GUERILLA: return "Guerilla"
		case C_REDOUBT: return "Redoubt"
		case C_REGROUP: return "Regroup"
		case C_SKIRMISH: return "Skirmish"
		case C_SPY_SCOUT: return "SpyScout"
		case C_SUPPLY: return "Supply"
		case C_WITHDRAW: return "Withdraw"
	}
}

P.pick_edge = {
	
	prompt() {
		prompt(`Pick your starting edge of the map`)
		button("north")
		button("south")
		button("east")
		button("west")
	},

	north() {
		G.starting_edges[R_SECOND] = EDGE_NORTH
		G.starting_edges[R_FIRST] = EDGE_SOUTH
		end()
	},

	south() {
		G.starting_edges[R_SECOND] = EDGE_SOUTH
		G.starting_edges[R_FIRST] = EDGE_NORTH
		end()
	},

	east() {
		G.starting_edges[R_SECOND] = EDGE_EAST
		G.starting_edges[R_FIRST] = EDGE_WEST
		end()
	},

	west() {
		G.starting_edges[R_SECOND] = EDGE_WEST
		G.starting_edges[R_FIRST] = EDGE_EAST
		end()
	},
}

P.place_units = {
	prompt() {
		var all_placed = true
		for (let i = 1; i <= 8; i++) {
			action("unit", i)
			if (G.units[R][i-1].mapspace === -1)
				all_placed = false
		}

		if (all_placed) {
			prompt(`Press "Done" or keep moving units`)
			button("done")
		} else prompt(`Pick unit`)
		
	},

	_resume() {
		const unit = G.units[R][G.active_unit - 1]
		unit.mapspace = L.$
		G.is_space_legal = Array(64).fill(false)
		G.active_unit = -1
	},

	done() {
		clear_undo()
		end()
	},

	unit(u) {
		G.active_unit = u

		G.is_space_legal = UNIT_STARTING_SPACES[G.starting_edges[G.active]].map((legal, i) => legal && !get_unit_in_space(i+1))
		call("pick_legal_space")
	},
}

function get_unit_in_space(space) {
	for (let i = 0; i < G.units[R_FIRST].length; i++) {
		const unit = G.units[R_FIRST][i];
		if (unit.mapspace === space) return unit
	}

	for (let i = 0; i < G.units[R_SECOND].length; i++) {
		const unit = G.units[R_SECOND][i];
		if (unit.mapspace === space) return unit
	}

	return null
}

P.pick_legal_space = {
	prompt() {
		prompt(`Pick space`)

		for (let i = 1; i <= 64; i++) {
			if (G.is_space_legal[i-1])
				action("mapspace", i)
		}
	},

	mapspace(m) {
		end(m)
	}
}

P.fill_hand = function() {
	
	while (G.hands[G.active].length < 5) {
		if (G.decks[G.active].length == 0) {
			G.has_reshuffled[G.active] = true
			G.decks[G.active] = G.discard[G.active]
			G.discard[G.active] = []
			shuffle(G.decks[G.active])
		}
		G.hands[G.active].push(G.decks[G.active].pop())
	}

	end()
}

P.pick_boards = {
	prompt() {
		prompt(`Pick 4 sections (${4 - G.sections.length} left). You can rotate them by left-clicking`)

		if (G.sections.length < 4) {
			for (let i = 0; i < 24; i++) 
				if (!G.sections.includes(i))
					action("section", i)
		}

		for (let i = 0; i < 4; i++) {
			action("section_map", i)
		}

		button("clear", G.sections.length > 0)
		button("done", G.sections.length == 4)
	},

	done() {
		clear_undo()
		end()
	},

	clear() {
		push_undo()
		G.sections = []
		G.section_rotations = [0,0,0,0]
	},

	section_map(s) {
		push_undo()
		G.section_rotations[s]++;
		if (G.section_rotations[s] > 3)
			G.section_rotations[s] = 0
	},

	section(s) {
		push_undo()

		if (!G.sections.includes(s))
			G.sections.push(s)
	}
}


function on_setup(scenario, options) {
	G.active = R_FIRST

	G.has_reshuffled = [false, false]

	G.sections = []
	G.section_rotations = [0,0,0,0]
	G.nations = [null, null]
	G.hands = [[],[]]
	G.decks = [[],[]]
	G.discards = [[],[]]
	G.units = [[],[]]
	G.dead_units = [[],[]]

	G.active_unit = -1
	G.starting_edges = [-1,-1]

	G.is_space_legal = Array(64).fill(false)

	call("game")
}


function on_static_view() {}



function on_view() {
	V.active = G.active

	V.sections = G.sections
	V.section_rotations = G.section_rotations

	V.starting_edges = G.starting_edges
	V.nations = G.nations
	V.border_colors = ""
	
	if (G.starting_edges[0] > -1) {
		var colors = Array(4).fill("rgb(0,0,0,0)")
		colors[G.starting_edges[R_FIRST]] = NATION_COLORS[G.nations[R_FIRST]]
		colors[G.starting_edges[R_SECOND]] = NATION_COLORS[G.nations[R_SECOND]]
		
		
		for (var i = 0; i < 4; i++) {
			V.border_colors += colors[i] + " "
		}
	}

	V.hand = G.hands[R]
	V.units = G.units
	V.active_unit = G.active_unit

	if (R === G.active && G.is_space_legal) {
		V.is_space_legal = G.is_space_legal
	} else {
		V.is_space_legal = Array(64).fill(false)
	}// V.units_on_board = G.units.filter(unit => unit.row != -1)
}



function on_query(q) {}
function on_assert() {}


function log(s) {
	if (s === undefined) {
		if (G.log.length > 0 && G.log[G.log.length - 1] !== "")
			G.log.push("")
	} else {
		G.log.push(s)
	}
}

function prompt(s) {
	V.prompt = s
}

function button(action, enabled = true) {
	V.actions[action] = !!enabled | 0
}

function action(action, argument) {
	if (!(action in V.actions))
		V.actions[action] = []
	set_add(V.actions[action], argument)
}

function finish(result, message) {
	G.active = -1
	G.result = ROLES[result] ?? result
	G.L = L = { message }
	log()
	log(message)
}

function call_or_goto(pred, name, env) {
	if (pred)
		call(name, env)
	else
		goto(name, env)
}

function call(name, env) {
	G.L = L = { ...env, P: name, I: 0, L: L }
	P[name]?._begin?.()
}

function goto(name, env) {
	P[L.P]?._end?.()
	G.L = L = { ...env, P: name, I: 0, L: L.L }
	P[name]?._begin?.()
}

function end(result) {
	P[L.P]?._end?.()
	G.L = L = L.L
	if (result !== undefined)
		L.$ = result
	P[L.P]?._resume?.()
}

function resume() {
	P[L.P]?._resume?.()
}

exports.roles ??= ROLES

exports.scenarios ??= (typeof SCENARIOS !== "undefined") ? SCENARIOS : [ "Standard" ]

exports.setup = function (seed, scenario, options) {
	G = {
		active: null,
		seed,
		log: [],
		undo: [],
	}
	L = null
	R = null
	V = null

	on_setup(scenario, options)
	_run()
	_save()

	return G
}

exports.view = function (state, role) {
	G = state
	L = G.L
	R = role
	V = {
		log: G.log,
		prompt: null,
	}

	if ((Array.isArray(G.active) && G.active.includes(R)) || G.active === R) {
		_load()
		on_view()

		V.actions = {}

		if (P[L.P])
			P[L.P].prompt()
		else
			V.prompt = "TODO: " + L.P

		if (V.actions.undo === undefined)
			button("undo", G.undo?.length > 0)

		_save()
	} else {
		_load()
		on_view()
		_save()

		if (G.active === "None") {
			V.prompt = L.message
		} else {
			var inactive = P[L.P]?.inactive
			if (inactive) {
				if (Array.isArray(G.active))
					V.prompt = `Waiting for ${G.active.join(" and ")} to ${inactive}.`
				else
					V.prompt = `Waiting for ${G.active} to ${inactive}.`
			} else {
				if (Array.isArray(G.active))
					V.prompt = `Waiting for ${G.active.join(" and ")}.`
				else
					V.prompt = `Waiting for ${G.active}.`
			}
		}
	}

	return V
}

exports.action = function (state, role, action, argument) {
	G = state
	L = G.L
	R = role
	V = null

	var old_active = G.active

	_load()

	var this_state = P[L.P]
	if (this_state && typeof this_state[action] === "function") {
		this_state[action](argument)
		_run()
	} else if (action === "undo" && G.undo.length > 0) {
		pop_undo()
	} else {
		throw new Error("Invalid action: " + action)
	}

	_save()

	if (old_active !== G.active)
		clear_undo()

	return G
}

exports.finish = function (state, result, message) {
	G = state
	L = G.L
	R = null
	V = null

	_load()
	finish(result, message)
	_save()

	return G
}

function _load() {
	R = ROLES.indexOf(R)
	if (Array.isArray(G.active))
		G.active = G.active.map(r => ROLES.indexOf(r))
	else
		G.active = ROLES.indexOf(G.active)
}

function _save() {
	if (Array.isArray(G.active))
		G.active = G.active.map(r => ROLES[r])
	else
		G.active = ROLES[G.active] ?? "None"
}

function _run() {
	for (var i = 0; i < 1000 && L; ++i) {
		var prog = P[L.P]
		if (typeof prog === "function") {
			prog()
		} else if (Array.isArray(prog)) {
			if (L.I < prog.length) {
				try {
					prog[L.I++]()
				} catch (err) {
					err.message += "\n\tat P." + L.P + ":" + L.I
					throw err
				}
			} else {
				end()
			}
		} else {
			return // state
		}
	}
	if (L)
		throw new Error("runaway script")
}

function _parse(text) {
	var prog = []

	function lex(s) {
		var words = []
		var p = 0, n = s.length, m

		function lex_flush() {
			if (words.length > 0) {
				command(words)
				words = []
			}
		}

		function lex_newline() {
			while (p < n && s[p] === "\n")
				++p
			lex_flush()
		}

		function lex_semi() {
			++p
			lex_flush()
		}

		function lex_comment() {
			while (p < n && s[p] !== "\n")
				++p
		}

		function lex_word() {
			while (p < n && !" \t\n".includes(s[p]))
				++p
			words.push(s.substring(m, p))
		}

		function lex_qstring(q) {
			var x = 1
			++p
			while (p < n && x > 0) {
				if (s[p] === q)
					--x
				++p
			}
			if (p >= n && x > 0)
				throw new Error("unterminated string")
			words.push(s.substring(m, p))
		}

		function lex_bstring(a, b) {
			var x = 1
			++p
			while (p < n && x > 0) {
				if (s[p] === a)
					++x
				else if (s[p] === b)
					--x
				++p
			}
			if (p >= n && x > 0)
				throw new Error("unterminated string")
			words.push(s.substring(m, p))
		}

		while (p < n) {
			while (s[p] === " " || s[p] === "\t")
				++p
			if (p >= n) break
			m = p
			if (s[p] === "{") lex_bstring("{", "}")
			else if (s[p] === "[") lex_bstring("[", "]")
			else if (s[p] === "(") lex_bstring("(", ")")
			else if (s[p] === '"') lex_qstring('"')
			else if (s[p] === "\n") lex_newline()
			else if (s[p] === ";") lex_semi()
			else if (s[p] === "#") lex_comment()
			else if (s[p] === "/" && s[p+1] === "/") lex_comment()
			else if (s[p] === "-" && s[p+1] === "-") lex_comment()
			else lex_word()
		}

		if (words.length > 0)
			command(words)
	}

	function command(line) {
		var ix_loop, ix1, ix2
		var i, k, start, end, array, body

		switch (line[0]) {
		case "set":
			if (line.length !== 3)
				throw new Error("invalid set - " + line.join(" "))
			emit(line[1] + " = " + line[2])
			break

		case "incr":
			if (line.length !== 2)
				throw new Error("invalid incr - " + line.join(" "))
			emit("++(" + line[1] + ")")
			break

		case "decr":
			if (line.length !== 2)
				throw new Error("invalid decr - " + line.join(" "))
			emit("--(" + line[1] + ")")
			break

		case "eval":
			emit(line.slice(1).join(" "))
			break

		case "log":
			emit("log(" + line.slice(1).join(" ") + ")")
			break

		case "call":
			if (line.length === 3)
				emit("call(" + quote(line[1]) + ", " + line[2] + ")")
			else if (line.length === 2)
				emit("call(" + quote(line[1]) + ")")
			else
				throw new Error("invalid call - " + line.join(" "))
			break

		case "goto":
			if (line.length === 3)
				emit("goto(" + quote(line[1]) + ", " + line[2] + ")")
			else if (line.length === 2)
				emit("goto(" + quote(line[1]) + ")")
			else
				throw new Error("invalid goto - " + line.join(" "))
			break

		case "return":
			if (line.length === 1)
				emit(`end()`)
			else if (line.length === 2)
				emit(`end(${line[1]})`)
			else
				throw new Error("invalid return - " + line.join(" "))
			break

		case "while":
			// while (exp) { block }
			if (line.length !== 3)
				throw new Error("invalid while - " + line.join(" "))
			ix_loop = emit_jz(line[1])
			block(line[2])
			emit_jump(ix_loop)
			label(ix_loop)
			break

		case "for":
			// for i in (start) to (end) { block }
			if (line.length === 7 && line[2] === "in" && line[4] === "to") {
				i = line[1]
				start = line[3]
				end = line[5]
				body = line[6]
				emit(`${i} = ${start}`)
				ix_loop = prog.length
				block(body)
				emit(`if ((${i}) < ${end}) { ++(${i}); L.I = ${ix_loop} }`)
				return
			}
			// for i in (array) { block }
			// NOTE: array is evaluated repeatedly so should be a constant!
			else if (line.length === 5 && line[2] === "in") {
				k = line[1]
				i = k.replace(/^G\./, "L.G_") + "_"
				array = line[3]
				body = line[4]
				emit(`${i} = 0`)
				ix_loop = emit(`if (${i} < ${array}.length) { ${k} = ${array}[${i}++] } else { delete ${i} ; L.I = @ }`)
				block(body)
				emit_jump(ix_loop)
				label(ix_loop)
			} else {
				throw new Error("invalid for - " + line.join(" "))
			}
			break

		case "if":
			// if (exp) { block}
			// if (exp) { block } else { block }
			// TODO: if (exp) { block } elseif (exp) { block } else { block }
			ix1, ix2
			if (line.length === 3) {
				ix1 = emit_jz(line[1])
				block(line[2])
				label(ix1)
			} else if (line.length === 5 && line[3] === "else") {
				ix1 = emit_jz(line[1])
				block(line[2])
				ix2 = emit_jump()
				label(ix1)
				block(line[4])
				label(ix2)
			} else {
				throw new Error("invalid if - " + line.join(" "))
			}
			break

		default:
			throw new Error("unknown command - " + line.join(" "))
		}
	}

	function quote(s) {
		if ("{[(`'\"".includes(s[0]))
			return s
		return '"' + s + '"'
	}

	function emit_jz(exp, to = "@") {
		return emit("if (!(" + exp + ")) L.I = " + to)
	}

	function emit_jump(to = "@") {
		return emit("L.I = " + to)
	}

	function emit(s) {
		prog.push(s)
		return prog.length - 1
	}

	function label(ix) {
		prog[ix] = prog[ix].replace("@", prog.length)
	}

	function block(body) {
		if (body[0] !== "{")
			throw new Error("expected block")
		lex(body.slice(1, -1))
	}

	lex(text)

	return prog
}

function script(text) {
	return text
}

(function _compile() {
	var cache = {}
	for (var name in P) {
		if (typeof P[name] === "string") {
			var prog = []
			try {
				for (var inst of _parse(P[name])) {
					try {
						prog.push(cache[inst] ??= eval("(function(){" + inst + "})"))
					} catch (err) {
						err.message += "\n\tat (" + inst + ")"
						throw err
					}
				}
			} catch (err) {
				err.message += "\n\tat P." + name
				throw err
			}
			P[name] = prog
		}
	}
})()

/* LIBRARY */

function clear_undo() {
	if (G.undo) {
		G.undo.length = 0
	}
}

function push_undo() {
	var copy, k, v
	if (G.undo) {
		copy = {}
		for (k in G) {
			v = G[k]
			if (k === "undo")
				continue
			else if (k === "log")
				v = v.length
			else if (typeof v === "object" && v !== null)
				v = object_copy(v)
			copy[k] = v
		}
		G.undo.push(copy)
	}
}

function pop_undo() {
	if (G.undo) {
		var save_log = G.log
		var save_undo = G.undo
		G = save_undo.pop()
		save_log.length = G.log
		G.log = save_log
		G.undo = save_undo
	}
}

function random(range) {
	// An MLCG using integer arithmetic with doubles.
	// https://www.ams.org/journals/mcom/1999-68-225/S0025-5718-99-00996-5/S0025-5718-99-00996-5.pdf
	// m = 2**35 − 31
	return (G.seed = G.seed * 200105 % 34359738337) % range
}

function random_bigint(range) {
	// Largest MLCG that will fit its state in a double.
	// Uses BigInt for arithmetic, so is an order of magnitude slower.
	// https://www.ams.org/journals/mcom/1999-68-225/S0025-5718-99-00996-5/S0025-5718-99-00996-5.pdf
	// m = 2**53 - 111
	return (G.seed = Number(BigInt(G.seed) * 5667072534355537n % 9007199254740881n)) % range
}

function shuffle(list) {
	// Fisher-Yates shuffle
	var i, j, tmp
	for (i = list.length - 1; i > 0; --i) {
		j = random(i + 1)
		tmp = list[j]
		list[j] = list[i]
		list[i] = tmp
	}
}

function shuffle_bigint(list) {
	// Fisher-Yates shuffle
	var i, j, tmp
	for (i = list.length - 1; i > 0; --i) {
		j = random_bigint(i + 1)
		tmp = list[j]
		list[j] = list[i]
		list[i] = tmp
	}
}

// Fast deep copy for objects without cycles
function object_copy(original) {
	var copy, i, n, v
	if (Array.isArray(original)) {
		n = original.length
		copy = new Array(n)
		for (i = 0; i < n; ++i) {
			v = original[i]
			if (typeof v === "object" && v !== null)
				copy[i] = object_copy(v)
			else
				copy[i] = v
		}
		return copy
	} else {
		copy = {}
		for (i in original) {
			v = original[i]
			if (typeof v === "object" && v !== null)
				copy[i] = object_copy(v)
			else
				copy[i] = v
		}
		return copy
	}
}

// Fast deep object comparison for objects without cycles
function object_diff(a, b) {
	var i, key
	var a_length
	if (a === b)
		return false
	if (a !== null && b !== null && typeof a === "object" && typeof b === "object") {
		if (Array.isArray(a)) {
			if (!Array.isArray(b))
				return true
			a_length = a.length
			if (b.length !== a_length)
				return true
			for (i = 0; i < a_length; ++i)
				if (object_diff(a[i], b[i]))
					return true
			return false
		}
		for (key in a)
			if (object_diff(a[key], b[key]))
				return true
		for (key in b)
			if (!(key in a))
				return true
		return false
	}
	return true
}

// Array remove and insert (faster than splice)

function array_delete(array, index) {
	var i, n = array.length
	for (i = index + 1; i < n; ++i)
		array[i - 1] = array[i]
	array.length = n - 1
}

function array_delete_item(array, item) {
	var i, n = array.length
	for (i = 0; i < n; ++i)
		if (array[i] === item)
			return array_delete(array, i)
}

function array_insert(array, index, item) {
	for (var i = array.length; i > index; --i)
		array[i] = array[i - 1]
	array[index] = item
}

function array_delete_pair(array, index) {
	var i, n = array.length
	for (i = index + 2; i < n; ++i)
		array[i - 2] = array[i]
	array.length = n - 2
}

function array_insert_pair(array, index, key, value) {
	for (var i = array.length; i > index; i -= 2) {
		array[i] = array[i-2]
		array[i+1] = array[i-1]
	}
	array[index] = key
	array[index+1] = value
}

// Set as plain sorted array

function set_clear(set) {
	set.length = 0
}

function set_has(set, item) {
	var a = 0
	var b = set.length - 1
	while (a <= b) {
		var m = (a + b) >> 1
		var x = set[m]
		if (item < x)
			b = m - 1
		else if (item > x)
			a = m + 1
		else
			return true
	}
	return false
}

function set_add(set, item) {
	var a = 0
	var b = set.length - 1
	// optimize fast case of appending items in order
	if (item > set[b]) {
		set[b+1] = item
		return
	}
	while (a <= b) {
		var m = (a + b) >> 1
		var x = set[m]
		if (item < x)
			b = m - 1
		else if (item > x)
			a = m + 1
		else
			return
	}
	array_insert(set, a, item)
}

function set_delete(set, item) {
	var a = 0
	var b = set.length - 1
	while (a <= b) {
		var m = (a + b) >> 1
		var x = set[m]
		if (item < x)
			b = m - 1
		else if (item > x)
			a = m + 1
		else {
			array_delete(set, m)
			return
		}
	}
}

function set_toggle(set, item) {
	var a = 0
	var b = set.length - 1
	while (a <= b) {
		var m = (a + b) >> 1
		var x = set[m]
		if (item < x)
			b = m - 1
		else if (item > x)
			a = m + 1
		else {
			array_delete(set, m)
			return
		}
	}
	array_insert(set, a, item)
}

// Map as plain sorted array of key/value pairs

function map_clear(map) {
	map.length = 0
}

function map_has(map, key) {
	var a = 0
	var b = (map.length >> 1) - 1
	while (a <= b) {
		var m = (a + b) >> 1
		var x = map[m<<1]
		if (key < x)
			b = m - 1
		else if (key > x)
			a = m + 1
		else
			return true
	}
	return false
}

function map_get(map, key, missing) {
	var a = 0
	var b = (map.length >> 1) - 1
	while (a <= b) {
		var m = (a + b) >> 1
		var x = map[m<<1]
		if (key < x)
			b = m - 1
		else if (key > x)
			a = m + 1
		else
			return map[(m<<1)+1]
	}
	return missing
}

function map_set(map, key, value) {
	var a = 0
	var b = (map.length >> 1) - 1
	while (a <= b) {
		var m = (a + b) >> 1
		var x = map[m<<1]
		if (key < x)
			b = m - 1
		else if (key > x)
			a = m + 1
		else {
			map[(m<<1)+1] = value
			return
		}
	}
	array_insert_pair(map, a<<1, key, value)
}

function map_delete(map, key) {
	var a = 0
	var b = (map.length >> 1) - 1
	while (a <= b) {
		var m = (a + b) >> 1
		var x = map[m<<1]
		if (key < x)
			b = m - 1
		else if (key > x)
			a = m + 1
		else {
			array_delete_pair(map, m<<1)
			return
		}
	}
}

function map_get_set(map, key) {
	var set = map_get(map, key, null)
	if (set === null)
		map_set(map, key, (set = []))
	return set
}

function map_for_each(map, f) {
	for (var i = 0; i < map.length; i += 2)
		f(map[i], map[i+1])
}

// same as Object.groupBy
function object_group_by(items, callback) {
	var item, key
	var groups = {}
	if (typeof callback === "function") {
		for (item of items) {
			key = callback(item)
			if (key in groups)
				groups[key].push(item)
			else
				groups[key] = [ item ]
		}
	} else {
		for (item of items) {
			key = item[callback]
			if (key in groups)
				groups[key].push(item)
			else
				groups[key] = [ item ]
		}
	}
	return groups
}

// like Object.groupBy but for plain array maps
function map_group_by(items, callback) {
	var item, key, arr
	var groups = []
	if (typeof callback === "function") {
		for (item of items) {
			key = callback(item)
			arr = map_get(groups, key)
			if (arr)
				arr.push(item)
			else
				map_set(groups, key, [ item ])
		}
	} else {
		for (item of items) {
			key = item[callback]
			arr = map_get(groups, key)
			if (arr)
				arr.push(item)
			else
				map_set(groups, key, [ item ])
		}
	}
	return groups
}
