const {
		AddArrayItem,
		AddElement,
		AddElementValue,
		AddLeveledEntry,
		EditorID,
		ElementMatches,
		ExtractSignature,
		FileByName,
		FullName,
		GetDamage,
		GetElementFile,
		GetElement,
		GetElements,
		GetFileName,
		GetFlag,
		GetFormID,
		GetHexFormID,
		GetIntValue,
		GetLinksTo,
		GetMasterRecord,
		GetRecord,
		GetRecords,
		GetRefEditorID,
		GetValue,
		GetWinningOverride,
		HasElement,
		HasKeyword,
		IsMaster,
		IsWinningOverride,
		LongName,
		RemoveElement,
		SetEnabledFlags,
		SetFlag,
		SetFormID,
		SetIntValue,
		SetLinksTo,
		SetValue,
		Signature
	} = xelib,
	{
		addProgress,
		copyToPatch,
		cacheRecord,
		loadRecords,
		logMessage
	} = helpers;