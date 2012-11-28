function SystemSpaceHeatingEnergyProduction (system,constants) {
	var hour;
	systemProfile = new Profile();
	for(hour=0;hour<8760;hour++) {
		systemProfile.profile[hour] = 0.0;
	}
	return systemProfile;
}