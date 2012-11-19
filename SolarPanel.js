function SolarPanel {

	this.photovoltaicArea = 20;								// m2
	this.thermalArea = 0;

	// Panel specific default values. User can view and change if necessary.
	this.photovoltaicPeakPowerFactor = 0.15;
	this.photovoltaicInstallationFactor = 0.75;		// Depends on the installation. Value 0.75 is applicable when the panel is moderately ventilated

	// Roof specific values from database
	this.roofArea = 100.0;									// m2
	this.roofAreaTotalIrradiance = 100000.0;					// kWh / year
	this.roofAreaAvgIrradiance;								// kWh / (m2 year)
	this.roofGoodArea;										// m2
	this.roofGoodAreaAvgIrradiance;
	this.roofGoodAreaTotalIrradiance;						// kWh / (m2 year)
}
