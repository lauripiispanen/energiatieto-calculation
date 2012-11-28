function SystemHotWaterHeatingEnergyBalance(system,constants) {
	var hour;
	var day;
	var index;
	systemConsumptionProfile = new Profile();
	systemProductionProfile = new Profile();
	systemBalanceProfile = new Profile();
	elementProfile = new Profile();
	for(hour=0;hour<8760;hour++) {
		systemConsumptionProfile.profile[hour] = 0.0;
	}
	for(hour=0;hour<8760;hour++) {
		systemProductionProfile.profile[hour] = 0.0;
	}	
	for(index=0;index<system.building.length;index++) {
		elementProfile = HotWaterHeatingEnergyProfile(system.building[index],constants);
		for(hour=0;hour<8760;hour++) {
			systemConsumptionProfile.profile[hour] += elementProfile.profile[hour];
		}
	}
	for(index=0;index<system.solarInstallation.length;index++) {
		elementProfile = SolarHeatingEnergyProductionProfile(system.solarInstallation[index],constants);
		for(hour=0;hour<8760;hour++) {
			systemProductionProfile.profile[hour] += elementProfile.profile[hour];
		}
	}
	for(hour=0;hour<8760;hour++) {
		systemBalanceProfile.profile[hour] = systemConsumptionProfile.profile[hour] - systemProductionProfile.profile[hour];
	}
	return systemBalanceProfile;
}