function Profile() {
	
	this.profile = new Array();


	this.year = year;
	function year() {
		var hour;
		var sum = 0.0;
		for (hour=0; hour<8760; hour++) {
			sum += this.profile[hour];
		}
		return sum;
	}


	this.day = day;
	function day(day) {
		var hour;
		var sum = 0.0;
		for(hour=24*(day-1);hour<(24*day);hour++) {
			sum += this.profile[hour];
		}
		return sum;
	}


	this.month = month;
	function month(month) {
		var hour = 0;
		var sum = 0.0;
		var dayFrom = 1;
		var dayTo;
		var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		var monthIndex;
		var dayIndex;
		for( monthIndex=0;monthIndex<(month-1);monthIndex++) {
			dayFrom += daysInMonth[monthIndex]
		}
		dayTo = dayFrom + daysInMonth[month-1];
		for(dayIndex=dayFrom;dayIndex<dayTo;dayIndex++) {
			sum += this.day(dayIndex);
		}
		return sum;
	}


	this.hour = hour;
	function hour(hour) {
		return this.profile[hour];		
	}


	this.period = period;
	function period(periodStartYear, periodStartMonth, periodEndYear, periodEndMonth) {
	var year = periodStartYear;
	var month = periodStartMonth;
	var sum = 0.0;
		while( year <= periodEndYear && ( year < periodEndYear || month <= periodEndMonth) ) {
			sum += this.month(month);
			month++;
			if( month > 12 ) {
				month = 1;
				year++;
			}
		}
		return sum;
	}
}
