function SystemCost() {
  var self = this;
  
  this.getConstants = function(){
    return {
      nominalInterest: 0.01,
      inflation: 0.02,
      energyEscalation: 0.04,
      energyCost: 0,
      solarEnergySquareMeterPrice: 300,
      solarHeatSquareMeterPrice: 500,
      geoHeatKilowattPrice: 2000,
      boreholeSystemCost: 3000,
      boreholeCostPerMeter: 30,
      electricitySellPrice: 0.04,
      electricityBuyPrice: 0.126,
      heatingEnergyBuyPrices: {
        oil: 0.1074,
        districtHeating: 0.065
      },
      yearlyMaintenanceCostPercentage: 0.05,
      systemLifespanInYears: 20,
      estimatedYearOfFailure: 10,
      estimatedAnnualCostPercentageForFailure: 0.02
    };
  };

  self.constants = this.getConstants();

  this.getSystemCost = function(options){
    var r = this.getRealInterest();

    var initialInvestment = this.getInitialInvestment(options.system);
    var totalSystemCost = this.getTotalSystemCost(options, r, initialInvestment);
    
    var comparisonCost = this.getComparisonCost(options, r);
    var paybackTime = this.getPaybackTime(totalSystemCost, comparisonCost);
    var averageSavings = this.getAverageSavings(totalSystemCost, comparisonCost, initialInvestment);
    
    var systemCost = {
      totalSystemCost: totalSystemCost,
      comparisonCost: comparisonCost,
      initialInvestment: initialInvestment,
      paybackTime: paybackTime,
      averageSavings: averageSavings
    };
    return systemCost;
  };

  this.getAverageSavings = function(totalSystemCost, comparisonCost, initialInvestment) {
    var savings = _
      .chain(totalSystemCost)
      .zip(comparisonCost)
      .map(function(it) {
        var total = it[0].cost - initialInvestment,
            comparison = it[1].cost;
        return total - comparison;
      }).value()[1] / 12;
    return Math.abs(savings);
  };
  
  this.getTotalSystemCost = function(options, r, initialInvestment){
    var maintenanceCost = this.getMaintenanceCost(initialInvestment);
    var annualElectricityBalance = options.electricityProduction - options.electricityConsumption;
    var annualSpaceHeatingEnergyBalance = options.spaceHeatingEnergyProduction - options.spaceHeatingEnergyConsumption;
    var annualWaterHeatingEnergyBalance = options.hotWaterHeatingEnergyProduction - options.hotWaterHeatingEnergyConsumption;

    var re = this.getRealInterestWithEscalation(r);

    var years = _.range(self.constants.systemLifespanInYears + 1);
    var currentYear = getCurrentYear();
    return _.map(years, function(year) {
      return {
        year: currentYear + year,
        cost: (function() {
          function costFor(balance, energyPrice, initialInvestment, energySellPrice, maintenanceCost) {
            return self.getSystemCostForYear(
                      year, 
                      r, 
                      re,
                      initialInvestment, 
                      maintenanceCost,
                      balance,
                      energyPrice,
                      energySellPrice
                    );
          };

          var heating = _.chain(options.system.building).map(function(building) {
            var spaceHeatingCost;
            var waterHeatingCost;
            switch (building.heatingSystem) {
              // 1:District heating 2:OilHeating 3:ElectricHeating 4:Other
              case "1":
                waterHeatingCost = costFor(annualWaterHeatingEnergyBalance, self.constants.heatingEnergyBuyPrices.districtHeating, 0, 0, 0);
                spaceHeatingCost = costFor(annualSpaceHeatingEnergyBalance, self.constants.heatingEnergyBuyPrices.districtHeating, 0, 0, 0);
                break;
              case "2":
                waterHeatingCost = costFor(annualWaterHeatingEnergyBalance, self.constants.heatingEnergyBuyPrices.oil, 0, 0, 0);
                spaceHeatingCost = costFor(annualSpaceHeatingEnergyBalance, self.constants.heatingEnergyBuyPrices.oil, 0, 0, 0);
                break;
              case "3":
                waterHeatingCost = costFor(annualWaterHeatingEnergyBalance, self.constants.electricityBuyPrice, 0, 0, 0);
                spaceHeatingCost = costFor(annualSpaceHeatingEnergyBalance, self.constants.electricityBuyPrice, 0, 0, 0);
                break;
              case "4":
                waterHeatingCost = 0;
                spaceHeatingCost = 0;
                break;
            }

            return {
              space: spaceHeatingCost,
              water: waterHeatingCost
            }
          })
          .reduce(function(it, memo) {
            return {
              space: it.space + memo.space,
              water: it.water + memo.water,
            }
          }, {space: 0, water: 0})
          .defaults({
            space: 0,
            water: 0
          })
          .value();

          return costFor(annualElectricityBalance, self.constants.electricityBuyPrice, initialInvestment, self.constants.electricitySellPrice, maintenanceCost) + heating.space + heating.water
        })()
      };
    });
  };

  this.getSystemCostForYear = function(year, 
                                      r, 
                                      re,
                                      initialInvestment, 
                                      maintenanceCost, 
                                      energyBalance,
                                      energyBuyPrice,
                                      energySellPrice){
    var ay = self.getSingleOutput(r, year);
    var an = self.getRecurringOutput(r, year);
    var ane = self.getRecurringEscalationOutput(re, year);

    var adjustedMaintenanceCost = maintenanceCost * an;
    var additionalInvestment = self.getAdditionalInvestment(year, initialInvestment, r);
    var incomeForYear = self.getEnergyIncome(energyBalance, ane, energyBuyPrice, energySellPrice);
    
    var systemCost = initialInvestment +
          adjustedMaintenanceCost +
           additionalInvestment + 
          -incomeForYear;
    
    return systemCost;
  };
  
  this.getInitialInvestment = function(system){
    var solarInstallations = system.solarInstallation;
    var boreholes = system.borehole;
    var boreholeCost = _.reduce(system.borehole, function(memo, borehole) {
      return memo + self.constants.boreholeSystemCost + (borehole.activeDepth * self.constants.boreholeCostPerMeter)
    }, 0);


    var solarEnergyArea = _.reduce(solarInstallations, function(solarAreaSum, solarInstallation){
      return solarAreaSum + solarInstallation.photovoltaicArea;
    }, 0);
    var solarEnergyAreaCost = solarEnergyArea * self.constants.solarEnergySquareMeterPrice;

    var solarHeatArea = _.reduce(solarInstallations, function(solarAreaSum, solarInstallation){
      return solarAreaSum + solarInstallation.thermalArea;
    }, 0);
    var solarHeatAreaCost = solarHeatArea * self.constants.solarHeatSquareMeterPrice;
    
    var initialInvestment = solarEnergyAreaCost + solarHeatAreaCost + boreholeCost;
    return initialInvestment;
  };

  this.getAdditionalInvestment = function(year, initialInvestment, r){
    if(year >= self.constants.estimatedYearOfFailure){
      var outputOnYearOfFailure = self.getSingleOutput(r, self.constants.estimatedYearOfFailure);
      var additionalInvestment = outputOnYearOfFailure * 
            self.constants.estimatedAnnualCostPercentageForFailure *
            initialInvestment;
      return additionalInvestment;
    } else {
      return 0;
    }
  };
  
  this.getMaintenanceCost = function(initialInvestment){
    return self.constants.yearlyMaintenanceCostPercentage * initialInvestment;
  };
  
  this.getRealInterest = function(){
    var i = self.constants.nominalInterest;
    var f = self.constants.inflation;
    return ((i - f) / (1 + f));
  };
  
  this.getSingleOutput = function(r, year){
    return 1 / Math.pow(1 + r, year);
  };
  
  this.getRecurringOutput = function(r, n){
    var i = self.constants.nominalInterest;
    return ((Math.pow(1 + r, n) - 1) / 
            (i * Math.pow(1 + r, n)));
  };
  
  this.getRecurringEscalationOutput = function(re, n){
    return ((Math.pow(1 + re, n) - 1) / 
            (re * Math.pow(1 + re, n)));
  };
  
  this.getRealInterestWithEscalation = function(r){
    var e = self.constants.energyEscalation;
    return ((r - e) / (1 + e));
  };
  
  this.getEnergyIncome = function(energyBalance, ane, energyBuyPrice, energySellPrice){
    if(energyBalance > 0){
      return energySellPrice * energyBalance * ane;
    } else {
      return energyBuyPrice * energyBalance * ane;
    }
  };
  
  this.getComparisonCost = function(options, r){
    var re = self.getRealInterestWithEscalation(r);

    var currentYear = getCurrentYear();
    var years = _.range(self.constants.systemLifespanInYears + 1);

    var comparisonCost = _.map(years, function(year) {
      var energyCostAdjustment = self.getRecurringEscalationOutput(re, year);
      var energyCost = options.electricityConsumption * self.constants.electricityBuyPrice * energyCostAdjustment;
      var spaceHeatingCost;
      var waterHeatingCost;
      _.each(options.system.building, function(building) {
        switch (building.heatingSystem) {
          // 1:District heating 2:OilHeating 3:ElectricHeating 4:Other
          case "1":
            energyCost += options.hotWaterHeatingEnergyConsumption * self.constants.heatingEnergyBuyPrices.districtHeating * energyCostAdjustment;
            energyCost += options.spaceHeatingEnergyConsumption * self.constants.heatingEnergyBuyPrices.districtHeating * energyCostAdjustment;
            break;
          case "2":
            energyCost += options.hotWaterHeatingEnergyConsumption * self.constants.heatingEnergyBuyPrices.oil * energyCostAdjustment;
            energyCost += options.spaceHeatingEnergyConsumption * self.constants.heatingEnergyBuyPrices.oil * energyCostAdjustment;
            break;
          case "3":
            energyCost += options.hotWaterHeatingEnergyConsumption * self.constants.electricityBuyPrice * energyCostAdjustment;
            energyCost += options.spaceHeatingEnergyConsumption * self.constants.electricityBuyPrice * energyCostAdjustment;
            break;
          case "4":
            break;
        }
      })

      return {
          year: currentYear + year,
          cost: energyCost
      };
    });
    return comparisonCost;
  };
  
  function getCurrentYear(){
    return new Date().getFullYear();
  }
  
  this.getPaybackTime = function(totalSystemCost, comparisonCost){
    var paybackElem = _.find(totalSystemCost, function(totalYearCost, index){
      return totalYearCost.cost <= comparisonCost[index].cost;
    });

    if(!paybackElem) return null;

    var paybackTime = paybackElem.year - totalSystemCost[0].year;
    return paybackTime;
  };
  
  return this;
}
