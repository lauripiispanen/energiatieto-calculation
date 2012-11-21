function SolarInstallation() {
	this.photovoltaicArea 					= 20; 		// m2
	this.thermalArea 						= 0;

	// Panel specific default values. User can view and change if necessary.
	this.photovoltaicPeakPowerFactor 		= 0.15;
	this.photovoltaicInstallationFactor 	= 0.75;		// Depends on the installation. Value 0.75 is applicable when the panel is moderately ventilated

	// Roof specific values from database
	this.roofId 							= 422;
	this.roofArea 							= 151.163; 	// m2
	this.roofAreaAvgIrradiance 				= 789.471; 	// kWh/(m2 year)
	this.roofGoodArea						= 80.3742;	// m2
	this.roofGoodAreaAvgIrradiance			= 916.824;	// kWh/(m2 year)
	this.roofRemainingArea					= 70.7888;	// m2
	this.roofRemainingAreaAvgIrradiance		= 644.8727;	// kWh/(m2 year)
}