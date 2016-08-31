import {Utils} from './../../common/utils';
import * as $ from 'jquery';
import * as moment from 'moment';

export class SunburstHaloInfo {
	constructor() { }
	setTitle(title) {
		$('.title').text(title);
	}

	setPrice(price) {
		$('#AMOUNT').text('$' + Utils.formatMoney(price, 0));
	}
	setCountryInfo(country: any) {
		
		let itemTitle = country.key ? country.key : country.LEGEND_NAME;
		if (country.depth == 3) {
			var percentage = Math.round(country.value / country.parent.value * 100);
			var percentage2 = Math.round(country.parent.value / country.parent.parent.value * 100);
			var percentage3 = Math.round(country.parent.parent.value / country.parent.parent.parent.value * 100);
			$('.legend_depth_2 .legend--item--percentage--text').text(percentage + '%');
			$('.legend_depth_1 .legend--item--percentage--text').text(percentage2 + '%');
			$('.legend_depth_0 .legend--item--percentage--text').text(percentage3 + '%');
		}
		if (country.depth == 2) {
			var percentage = Math.round(country.value / country.parent.value * 100);
			var percentage2 = Math.round(country.parent.value / country.parent.parent.value * 100);
			$('.legend_depth_1 .legend--item--percentage--text').text(percentage + '%');
			$('.legend_depth_0 .legend--item--percentage--text').text(percentage2 + '%');
		}

		if (country.depth == 1) {
			var percentage = Math.round(country.value / country.parent.value * 100);
			$('.legend_depth_0 .legend--item--percentage--text').text(percentage + '%');
		}
		$('.LEGEND_NAME').text(itemTitle);
		$('.LEGEND_NAME_ALT').text(` for ${itemTitle}`);
		$('#info').removeClass();
		$('#info').addClass(`graph-depth-${country.depth}`);
		
		let amount = country.USD_AMOUNT ? country.USD_AMOUNT : country.value;
		let category = country.CATEGORY ? country.CATEGORY : country.key;
		if (country.FUNDING_CATEGORY) {
			category = country.FUNDING_CATEGORY;
		}
		let description = country.DESCRIPTION;
		if (!amount) { amount = '' }
		if (!category) { amount = '' }
		if (!description) { description = '' }
		
		$('#AMOUNT').text('$' + Utils.formatMoney(amount, 0));
		$('#CATEGORY').text(category);
		$('#DESCRIPTION').text(description);
		
	}

	reset() {
		$('#LEGEND_NAME').text('Total Contributions');
		$('.LEGEND_NAME_ALT').text('');
		$('.info__item_legend').hide();
		$('.legend_depth_1').hide();
		$('.legend_depth_2').hide();
		$('.legend_depth_0').hide();
	}
	
	setLastUpdatedDate(date) {
		$('.lastUpdated').text(`Contributions as of ${moment(date).format('MMMM Do YYYY')}`);
		$('.year').text(`(${moment(date).format('YYYY')})`);

	}
	createAncestors(ancestors) {

		$('.info__item_legend').show();
		if (ancestors.length === 3) { 

			let title = ancestors[1].LEGEND_NAME ? ancestors[1].LEGEND_NAME : ancestors[1].key;
			$('.legend_depth_2--name').text(ancestors[2].key);
			$('.legend_depth_2--name--alt').text(ancestors[1].key);
			$('.legend_depth_2--price').text(ancestors[2].value);
			$('.legend_depth_2').show();


			$('.legend_depth_1--name').text(ancestors[1].key);
			$('.legend_depth_1--name--alt').text(ancestors[0].key);
			$('.legend_depth_1--price').text(ancestors[1].value);
			$('.legend_depth_1').show();

			$('.legend_depth_0--name').text(ancestors[0].key);
			$('.legend_depth_0--price').text(ancestors[0].value);
			$('.legend_depth_0').show();


		 }
		if (ancestors.length === 2) {
			$('.legend_depth_1--name').text(ancestors[1].key);
			$('.legend_depth_1--name--alt').text(ancestors[0].key);
			$('.legend_depth_1--price').text(ancestors[1].value);
			$('.legend_depth_1').show();

			$('.legend_depth_0--name').text(ancestors[0].key);
			$('.legend_depth_0--price').text(ancestors[0].value);
			$('.legend_depth_0').show();
		}
		if (ancestors.length === 1) { 
			$('.legend_depth_0--name').text(ancestors[0].key);
			$('.legend_depth_0--price').text(ancestors[0].value);
			$('.legend_depth_0').show();
		 }
		

		
	}
}
