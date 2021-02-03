//=require xelibDestructuring.js
function debugMessage(str) {
	if(settings.showDebugMessages) {
		logMessage(`${logName}: ${str}.`);
	}
}
function uniqueRecId(rec, file) {
	if(!IsMaster(rec)) rec = GetMasterRecord(rec);
	if(!file) file = GetElementFile(rec);
	let filename = GetFileName(file);
	if(filename === 'zPatch.esp') filename = baseFilename;
	return filename +'/'+ EditorID(rec);
}
function recursiveCache(rec, id, i = 0) {
	try {
		if(i !== 0) {
			id += i;
		}
		let cachedRec = cacheRecord(rec, id);
		return cachedRec;
	} catch (e) {
		if(`cacheRecord: ${id} is not unique.` === e.message){
			debugMessage(`${id} is non-unique. Caching record with different ID`);
			recursiveCache(rec, id, i + 1);
		} else {throw e;}
	}
}
function safeCopyAndCache(rec, edid) {
	let newRec = copyToPatch(rec, true);
	if(!IsMaster(rec)) rec = GetMasterRecord(rec);
	AddElementValue(newRec, 'EDID', edid);
	let urid = uniqueRecId(newRec, GetElementFile(rec));
	recursiveCache(newRec, urid);
	SetValue(newRec, 'EDID', edid);//cache record changes edid to be the cache id. this is bad.
	return newRec;
}
function findByEditorID(recs, edid) {
	edid = edid.toLowerCase();
	return recs.find(rec => EditorID(rec).toLowerCase() === edid);
}

