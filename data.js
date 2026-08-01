
// Terrain

const T_CLEAR = 0
const T_HILL = 1
const T_TOWN = 2
const T_FOREST = 3
const T_SWAMP = 4
const T_FIELD = 5
const T_LAKE = 6

// Nations

const N_FRANCE = "France"
const N_GREAT_BRITAIN = "Great Britain"
const N_RUSSIA = "Russia"
const N_PRUSSIA = "Prussia"
const N_AUSTRIA = "Austria"
const N_SPAIN = "Spain"
const N_OTTOMAN_EMPIRE = "Ottoman Empire"
const N_UNITED_STATES = "United States"

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

// Units FRANCE
const FR_IMPERIAL_GD = "GdImp"
const FR_GD_CAV = "GdCav"
const FR_45_REG = "45Reg"
const FR_19_REG = "19Reg"
const FR_8_REG = "8Reg"
const FR_4_REG = "4Reg"
const FR_2_REG = "2Reg"
const FR_CUIR = "Cuir"


// Units GREAT BRITAIN
const GB_1_FOOT = "1Foot"
const GB_KING_DRG = "KDrg"
const GB_4_FOOT = "4Foot"
const GB_9_QUEEN = "QnRoy"
const GB_32_FOOT = "32Foot"
const GB_42_FOOT = "42Foot"
const GB_52_FOOT = "52Foot"
const GB_DUTCH = "Dutch"




