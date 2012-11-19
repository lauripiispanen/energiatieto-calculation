function SpaceHeatingEnergyProfile( building, constants ) {

	var profile = new Profile();
	var hour;

	var consumedSpaceHeatingEnergy;
	var normalizedSpaceHeatingEnergyDemand;

	if ( building.buildingType == "1" ) { // "Asuinrakennus - erillistalo"
		if ( building.spaceHeatingEnergyEstimated == false ) {
			if ( building.heatingSystem == "1" ) { // District heating
				if ( building.energyConsumptionIncludesWaterHeating == true ) {
					consumedSpaceHeatingEnergy = HeatingEnergyFromDistrictHeating ( building, constants ) - HotWaterHeatingEnergyProfile( building, constants ).period( building.energyConsumptionPeriodStartYear, building.energyConsumptionPeriodStartMonth, building.energyConsumptionPeriodEndYear, building.energyConsumptionPeriodEndMonth );					
				} else {
					consumedSpaceHeatingEnergy = HeatingEnergyFromDistrictHeating ( building, constants );
				}
			}
			if ( building.heatingSystem == "2" ) { // Oil heating
				if ( building.energyConsumptionIncludesWaterHeating == true ) {
					consumedSpaceHeatingEnergy = HeatingEnergyFromOil ( building, constants ) - HotWaterHeatingEnergyProfile( building, constants ).period( building.energyConsumptionPeriodStartYear, building.energyConsumptionPeriodStartMonth, building.energyConsumptionPeriodEndYear, building.energyConsumptionPeriodEndMonth );				
				} else {
					consumedSpaceHeatingEnergy = HeatingEnergyFromOil ( building, constants );
				}
			}
			// Here the consumed space heating energy is normalized based on the ratio of actual heating demand and reference year heating demand.
			// The normalized consumption of the period is then divided by reference year heating demand of the same period, which gives the
			// consumption per heating demand unit.
			// The result is then multiplied by the heating demand of one reference year, which gives us the normalized space heating energy need of one year.
			var periodActual = ActualHeatingDemandHelsinkiKaisaniemi( building.energyConsumptionPeriodStartYear, building.energyConsumptionPeriodStartMonth, building.energyConsumptionPeriodEndYear, building.energyConsumptionPeriodEndMonth );
			var periodReference = ReferenceHeatingDemandHelsinkiKaisaniemi( building.energyConsumptionPeriodStartYear, building.energyConsumptionPeriodStartMonth, building.energyConsumptionPeriodEndYear, building.energyConsumptionPeriodEndMonth );
			var periodRatio = periodReference / periodActual;
			var fullYearReference = ReferenceHeatingDemandHelsinkiKaisaniemi( 2011,1,2011,12 );
			normalizedSpaceHeatingDemand = (periodRatio * consumedSpaceHeatingEnergy) / periodReference * fullYearReference;
		}
		if ( building.spaceHeatingEnergyEstimated == true ||  building.heatingSystem == "3" || building.heatingSystem == "4") {
			normalizedSpaceHeatingDemand = NominalSpaceHeatingDemandEstimate( building, constants ) * ReferenceHeatingDemandHelsinkiKaisaniemi( 2011,1,2011,12 );
		}
		// The normalized space heating energy need of one year is divided to individeal hours based on "heatingDemandProfileHelsinkiKaisaniemiReferenceYear".
		// Read more about this profile from its own documentation.	
		for(hour=0;hour<8760;hour++) {
			profile.profile[hour] = normalizedSpaceHeatingDemand * constants.heatingDemandProfileHelsinkiKaisaniemiReferenceYear[hour];
		}
	}
	if ( building.buildingType == "2" ) { // "Asuinrakennus - uudisrakennus"
		if (building.buildingYear == 2014 ) {
			for(hour=0;hour<8760;hour++) {
				profile.profile[hour] = constants.simulatedSpaceHeatingDemandOfResidentialReferenceBuilding2014[hour] * building.floorArea;
			}
		}	
		if (building.buildingYear == 2015 ) {
			for(hour=0;hour<8760;hour++) {
				profile.profile[hour] = constants.simulatedSpaceHeatingDemandOfResidentialReferenceBuilding2015[hour] * building.floorArea;
			}
		}	
		if (building.buildingYear == 2016 ) {
			for(hour=0;hour<8760;hour++) {
				profile.profile[hour] = constants.simulatedSpaceHeatingDemandOfResidentialReferenceBuilding2016[hour] * building.floorArea;
			}
		}	
		if (building.buildingYear == 2017 ) {
			for(hour=0;hour<8760;hour++) {
				profile.profile[hour] = constants.simulatedSpaceHeatingDemandOfResidentialReferenceBuilding2017[hour] * building.floorArea;
			}
		}	
	}
	return profile;
}


