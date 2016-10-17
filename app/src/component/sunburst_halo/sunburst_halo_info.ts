import {Utils} from './../../common/utils';
import {SunburstHaloTranslation} from './sunburst_halo_translation';

import * as $ from 'jquery';
import * as moment from 'moment';

export class SunburstHaloInfo {
	translations: SunburstHaloTranslation = new SunburstHaloTranslation();
	textUsed: any;
	_country: string;
	_year: string;
	useLocal: boolean = false;

	constructor() {

	}

	set year(year) {
		this._year = year;
	}	
	set country(country) {
		this._country = country;
		this.translations.defaults.countryName = country.name;
		this.textUsed = this.translations.defaults;
	}

	useLocalTranslations(localTranslations, country) {
		this.translations.local = localTranslations;
		this.useLocal = true;
		this.textUsed = this.translations.local;
	}

	useEnglishTranslations() {
		this.textUsed = this.translations.defaults;
	}

	setTitle() {
		$('.legend__title h1 span.primary,span.country_name').text(`${this.textUsed.countryName} (${this._year})`);
	}
	setPrice(price, currency?) {
		let cur = currency ? `${currency} ` : 'USD $';
		$('.legend__amount h3').text(cur + Utils.formatMoney(price, 0));
	}

	countParentItems(country, n) {
		if (country.parent) {
			n++;
			return this.countParentItems(country.parent, n);
		} else {
			return n;
		}
	};
	setCountryInfo(country: any, localMode?: boolean) {
		let itemTitle = country.LEGEND_NAME ? country.LEGEND_NAME : country.key;
		if (this.useLocal) {
			let categoryTranslation = country.CATEGORY_REF.translationsDict[this._country['name_lower']];
			itemTitle = country.LEGEND_NAME ? country.LEGEND_NAME_LOCAL : categoryTranslation.translation;
		}
		let depth = this.countParentItems(country, 0);
		if (depth == 3) {
			var percentage = Math.round(country.value / country.parent.value * 100);
			var percentage2 = Math.round(country.parent.value / country.parent.parent.value * 100);
			var percentage3 = Math.round(country.parent.parent.value / country.parent.parent.parent.value * 100);
			$('.legend-item-1 .percentage').text(percentage + '%');
			$('.legend-item-2 .percentage').text(percentage2 + '%');
			$('.legend-item-3 .percentage').text(percentage3 + '%');
		}
		if (depth == 2) {
			var percentage = Math.round(country.value / country.parent.value * 100);
			var percentage2 = Math.round(country.parent.value / country.parent.parent.value * 100);
			$('.legend-item-2 .percentage').text(percentage + '%');
			$('.legend-item-3 .percentage').text(percentage2 + '%');
		}

		if (depth == 1) {
			var percentage = Math.round(country.value / country.parent.value * 100);
			$('.legend-item-3 .percentage').text(percentage + '%');
		}
		$('.legend__sub-title h4, span.country_name').text(itemTitle);
		$('#info').removeClass();
		$('#info').addClass(`graph-depth-${depth}`);
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


	reset(year) {
		if (this.useLocal) {
			$('.legend__sub-title h4').text(this.textUsed.totalContributions + ' ' + year);
		} else {
			$('.legend__sub-title h4').text(`Total Contribution for ${year}`);
		}

		$('.LEGEND_NAME_ALT').text('');
		$('.info__item_legend').hide();
		$('.legend-item-1, .legend-item-2, .legend-item-3').removeClass('active');
	}

	setLastUpdatedDate(date) {
		if (this.useLocal) {
			$('.lastUpdated').text(this.textUsed.contributions + ' ' + `${moment(date).format('MMMM Do YYYY')}`);
		}
		else {
			$('.lastUpdated').text(`Contributions as of ${moment(date).format('MMMM Do YYYY')}`);
		}

		$('.year').text(`(${moment(date).format('YYYY')})`);

	}
	createAncestors(ancestors) {
		let anc1Text, anc2Text, anc3Text;
		if (this.useLocal) {
			if (ancestors[2]) {
				anc1Text = ancestors[2].LEGEND_NAME ? ancestors[2].LEGEND_NAME_LOCAL :
					ancestors[2].CATEGORY_REF.translationsDict[this._country['name_lower']].translation;

			}
			if (ancestors[1]) {
				anc2Text = ancestors[1].LEGEND_NAME ? ancestors[1].LEGEND_NAME_LOCAL :
					ancestors[1].CATEGORY_REF.translationsDict[this._country['name_lower']].translation;
			}

			if (ancestors[0]) {
				anc3Text = ancestors[0].LEGEND_NAME ? ancestors[0].LEGEND_NAME_LOCAL :
					ancestors[0].CATEGORY_REF.translationsDict[this._country['name_lower']].translation;
			}

		} else {
			if (ancestors[2]) {
				anc1Text = ancestors[2].key;
			}
			if (ancestors[1]) {
				anc2Text = ancestors[1].key;
			 }
			if (ancestors[0]) {
				anc3Text = ancestors[0].key;
			}
			
		}
		$('.info__item_legend').show();
		$('.legend-item, .breadcrumb__item').removeClass('active first last');

		if (ancestors.length === 3) {
			$('.legend__amount figure').removeClass('isTotal');
			$('.legend-item-1-text').text(anc1Text);
			$('.legend-item-1-description').text(anc2Text);
			$('.legend-item-1-price').text(ancestors[2].value);
			$('.legend-item-1').addClass('active first');


			$('.legend-item-2-text').text(anc2Text);
			$('.legend-item-2-description').text(anc3Text);
			$('.legend-item-2-price').text(ancestors[1].value);
			$('.legend-item-2').addClass('active');

			$('.legend-item-3-text').text(anc3Text);
			$('.legend-item-3-price').text(ancestors[0].value);
			$('.legend-item-3').addClass('active last');


		}
		if (ancestors.length === 2) {
			$('.legend__amount figure').removeClass('isTotal');
			$('.legend-item-2-text').text(anc2Text);
			$('.legend-item-2-description').text(anc3Text);
			$('.legend-item-2-price').text(ancestors[1].value);
			$('.legend-item-2').addClass('active first');

			$('.legend-item-3-text').text(anc3Text);
			$('.legend-item-3-price').text(ancestors[0].value);
			$('.legend-item-3').addClass('active last');
		}
		if (ancestors.length === 1) {
			$('.legend__amount figure').removeClass('isTotal');
			$('.legend-item-3-text').text(anc3Text);
			$('.legend-item-3-price').text(ancestors[0].value);
			$('.legend-item-3').addClass('active first solo');
		}

		if (ancestors.lenght === 0) {
			$('.legend__amount figure').addClass('isTotal');
		}



	}
}