const data = module.exports = {
    units: {
        [N_FRANCE]: [
            {
                name: "Imperial Guard",
                id: FR_IMPERIAL_GD,
                image_id: "images/UnitsFR/GdImp.png",
                strength_full: 8,
                strength_reduced: 5,
            },
            {
                name: "Guard Cavalry",
                id: FR_GD_CAV,
                image_id: "images/UnitsFR/GdCav.png",
                strength_full: 8,
                strength_reduced: 5,
                is_cavalry: true
            },
            {
                name: "45th Regiment Legere",
                image_id: "images/UnitsFR/45Reg.png",
                id: FR_45_REG,
                strength_full: 6,
                strength_reduced: 3,
            },
            {
                name: "19th Regiment Legere",
                id: FR_19_REG,
                image_id: "images/UnitsFR/19Reg.png",
                strength_full: 7,
                strength_reduced: 4,
            },
            {
                name: "8th Regiment Legere",
                id: FR_8_REG,
                image_id: "images/UnitsFR/8Reg.png",
                strength_full: 6,
                strength_reduced: 3,
            },
            {
                name: "4th Regiment Suisse",
                id: FR_4_REG,
                image_id: "images/UnitsFR/4Reg.png",
                strength_full: 5,
                strength_reduced: 3,
            },
            {
                name: "2nd Regiment Legere",
                id: FR_2_REG,
                image_id: "images/UnitsFR/2Reg.png",
                strength_full: 6,
                strength_reduced: 3,
            },
            {
                name: "1st Cuirassiers",
                id: FR_CUIR,
                image_id: "images/UnitsFR/Cuir.png",
                strength_full: 7,
                strength_reduced: 4,
                is_cavalry: true
            },
        ],
        [N_GREAT_BRITAIN]: [
            {
                name: "1st Foot Guards",
                id: GB_1_FOOT,
                image_id: "images/UnitsGB/1Foot.png",
                strength_full: 8,
                strength_reduced: 4,
            },
            {
                name: "King's Dragoons Guards",
                id: GB_KING_DRG,
                image_id: "images/UnitsGB/KDrg.png",
                strength_full: 8,
                strength_reduced: 4,
                is_cavalry: true
            },
            {
                name: "4th Regiment of Foot",
                id: GB_4_FOOT,
                image_id: "images/UnitsGB/4Foot.png",
                strength_full: 7,
                strength_reduced: 3,
            },
            {
                name: "9th Queen's Royal Guards",
                id: GB_9_QUEEN,
                image_id: "images/UnitsGB/QnRoy.png",
                strength_full: 7,
                strength_reduced: 3,
                is_cavalry: true
            },
            {
                name: "32nd Regiment of Foot",
                image_id: "images/UnitsGB/32Foot.png",
                id: GB_32_FOOT,
                strength_full: 6,
                strength_reduced: 3,
            },
            {
                name: "42nd Regiment of Foot",
                id: GB_42_FOOT,
                image_id: "images/UnitsGB/42Foot.png",
                strength_full: 6,
                strength_reduced: 4,
            },
            {
                name: "52nd Regiment of Foot",
                id: GB_52_FOOT,
                image_id: "images/UnitsGB/52Foot.png",
                strength_full: 6,
                strength_reduced: 3,
            },
            {
                name: "Dutch-Belgians",
                id: GB_DUTCH,
                image_id: "images/UnitsGB/Dutch.png",
                strength_full: 5,
                strength_reduced: 3,
            },
        ]
    },
    // 1 copy of a card if "copies" not specified
    decks: {
        [N_FRANCE]: [
            { type: C_SKIRMISH },
            { type: C_FORCED_MARCH, copies: 3},
            { type: C_REDOUBT},
            { type: C_ENGINEERS_SAPPERS},
            { type: C_SUPPLY, copies: 4},
            { type: C_WITHDRAW, copies: 4},
            { 
                type: C_LEADER,
                image_id: "Ney",
                name: "Michel Ney",
                command: 2,
                combat: 4,
                rally: 5,
            },
            { 
                type: C_LEADER,
                image_id: "Murat",
                name: "Joachim Murat",
                command: 2,
                combat: 3,
                rally: 5,
                pursuit: 1
            },
            { 
                type: C_LEADER,
                image_id: "Davout",
                name: "Louis Nicolas Davout",
                command: 4,
                combat: 5,
                rally: 3,
            },
            { 
                type: C_LEADER,
                image_id: "Lannes",
                name: "Jean Lannes",
                command: 2,
                combat: 2,
                rally: 5,
            },
            { 
                type: C_LEADER,
                image_id: "Soult",
                name: "Nicolas Soult",
                command: 3,
                combat: 3,
                rally: 3,
            },
            { 
                type: C_LEADER,
                image_id: "Napoleon",
                name: "Napoleon Bonaparte",
                command: 4,
                combat: 5,
                rally: 5,
                grand_battery: true
            },
            {
                type: C_UNIT,
                image_id: "ImpGd1",
                unit: FR_IMPERIAL_GD,
                defense: 8,
                range: 2,
                bombard: [2,6],
            },
            {
                type: C_UNIT,
                image_id: "ImpGd2",
                unit: FR_IMPERIAL_GD,
                attack: [2,8],
                defense: 7,
                option_not_advance: true,
                copies: 4
            },
            {
                type: C_UNIT,
                image_id: "GdCav1",
                unit: FR_GD_CAV,
                attack: [2,10],
                defense: 4,
                pursuit: 4,
                option_not_advance: true,
            },
            {
                type: C_UNIT,
                image_id: "GdCav2",
                unit: FR_GD_CAV,
                attack: [2,8],
                defense: 4,
                pursuit: 4,
                option_not_advance: true,
                copies: 3
            },
            {
                type: C_UNIT,
                image_id: "GdCav3",
                unit: FR_GD_CAV,
                defense: 6,
                range: 2,
                bombard: [2,6],
            },
            {
                type: C_UNIT,
                image_id: "45Reg1",
                unit: FR_45_REG,
                attack: [2,6],
                defense: 6,
            },
            {
                type: C_UNIT,
                image_id: "45Reg2",
                unit: FR_45_REG,
                attack: [2,6],
                defense: 5,
                copies: 3
            },
            {
                type: C_UNIT,
                image_id: "45Reg3",
                unit: FR_45_REG,
                defense: 6,
                range: 2,
                bombard: [1,10],
            },
            {
                type: C_UNIT,
                image_id: "19Reg1",
                unit: FR_19_REG,
                attack: [2,8],
                defense: 6,
            },
            {
                type: C_UNIT,
                image_id: "19Reg2",
                unit: FR_19_REG,
                attack: [2,6],
                defense: 6,
            },
            {
                type: C_UNIT,
                image_id: "19Reg3",
                unit: FR_19_REG,
                attack: [2,6],
                defense: 5,
                copies: 2
            },
            {
                type: C_UNIT,
                image_id: "19Reg4",
                unit: FR_19_REG,
                defense: 6,
                range: 2,
                bombard: [1,10],
            },
            {
                type: C_UNIT,
                image_id: "8Reg1",
                unit: FR_8_REG,
                attack: [2,8],
                defense: 6,
            },
            {
                type: C_UNIT,
                image_id: "8Reg2",
                unit: FR_8_REG,
                attack: [2,6],
                defense: 6,
            },
            {
                type: C_UNIT,
                image_id: "8Reg3",
                unit: FR_8_REG,
                attack: [2,6],
                defense: 4,
                copies: 2
            },
            {
                type: C_UNIT,
                image_id: "8Reg4",
                unit: FR_8_REG,
                defense: 5,
                range: 2,
                bombard: [1,10],
            },
            {
                type: C_UNIT,
                image_id: "4Reg1",
                unit: FR_4_REG,
                attack: [2,8],
                defense: 6,
                copies: 2
            },
            {
                type: C_UNIT,
                image_id: "4Reg2",
                unit: FR_4_REG,
                attack: [2,6],
                defense: 5,
            },
            {
                type: C_UNIT,
                image_id: "4Reg3",
                unit: FR_4_REG,
                attack: [2,6],
                defense: 4,
            },
            {
                type: C_UNIT,
                image_id: "4Reg4",
                unit: FR_4_REG,
                defense: 6,
                range: 2,
                bombard: [1,10],
            },
            {
                type: C_UNIT,
                image_id: "2Reg1",
                unit: FR_2_REG,
                attack: [2,6],
                defense: 6,
                copies: 2
            },
            {
                type: C_UNIT,
                image_id: "2Reg2",
                unit: FR_2_REG,
                attack: [2,6],
                defense: 5,type: C_UNIT,
                image_id: "GdCav2",
                unit: FR_GD_CAV,
                attack: [2,8],
                defense: 4,
                pursuit: 4,
                option_not_advance: true,
                copies: 3
            },
            {
                type: C_UNIT,
                image_id: "2Reg3",
                unit: FR_2_REG,
                attack: [2,6],
                defense: 3,
            },
            {
                type: C_UNIT,
                image_id: "2Reg4",
                unit: FR_2_REG,
                defense: 6,
                range: 2,
                bombard: [1,10],
            },
            {
                type: C_UNIT,
                image_id: "Cuir1",
                unit: FR_CUIR,
                attack: [2,10],
                defense: 3,
                pursuit: 4,
                copies: 2
            },
            {
                type: C_UNIT,
                image_id: "Cuir2",
                unit: FR_CUIR,
                attack: [2,6],
                defense: 3,
                pursuit: 3,
                copies: 2
            },
            {
                type: C_UNIT,
                image_id: "Cuir3",
                unit: FR_CUIR,
                defense: 5,
                range: 2,
                bombard: [1,10]
            },
        ],
        [N_GREAT_BRITAIN]: [
            {type: C_COMMITED_ATTACK},
            {type: C_FORCED_MARCH, copies: 2},
            {type: C_REDOUBT, copies: 2},
            {type: C_ENGINEERS_SAPPERS},
            {type: C_SKIRMISH},
            {type: C_SPY_SCOUT},
            {type: C_SUPPLY, copies: 4},
            {type: C_WITHDRAW, copies: 3},
            { 
                type: C_LEADER,
                image_id: "Wellington",
                name: "Lord Wellington",
                command: 4,
                combat: 5,
                rally: 4,
            },
            { 
                type: C_LEADER,
                image_id: "Hill",
                name: "Rowland Hill",
                command: 2,
                combat: 1,
                rally: 4,
            },
            { 
                type: C_LEADER,
                image_id: "Uxbridge",
                name: "Earl of Uxbridge",
                command: 2,
                combat: 1,
                rally: 4,
                pursuit: 1,
            },
            { 
                type: C_LEADER,
                image_id: "Moore",
                name: "Sir John Moore",
                command: 3,
                combat: 4,
                rally: 4,
            },
            { 
                type: C_LEADER,
                image_id: "Beresford",
                name: "William Beresford",
                command: 3,
                combat: 3,
                rally: 3,
            },
            {
                type: C_UNIT,
                image_id: "1Foot1",
                unit: GB_1_FOOT,
                attack: [2,8],
                defense: 6,
                option_not_advance : true,
                copies: 2
            },
            {
                type: C_UNIT,
                image_id: "1Foot2",
                unit: GB_1_FOOT,
                attack: [2,8],
                defense: 5,
                option_not_advance : true,
                copies: 2
            },
            {
                type: C_UNIT,
                image_id: "1Foot3",
                unit: GB_1_FOOT,
                defense: 7,
                range: 2,
                bombard: [2,6]
            },
            {
                type: C_UNIT,
                image_id: "4Foot1",
                unit: GB_4_FOOT,
                attack: [2,8],
                defense: 5,
                copies: 3
            },
            {
                type: C_UNIT,
                image_id: "4Foot1",
                unit: GB_4_FOOT,
                attack: [1,10],
                defense: 3,
            },
            {
                type: C_UNIT,
                image_id: "4Foot1",
                unit: GB_4_FOOT,
                defense: 7,
                range: 2,
                bombard: [1,10]
            },
            {
                type: C_UNIT,
                image_id: "9Queen1",
                unit: GB_9_QUEEN,
                attack: [2,8],
                defense: 6,
                pursuit: 3,
                copies: 3
            },
            {
                type: C_UNIT,
                image_id: "9Queen2",
                unit: GB_9_QUEEN,
                attack: [2,8],
                defense: 6,
                pursuit: 4,
            },
            {
                type: C_UNIT,
                image_id: "9Queen3",
                unit: GB_9_QUEEN,
                defense: 7,
                range: 2,
                bombard: [1,10]
            },
            {
                type: C_UNIT,
                image_id: "32Foot1",
                unit: GB_32_FOOT,
                attack: [2,8],
                defense: 6,
                copies: 2
            },
            {
                type: C_UNIT,
                image_id: "32Foot2",
                unit: GB_32_FOOT,
                attack: [2,6],
                defense: 5,
            },
            {
                type: C_UNIT,
                image_id: "32Foot3",
                unit: GB_32_FOOT,
                attack: [1,10],
                defense: 3,
            },
            {
                type: C_UNIT,
                image_id: "32Foot4",
                unit: GB_32_FOOT,
                defense: 7,
                range: 2,
                bombard: [1,10]
            },

            {
                type: C_UNIT,
                image_id: "42Foot1",
                unit: GB_42_FOOT,
                attack: [2,8],
                defense: 6,
            },
            {
                type: C_UNIT,
                image_id: "42Foot2",
                unit: GB_42_FOOT,
                attack: [2,6],
                defense: 5,
                copies: 2
            },
            {
                type: C_UNIT,
                image_id: "42Foot3",
                unit: GB_42_FOOT,
                attack: [2,6],
                defense: 6,
                range: 1,
                bombard: [2,8]
            },
            {
                type: C_UNIT,
                image_id: "42Foot4",
                unit: GB_42_FOOT,
                defense: 6,
                range: 2,
                bombard: [1,10]
            },

            {
                type: C_UNIT,
                image_id: "52Foot1",
                unit: GB_52_FOOT,
                attack: [2,8],
                defense: 5,
                copies: 2
            },
            {
                type: C_UNIT,
                image_id: "52Foot2",
                unit: GB_52_FOOT,
                attack: [1,10],
                defense: 3,
            },
            {
                type: C_UNIT,
                image_id: "52Foot3",
                unit: GB_52_FOOT,
                attack: [1,10],
                defense: 4,
                range: 1,
                bombard: [2,6]
            },
            {
                type: C_UNIT,
                image_id: "52Foot4",
                unit: GB_52_FOOT,
                defense: 6,
                range: 2,
                bombard: [1,10]
            },

            {
                type: C_UNIT,
                image_id: "Dutch1",
                unit: GB_DUTCH,
                attack: [1,10],
                defense: 3,
                copies: 2
            },
            {
                type: C_UNIT,
                image_id: "Dutch2",
                unit: GB_DUTCH,
                attack: [1,10],
                defense: 2,
                copies: 2
            },
            {
                type: C_UNIT,
                image_id: "Dutch3",
                unit: GB_DUTCH,
                defense: 5,
                range: 2,
                bombard: [1,10]
            },

            {
                type: C_UNIT,
                image_id: "KingDrag1",
                unit: GB_KING_DRG,
                attack: [2,8],
                defense: 7,
                pursuit: 4,
                option_not_advance: true
            },
            {
                type: C_UNIT,
                image_id: "KingDrag2",
                unit: GB_KING_DRG,
                attack: [2,8],
                defense: 6,
                pursuit: 4,
                option_not_advance: true,
                copies: 2
            },
            {
                type: C_UNIT,
                image_id: "KingDrag3",
                unit: GB_KING_DRG,
                attack: [2,8],
                defense: 6,
                pursuit: 3,
                option_not_advance: true
            },
            {
                type: C_UNIT,
                image_id: "KingDrag4",
                unit: GB_KING_DRG,
                defense: 6,
                range: 2,
                bombard: [1,10]
            },
        ]
    },

    sections: [
        [
            T_FOREST, T_CLEAR, T_CLEAR, T_CLEAR,
            T_CLEAR, T_CLEAR, T_CLEAR, T_CLEAR,
            T_CLEAR, T_FOREST, T_FOREST, T_CLEAR,
            T_CLEAR, T_FOREST, T_FOREST, T_HILL,
        ],
        [
            T_CLEAR, T_CLEAR, T_FOREST, T_HILL,
            T_CLEAR, T_CLEAR, T_CLEAR, T_FOREST,
            T_CLEAR, T_CLEAR, T_CLEAR, T_FOREST,
            T_HILL, T_CLEAR, T_CLEAR, T_FIELD,
        ],
        [
            T_CLEAR, T_CLEAR, T_HILL, T_CLEAR,
            T_CLEAR, T_CLEAR, T_CLEAR, T_HILL,
            T_CLEAR, T_HILL, T_HILL, T_CLEAR,
            T_CLEAR, T_CLEAR, T_CLEAR, T_HILL,
        ],
        [
            T_CLEAR, T_CLEAR, T_HILL, T_CLEAR,
            T_CLEAR, T_CLEAR, T_CLEAR, T_HILL,
            T_CLEAR, T_HILL, T_HILL, T_CLEAR,
            T_CLEAR, T_CLEAR, T_CLEAR, T_HILL,
        ],
        [
            T_CLEAR, T_FOREST, T_CLEAR, T_CLEAR,
            T_CLEAR, T_CLEAR, T_CLEAR, T_FOREST,
            T_CLEAR, T_CLEAR, T_HILL, T_CLEAR,
            T_FOREST, T_FOREST, T_CLEAR, T_TOWN,
        ],
        [
            T_CLEAR, T_CLEAR, T_CLEAR, T_CLEAR,
            T_FOREST, T_CLEAR, T_CLEAR, T_CLEAR,
            T_CLEAR, T_CLEAR, T_FIELD, T_FOREST,
            T_HILL, T_CLEAR, T_CLEAR, T_CLEAR,
        ],
        [
            T_FOREST, T_FOREST, T_CLEAR, T_TOWN,
            T_FOREST, T_CLEAR, T_FIELD, T_CLEAR,
            T_CLEAR, T_CLEAR, T_CLEAR, T_FOREST,
            T_CLEAR, T_CLEAR, T_CLEAR, T_CLEAR,
        ],
        [
            T_TOWN, T_CLEAR, T_CLEAR, T_HILL,
            T_CLEAR, T_FOREST, T_CLEAR, T_CLEAR,
            T_CLEAR, T_CLEAR, T_CLEAR, T_CLEAR,
            T_CLEAR, T_CLEAR, T_CLEAR, T_FOREST,
        ],
        [
            T_FOREST, T_CLEAR, T_TOWN, T_FOREST,
            T_CLEAR, T_CLEAR, T_CLEAR, T_FOREST,
            T_CLEAR, T_HILL, T_TOWN, T_CLEAR,
            T_TOWN, T_CLEAR, T_CLEAR, T_CLEAR,
        ],
        [
            T_CLEAR, T_HILL, T_CLEAR, T_CLEAR,
            T_HILL, T_HILL, T_CLEAR, T_CLEAR,
            T_CLEAR, T_CLEAR, T_FOREST, T_CLEAR,
            T_CLEAR, T_CLEAR, T_CLEAR, T_CLEAR,
        ],
        [
            T_CLEAR, T_CLEAR, T_HILL, T_CLEAR,
            T_CLEAR, T_CLEAR, T_CLEAR, T_HILL,
            T_CLEAR, T_HILL, T_HILL, T_CLEAR,
            T_CLEAR, T_CLEAR, T_CLEAR, T_HILL,
        ],
        [
            T_CLEAR, T_CLEAR, T_FOREST, T_CLEAR,
            T_CLEAR, T_CLEAR, T_CLEAR, T_CLEAR,
            T_TOWN, T_FOREST, T_CLEAR, T_CLEAR,
            T_FOREST, T_CLEAR, T_CLEAR, T_CLEAR,
        ],
        [
            T_CLEAR, T_CLEAR, T_FOREST, T_TOWN,
            T_TOWN, T_CLEAR, T_CLEAR, T_CLEAR,
            T_CLEAR, T_CLEAR, T_CLEAR, T_CLEAR,
            T_CLEAR, T_HILL, T_CLEAR, T_FOREST,
        ],
        [
            T_CLEAR, T_CLEAR, T_FOREST, T_HILL,
            T_CLEAR, T_CLEAR, T_CLEAR, T_FOREST,
            T_CLEAR, T_CLEAR, T_CLEAR, T_FOREST,
            T_HILL, T_CLEAR, T_CLEAR, T_FIELD,
        ],
        [
            T_CLEAR, T_CLEAR, T_FOREST, T_HILL,
            T_CLEAR, T_FOREST, T_TOWN, T_CLEAR,
            T_CLEAR, T_CLEAR, T_HILL, T_CLEAR,
            T_CLEAR, T_CLEAR, T_HILL, T_CLEAR,
        ],
        [
            T_HILL, T_HILL, T_CLEAR, T_CLEAR,
            T_HILL, T_CLEAR, T_CLEAR, T_CLEAR,
            T_CLEAR, T_CLEAR, T_CLEAR, T_FOREST,
            T_CLEAR, T_CLEAR, T_FOREST, T_FOREST,
        ],
        [
            T_CLEAR, T_CLEAR, T_TOWN, T_CLEAR,
            T_HILL, T_TOWN, T_CLEAR, T_FOREST,
            T_HILL, T_CLEAR, T_CLEAR, T_HILL,
            T_CLEAR, T_HILL, T_HILL, T_CLEAR,
        ],
        [
            T_TOWN, T_CLEAR, T_CLEAR, T_CLEAR,
            T_CLEAR, T_HILL, T_HILL, T_CLEAR,
            T_TOWN, T_CLEAR, T_HILL, T_CLEAR,
            T_CLEAR, T_CLEAR, T_CLEAR, T_SWAMP,
        ],
        [
            T_CLEAR, T_CLEAR, T_CLEAR, T_HILL,
            T_CLEAR, T_CLEAR, T_CLEAR, T_CLEAR,
            T_HILL, T_HILL, T_CLEAR, T_CLEAR,
            T_HILL, T_HILL, T_CLEAR, T_CLEAR,
        ],
        [
            T_HILL, T_HILL, T_TOWN, T_CLEAR,
            T_CLEAR, T_CLEAR, T_CLEAR, T_CLEAR,
            T_CLEAR, T_CLEAR, T_CLEAR, T_CLEAR,
            T_CLEAR, T_CLEAR, T_CLEAR, T_CLEAR,
        ],
        [
            T_FOREST, T_FOREST, T_FOREST, T_CLEAR,
            T_CLEAR, T_LAKE, T_CLEAR, T_CLEAR,
            T_CLEAR, T_HILL, T_CLEAR, T_CLEAR,
            T_CLEAR, T_LAKE, T_CLEAR, T_HILL,
        ],
        [
            T_CLEAR, T_CLEAR, T_CLEAR, T_CLEAR,
            T_CLEAR, T_FOREST, T_CLEAR, T_CLEAR,
            T_CLEAR, T_CLEAR, T_CLEAR, T_CLEAR,
            T_HILL, T_CLEAR, T_HILL, T_CLEAR,
        ],
        [
            T_HILL, T_CLEAR, T_HILL, T_CLEAR,
            T_HILL, T_CLEAR, T_CLEAR, T_CLEAR,
            T_HILL, T_FOREST, T_CLEAR, T_HILL,
            T_CLEAR, T_FOREST, T_CLEAR, T_CLEAR,
        ],
        [
            T_CLEAR, T_CLEAR, T_CLEAR, T_CLEAR,
            T_CLEAR, T_CLEAR, T_CLEAR, T_CLEAR,
            T_HILL, T_HILL, T_TOWN, T_CLEAR,
            T_CLEAR, T_CLEAR, T_CLEAR, T_CLEAR,
        ],
    ]
}