//weapons and armor
const armorFormIDs = {
	leather: {
		boots: 0x13920,
		cuirass: 0x3619E,
		gauntlets: 0x13921,
		helmet: 0x13922
	},
	elven: {
		boots: 0x1391A,
		cuirass: 0x896A3,
		gauntlets: 0x1391C,
		helmet: 0x1391D,
		shield: 0x1391E
	},
	scaled: {
		boots: 0x1B39F,
		cuirass: 0x1B3A3,
		gauntlets: 0x1B3A0,
		helmet: 0x1B3A1
	},
	glass: {
		boots: 0x13938,
		cuirass: 0x13939,
		gauntlets: 0x1393A,
		helmet: 0x1393B,
		shield: 0x1393C
	},
	dragonscale: {
		boots: 0x1393D,
		cuirass: 0x1393E,
		gauntlets: 0x1393F,
		helmet: 0x13940,
		shield: 0x13941
	},
	iron: {
		boots: 0x12E4B,
		cuirass: 0x12E49,
		gauntlets: 0x12E46,
		helmet: 0x12E4D,
		shield: 0x12EB6
	},
	steel: {
		boots: 0xF6F21,
		cuirass: 0xF6F22,
		gauntlets: 0xF6F23,
		helmet: 0xF6F24,
		shield: 0x13955
	},
	dwarven: {
		boots: 0x1394C,
		cuirass: 0x1394D,
		gauntlets: 0x1394E,
		helmet: 0x1394F,
		shield: 0x13950
	},
	steelplate: {
		boots: 0x1395B,
		cuirass: 0x1395C,
		gauntlets: 0x1395D,
		helmet: 0x1395E
	},
	orcish: {
		boots: 0x13956,
		cuirass: 0x13957,
		gauntlets: 0x13958,
		helmet: 0x13959,
		shield: 0x13946
	},
	ebony: {
		boots: 0x13960,
		cuirass: 0x13961,
		gauntlets: 0x13962,
		helmet: 0x13963,
		shield: 0x13964
	},
	dragonplate: {
		boots: 0x13965,
		cuirass: 0x13966,
		gauntlets: 0x13967,
		helmet: 0x13969,
		shield: 0x13968
	},
	daedric: {
		boots: 0x1396A,
		cuirass: 0x1396B,
		gauntlets: 0x1396C,
		helmet: 0x1396D,
		shield: 0x1396E
	}
},
weaponFormIDs = {
	iron: {
		battleaxe: 0x13980,
		bow: 0x3B562,
		dagger: 0x1397E,
		greatsword: 0x1359D,
		mace: 0x13982,
		sword: 0x12EB7,
		waraxe: 0x13790,
		warhammer: 0x13981
	},
	steel: {
		battleaxe: 0x13984,
		bow: 0x13985,
		dagger: 0x13986,
		greatsword: 0x13987,
		mace: 0x13988,
		sword: 0x13989,
		waraxe: 0x13983,
		warhammer: 0x1398A
	},
	orcish: {
		battleaxe: 0x1398C,
		bow: 0x1398D,
		dagger: 0x1398E,
		greatsword: 0x1398F,
		mace: 0x13990,
		sword: 0x13991,
		waraxe: 0x1398B,
		warhammer: 0x13992
	},
	dwarven: {
		battleaxe: 0x13994,
		bow: 0x13995,
		dagger: 0x13996,
		greatsword: 0x13997,
		mace: 0x13998,
		sword: 0x13999,
		waraxe: 0x13993,
		warhammer: 0x1399A
	},
	elven: {
		battleaxe: 0x1399C,
		bow: 0x1399D,
		dagger: 0x1399E,
		greatsword: 0x1399F,
		mace: 0x139A0,
		sword: 0x139A1,
		waraxe: 0x1399B,
		warhammer: 0x139A2
	},
	glass: {
		battleaxe: 0x139A4,
		bow: 0x139A5,
		dagger: 0x139A6,
		greatsword: 0x139A7,
		mace: 0x139A8,
		sword: 0x139A9,
		waraxe: 0x139A3,
		warhammer: 0x139AA
	},
	ebony: {
		battleaxe: 0x139AC,
		bow: 0x139AD,
		dagger: 0x139AE,
		greatsword: 0x139AF,
		mace: 0x139B0,
		sword: 0x139B1,
		waraxe: 0x139AB,
		warhammer: 0x139B2
	},
	daedric: {
		battleaxe: 0x139B4,
		bow: 0x139B5,
		dagger: 0x139B6,
		greatsword: 0x139B7,
		mace: 0x139B8,
		sword: 0x139B9,
		waraxe: 0x139B3,
		warhammer: 0x139BA
	},
	dragon: {
		battleaxe: 0x2014FC3,
		bow: 0x20176F1,
		dagger: 0x2014FCB,
		greatsword: 0x2014FCC,
		mace: 0x2014FCD,
		sword: 0x2014FCE,
		waraxe: 0x2014FCF,
		warhammer: 0x2014FD0
	}
}
standardMaterials = {
	armor: Object.keys(armorFormIDs),
	weapon: Object.keys(weaponFormIDs)
},
standardTypes = {
	armor: Object.keys(armorFormIDs.iron),
	weapon: Object.keys(weaponFormIDs.iron)
},
armorRecs = {
	leather: {
		boots: -1,
		cuirass: -1,
		gauntlets: -1,
		helmet: -1
	},
	elven: {
		boots: -1,
		cuirass: -1,
		gauntlets: -1,
		helmet: -1,
		shield: -1
	},
	scaled: {
		boots: -1,
		cuirass: -1,
		gauntlets: -1,
		helmet: -1
	},
	glass: {
		boots: -1,
		cuirass: -1,
		gauntlets: -1,
		helmet: -1,
		shield: -1
	},
	dragonscale: {
		boots: -1,
		cuirass: -1,
		gauntlets: -1,
		helmet: -1,
		shield: -1
	},
	iron: {
		boots: -1,
		cuirass: -1,
		gauntlets: -1,
		helmet: -1,
		shield: -1
	},
	steel: {
		boots: -1,
		cuirass: -1,
		gauntlets: -1,
		helmet: -1,
		shield: -1
	},
	dwarven: {
		boots: -1,
		cuirass: -1,
		gauntlets: -1,
		helmet: -1,
		shield: -1
	},
	steelplate: {
		boots: -1,
		cuirass: -1,
		gauntlets: -1,
		helmet: -1
	},
	orcish: {
		boots: -1,
		cuirass: -1,
		gauntlets: -1,
		helmet: -1,
		shield: -1
	},
	ebony: {
		boots: -1,
		cuirass: -1,
		gauntlets: -1,
		helmet: -1,
		shield: -1
	},
	dragonplate: {
		boots: -1,
		cuirass: -1,
		gauntlets: -1,
		helmet: -1,
		shield: -1
	},
	daedric: {
		boots: -1,
		cuirass: -1,
		gauntlets: -1,
		helmet: -1,
		shield: -1
	}
}
weaponRecs = {
	iron: {
		battleaxe: -1,
		bow: -1,
		dagger: -1,
		greatsword: -1,
		mace: -1,
		sword: -1,
		waraxe: -1,
		warhammer: -1
	},
	steel: {
		battleaxe: -1,
		bow: -1,
		dagger: -1,
		greatsword: -1,
		mace: -1,
		sword: -1,
		waraxe: -1,
		warhammer: -1
	},
	orcish: {
		battleaxe: -1,
		bow: -1,
		dagger: -1,
		greatsword: -1,
		mace: -1,
		sword: -1,
		waraxe: -1,
		warhammer: -1
	},
	dwarven: {
		battleaxe: -1,
		bow: -1,
		dagger: -1,
		greatsword: -1,
		mace: -1,
		sword: -1,
		waraxe: -1,
		warhammer: -1
	},
	elven: {
		battleaxe: -1,
		bow: -1,
		dagger: -1,
		greatsword: -1,
		mace: -1,
		sword: -1,
		waraxe: -1,
		warhammer: -1
	},
	glass: {
		battleaxe: -1,
		bow: -1,
		dagger: -1,
		greatsword: -1,
		mace: -1,
		sword: -1,
		waraxe: -1,
		warhammer: -1
	},
	ebony: {
		battleaxe: -1,
		bow: -1,
		dagger: -1,
		greatsword: -1,
		mace: -1,
		sword: -1,
		waraxe: -1,
		warhammer: -1
	},
	daedric: {
		battleaxe: -1,
		bow: -1,
		dagger: -1,
		greatsword: -1,
		mace: -1,
		sword: -1,
		waraxe: -1,
		warhammer: -1
	},
	dragon: {
		battleaxe: -1,
		bow: -1,
		dagger: -1,
		greatsword: -1,
		mace: -1,
		sword: -1,
		waraxe: -1,
		warhammer: -1
	}
};

