function ElectricityConsumptionProfile( building, constants ) {
	var profile = new Profile();
	var hour;
	if(building.buildingType == "1" || building.buildingType == "2") {
		for(hour=0;hour<8760;hour++) {
			profile.profile[hour] = building.nominalElectricityConsumption * building.floorArea * building.averageRoomHeight / 8760;
		}
	}
	return profile;
}