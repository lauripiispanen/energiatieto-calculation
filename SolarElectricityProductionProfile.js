function SolarElectricityProductionProfile( solarInstallation, constants ) {
	var profile = new Profile();
	var hour;
	var electricityProductionTotal;
	electricityProductionTotal = InstallationAreaAvgIrradiance(solarInstallation,constants) * solarInstallation.photovoltaicArea * solarInstallation.photovoltaicPeakPowerFactor * solarInstallation.photovoltaicInstallationFactor;
		for(hour=0;hour<8760;hour++) {
			profile.profile[hour] = electricityProductionTotal * constants.vantaaReferenceYearTotalIrradiationOnHorizontalSurface[hour];
		}
	return profile;
}

function InstallationAreaAvgIrradiance(solarInstallation,constants) {
	var installationAreaOnGoodRoof;
	var installationAreaOnRemainingRoof;
	var installationAreaTotal = solarInstallation.photovoltaicArea + solarInstallation.thermalArea;
	if(installationAreaTotal > solarInstallation.roofArea) {
		installationAreaTotal = solarInstallation.roofArea;
	}
	if(installationAreaTotal <= solarInstallation.roofGoodArea) {
		installationAreaOnGoodRoof = installationAreaTotal;
		installationAreaOnRemainingRoof = 0;
	} else {
		installationAreaOnGoodRoof = solarInstallation.roofGoodArea;
		installationAreaOnRemainingRoof = installationAreaTotal - installationAreaOnGoodRoof;
	}
	return ((installationAreaOnGoodRoof * solarInstallation.roofGoodAreaAvgIrradiance + installationAreaOnRemainingRoof * solarInstallation.roofRemainingAreaAvgIrradiance) / installationAreaTotal);
}

/*

	solarPanel.area
	solarInstallation.electricityPeakPowerFactor;
	solarInstallation.electricityInstallationFactor;

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

	InstallationAreaAvgIrradiance(SolarInstallation,constants) * solarInstallation.photovoltaicArea * solarInstallation.photovoltaicPeakPowerFactor * solarIstallation.photovoltaicInstallationFactor;

	totalElectricityProduction = solarPanel.photovoltaicArea * 

*/