function getGear(material, type) {
	material = material.toLowerCase();
	type = type.toLowerCase();
	let map, formIDMap;
	let getMasterHandle = () => {
		if(map[material] === undefined || map[material][type] === undefined) return undefined;
		let handle = map[material][type];
		if(handle > 0) return handle;
		handle = GetRecord(0, formIDmap[material][type]);
		if(!IsMaster(handle)) handle = GetMasterRecord(handle);
		map[material][type] = handle;
		return handle;
	};
	if(type in standardTypes.armor){
		if(material in standardMaterials.armor){
			map = armorRecs;
			formIDMap = armorFormIDs;
		}
	} else if(type in standardTypes.weapon){
		if(material in standardMaterials.weapon){
			map = weaponRecs;
			formIDMap = weaponFormIDs;
		}
	}
	if(map) return getMasterHandle();
}
function getGearOfType(type){
	let materials;
	if(type in standardTypes.armor){
		materials = standardMaterials.armor;
	} else if(type in standardTypes.weapon){
		materials = standardMaterials.weapon;
	}
	if(materials) return Object.fromEntries(
		materials.map(mat =>
			[mat, getGear(mat, type)]
		).filter(entry => entry[1] !== undefined)
	);
}

function getWeaponType(rec) {
	const wTypeKWs = ['WeapTypeSword','WeapTypeWarAxe','WeapTypeMace','WeapTypeDagger','WeapTypeGreatsword','WeapTypeBattleaxe','WeapTypeWarhammer','WeapTypeBow'];
	let kw = wTypeKWs.find(kw => HasKeyword(rec, kw));
	let wType = kw.toLowerCase().substring(8);
	if(wType === 'bow') wType = GetValue(rec, 'DNAM\\Animation Type').toLowerCase();
	return wType;
}

//leveled items
function createNewLeveledItem(file, name, flags, chanceNone = 0, globalChanceNone = false){
	const flagMap = {
		'alllevels': 'Calculate from all levels <= player\'s level',
		'foreach': 'Calculate for each item in count',
		'useall': 'Use All',
		'special': 'Special Loot'
	}, flagNames = Object.values(flagMap),
	flagRemap = (str) => {
		let flag = str.toLowerCase().replace(/\s/g, '');
		flag = flag in flagMap? flagMap[flag]: str;
		return flagNames.includes(flag)? flag: undefined;
	};
	let rec = AddElement(file, 'LVLI\\LVLI');
	if(name) AddElementValue(rec, 'EDID', name);
	if(flags) {
		if(!Array.isArray(flags)) flags = [flags];
		flags = flags.map(flagRemap).filter(flag => flag);
		SetEnabledFlags(rec, 'LVLF', flags);
	}
	if(chanceNone > 0) {
		if(globalChanceNone) {
			AddElement(rec, 'LVLG');
			SetLinksTo(rec, chanceNone, 'LVLG');
		} else SetIntValue(rec, 'LVLD', chanceNone);
	}
	return rec;
}