function SolarElectricityProductionProfile( SolarPanel, constants ) {
	
	var profile = new Profile();
	var hour;


	solarPanel.area
	solarPanel.electricityPeakPowerFactor
	solarPanel.electricityInstallationFactor

	radiation ?

	constants

	Aurinkosähkö
{
	Paneelin pinta-ala m2
	Huipputehokerroin = 0.15
	Säteilymäärä kWh/m2
	Pmax = Huipputehokerroin * pinta-ala
	Käyttötilannekerroin 0.75 ( hieman tuulettuva )

	Tuotto = säteilymäärä * ( pinta-ala * Huipputehokerroin )* Käyttötilasnnekerroin / 1 (yksiköiden takia 

	Jos tuotto suurempi kuin kulutus, niin ylimäärä menee hukkaan tai myyntiin.


	 säteilymäärä = f( A , sätelyjakauma )
}

	totalElectricityProduction = solarPanel.photovoltaicArea * solarPanel.photovoltaicPeakPowerFactor * solarPanel.photovoltaicInstallationFactor

		for(hour=0;hour<8760;hour++) {
			profile.profile[hour] = 
		}

	return profile;
}

function PanelAreaTotalIrradiance ( SolarPanel, constants ) {

	var panelAreaOnGoodRoofArea;
	var panelAreaOnRemainingRoofArea;
	var roofRemainingAreaAvgIrradiance;
	var PanelAreaTotalIrradiance;

	if( solarPanel.photovoltaicArea <= solarPanel.roofGoodArea ) {
		panelAreaOnGoodRoofArea = solarPanel.photovoltaicArea;
		panelAreaOnRemainingRoofArea = 0;
	} else {
		panelAreaOnGoodRoofArea = solarPanel.roofGoodArea;
		panelAreaOnRemainingRoofArea = solarPanel.photovoltaicArea - panelAreaOnGoodRoofAre;
	}

	roofRemainingAreaAvgRadiation = ( solarPanel.roofAreaTotalRadiation - ( solarPanel.roofGoodArea * solarPanel.roofGoodAreaAvgRadiation ) ) / ( solarPanel.roofArea - solarPanel.roofGoodArea );

	irradiation = panelAreaOnGoodRoofArea * solarPanel.roofGoodAreaAvgRadiation;
	irradiation += panelAreaOnRemainingRoofArea * roofRemainingAreaAvgRadiation;

	return irradiation;

}