function HeatingEnergyFromOil( building, constants ) {

	return building.oilConsumption * constants.energyContentOfOil * building.oilEfficiency;

}


function HeatingEnergyFromDistrictHeating( building, constants ) {

	return building.districtHeatingConsumption * building.districtHeatingEfficiency;

}


function ActualHeatingDemandHelsinkiKaisaniemi( periodStartYear, periodStartMonth, periodEndYear, periodEndMonth ) {

	var actualHeatingDemandHelsinkiKaisaniemi = [
		[509, 462, 520, 319, 102,  0, 0, 19, 188, 240, 399, 486], // 2008
		[613, 576, 556, 357, 104, 37, 5,  0,  52, 396, 402, 639], // 2009
		[850, 702, 584, 372, 127,  0, 0, 15,  99, 340, 526, 760], // 2010
		[662, 753, 558, 325, 139,  0, 0,  0,  26, 258, 350, 422], // 2011
		[633, 692, 502, 387, 120,  8, 0,  0,  75, 302, 468, 594]  // 2012 ( two last months unknown at the time of writing, values from reference year )
		];

	var year = periodStartYear;
	var month = periodStartMonth;
	var sum = 0.0;

	while( year <= periodEndYear && ( year < periodEndYear || month <= periodEndMonth) ) {

		sum += actualHeatingDemandHelsinkiKaisaniemi[year-2008][month-1];

		month++;
		if( month > 12 ) {
			month = 1;
			year++;
		}
	}

	return sum;
}


function ReferenceHeatingDemandHelsinkiKaisaniemi(periodStartYear, periodStartMonth, periodEndYear, periodEndMonth) {

	var referenceHeatingDemandHelsinkiKaisaniemi = [
		[657, 619, 574, 404, 169, 12, 2, 15, 144, 331, 468, 594], // reference year
		[657, 619, 574, 404, 169, 12, 2, 15, 144, 331, 468, 594], // reference year
		[657, 619, 574, 404, 169, 12, 2, 15, 144, 331, 468, 594], // reference year
		[657, 619, 574, 404, 169, 12, 2, 15, 144, 331, 468, 594], // reference year
		[657, 619, 574, 404, 169, 12, 2, 15, 144, 331, 468, 594]  // reference year
		];

	var year = periodStartYear;
	var month = periodStartMonth;
	var sum = 0.0;

	while( year <= periodEndYear && ( year < periodEndYear || month <= periodEndMonth) ) {

		sum += referenceHeatingDemandHelsinkiKaisaniemi[year-2008][month-1];

		month++;
		if( month > 12 ) {
			month = 1;
			year++;
		}
	}

	return sum;
}


function NominalSpaceHeatingDemandEstimate( building, constants ) {

	var nominalSpaceHeatingDemand;

	// The aproximate values below re form Paavo Ingalsuo's Bergheat excel spreadsheet. Original source is unclear. Unit: kWh/(m^3 degreeday year)

	if ( building.buildingYear >= 2005) {
        nominalSpaceHeatingDemand = interpolate(2005, 2014, 0.007, 0.005, building.buildingYear);  
    } else if (building.buildingYear >= 1980) {
        nominalSpaceHeatingDemand = interpolate(1980, 2005, 0.011, 0.007, building.buildingYear);
    } else if (building.buildingYear >= 1970) {
        nominalSpaceHeatingDemand = interpolate(1970, 1980, 0.013, 0.011, building.buildingYear);
    } else if (building.buildingYear >= 1950) {
        nominalSpaceHeatingDemand = interpolate(1950, 1970, 0.020, 0.013, building.buildingYear);
    } else {
        nominalSpaceHeatingDemand = 0.020;
    }
    
   function interpolate(from, to, valFrom, valTo, at) {
    	var range       = to - from;
        var amount      = at - from;
        var percentage  = amount / range;
        return valFrom + (valTo - valFrom) * percentage;
    }

    return nominalSpaceHeatingDemand * building.floorArea * building.averageRoomHeight;

}

