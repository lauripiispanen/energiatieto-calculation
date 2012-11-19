function Building() {
	
	// User given parameters
	this.name = "Koetalo";
	this.floorArea = 240; 									// square meters
	this.buildingType = "1"; 								// 1:"Asuinrakennus - erillistalo" 2:"Asuinrakennus - uudisrakennus"
	this.buildingYear = 2015;
	this.numberOfInhabitants = 3;

	this.heatingSystem = "2";								// 1:District heating 2:OilHeating 3:ElectricHeating 4:Other
	this.spaceHeatingEnergyEstimated = false;
	this.electricityConsumpitonEstimated = false;

	this.oilConsumption = 5000;								// liters
	this.districtHeatingConsumption = 5000;						// kWh
	this.energyConsumptionPeriodStartYear = 2010;
	this.energyConsumptionPeriodStartMonth = 9;
	this.energyConsumptionPeriodEndYear = 2011;
	this.energyConsumptionPeriodEndMonth = 3;
	this.energyConsumptionIncludesWaterHeating = true;

	this.electricityConsumption = 0;							// kWh
	this.electricityConsumptionPeriodStartYear = 2010;
	this.electricityConsumptionPeriodStartMonth = 1;
	this.electricityConsumptionPeriodEndYear = 2010;
	this.electricityConsumptionPeriodEndMonth = 12;

	// Building specific default values.
	// User can view and change if necessary.
	this.averageRoomHeight = 2.8;							// meters
	this.waterConsumptionPerPersonPerDay = 60;				// liters/(person day)

	this.oilEfficiency = 0.87;
	this.districtHeatingEfficiency = 0.97;
	this.waterHeatingTemperatureDifference = 50;			// Kelvin or Celsius
	this.waterHeatingLosses = 0.89;

	this.nominalElectricityConsumption = 20;				// kWh/(m3 year)
}
