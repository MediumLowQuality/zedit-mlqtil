//=require xelibDestructuring.js
function debugMessage(str) {
	if(settings.showDebugMessages) {
		logMessage(`${logName}: ${str}.`);
	}
}
function uniqueRecId(rec) {
	if(!IsMaster(rec)) rec = GetMasterRecord(rec);
	let file = GetFileName(GetElementFile(rec));
	file = file === 'zPatch.esp'? baseFilename: file;
	return file +'/'+ EditorID(rec);
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
	rec = copyToPatch(rec, true);
	AddElementValue(rec, 'EDID', edid);
	recursiveCache(rec, uniqueRecId(rec));
	SetValue(rec, 'EDID', edid);//cache record changes edid to be the cache id. this is bad.
	return rec;
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