import {Utils} from './../../common/utils';
import * as $ from 'jquery';
import * as moment from 'moment';

export class SunburstHaloInfo {
	constructor() {

	}
	setTitle(title) {
		$('.legend__title h1 span.primary').text(title);
	}

	setPrice(price, currency) {
		let cur = currency ? `${currency} ` : 'USD $';
		$('.legend__amount h3').text(cur + Utils.formatMoney(price, 0));
	}
	setCountryInfo(country: any, localMode?: boolean) {
		let itemTitle = country.key ? country.key : country.LEGEND_NAME;
		if (country.depth == 3) {
			var percentage = Math.round(country.value / country.parent.value * 100);
			var percentage2 = Math.round(country.parent.value / country.parent.parent.value * 100);
			var percentage3 = Math.round(country.parent.parent.value / country.parent.parent.parent.value * 100);
			$('.legend-item-1 .percentage').text(percentage + '%');
			$('.legend-item-2 .percentage').text(percentage2 + '%');
			$('.legend-item-3 .percentage').text(percentage3 + '%');
		}
		if (country.depth == 2) {
			var percentage = Math.round(country.value / country.parent.value * 100);
			var percentage2 = Math.round(country.parent.value / country.parent.parent.value * 100);
			$('.legend-item-2 .percentage').text(percentage + '%');
			$('.legend-item-3 .percentage').text(percentage2 + '%');
		}

		if (country.depth == 1) {
			var percentage = Math.round(country.value / country.parent.value * 100);
			$('.legend-item-3 .percentage').text(percentage + '%');
		}
		$('.legend__sub-title h4').text(itemTitle);
		$('.country_name').text(` ${itemTitle}`);
		$('#info').removeClass();
		$('#info').addClass(`graph-depth-${country.depth}`);
		let amount, currency;
		if (!localMode) {
			currency = null;
			amount = country.USD_AMOUNT ? country.USD_AMOUNT : country.value;
		} else {
			currency = country.CURRENCY ? country.CURRENCY : country.parent.CURRENCY;
			amount = country.AMOUNT ? country.AMOUNT : country.value;
		}
		
		let category = country.CATEGORY ? country.CATEGORY : country.key;
		if (country.FUNDING_CATEGORY) {
			category = country.FUNDING_CATEGORY;
		}
		let description = country.DESCRIPTION;
		if (!amount) { amount = ''; }
		if (!category) { amount = ''; }
		if (!description) { description = ''; }
		
		this.setPrice(amount, currency);

		$('#CATEGORY').text(category);
		$('#DESCRIPTION').text(description);
		
	}


	reset() {
		$('.legend__sub-title h4').text('Total Contributions');
		$('.LEGEND_NAME_ALT').text('');
		$('.info__item_legend').hide();
		$('.legend-item-1, .legend-item-2, .legend-item-3').removeClass('active');
	}
	
	setLastUpdatedDate(date) {
		$('.lastUpdated').text(`Contributions as of ${moment(date).format('MMMM Do YYYY')}`);
		$('.year').text(`(${moment(date).format('YYYY')})`);

	}
	createAncestors(ancestors) {

		$('.info__item_legend').show();
		$('.legend-item, .breadcrumb__item').removeClass('active first last');

		if (ancestors.length === 3) { 
			$('.legend__amount figure').removeClass('isTotal');
			let title = ancestors[1].LEGEND_NAME ? ancestors[1].LEGEND_NAME : ancestors[1].key;
			$('.legend-item-1-text').text(ancestors[2].key);
			$('.legend-item-1-description').text(ancestors[1].key);
			$('.legend-item-1-price').text(ancestors[2].value);
			$('.legend-item-1').addClass('active first');


			$('.legend-item-2-text').text(ancestors[1].key);
			$('.legend-item-2-description').text(ancestors[0].key);
			$('.legend-item-2-price').text(ancestors[1].value);
			$('.legend-item-2').addClass('active');

			$('.legend-item-3-text').text(ancestors[0].key);
			$('.legend-item-3-price').text(ancestors[0].value);
			$('.legend-item-3').addClass('active last');


		 }
		if (ancestors.length === 2) {
			$('.legend__amount figure').removeClass('isTotal');
			$('.legend-item-2-text').text(ancestors[1].key);
			$('.legend-item-2-description').text(ancestors[0].key);
			$('.legend-item-2-price').text(ancestors[1].value);
			$('.legend-item-2').addClass('active first');

			$('.legend-item-3-text').text(ancestors[0].key);
			$('.legend-item-3-price').text(ancestors[0].value);
			$('.legend-item-3').addClass('active last');
		}
		if (ancestors.length === 1) { 
			$('.legend__amount figure').removeClass('isTotal');
			$('.legend-item-3-text').text(ancestors[0].key);
			$('.legend-item-3-price').text(ancestors[0].value);
			$('.legend-item-3').addClass('active first solo');
		 }

		 if (ancestors.lenght === 0) {
			 $('.legend__amount figure').addClass('isTotal');
		 }
		

		
	}
}
