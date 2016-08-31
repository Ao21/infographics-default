import * as _ from 'lodash';
import * as recursive from 'lodash-recursive';
import {Utils} from './../../common/utils';

export class SunburstHaloUtils {

	constructor() {

	}

    static defs() {
        let scope: any = {};
        scope.id = 'SUNBURST_HALO';
        scope.size = {
            width: 600,
            height: 600
        };

        scope.duration = 500;
        scope.padAngle = 1;
        scope.margin = {
            "top": "0%",
            "bottom": "7%",
            "left": "0%",
            "right": "7%"
        }
		scope.size = Utils.size(scope.margin, scope.size.width, scope.size.height);
		scope.radius = Math.min(scope.size.width, scope.size.height) / 2;
		scope.arcThickness = 10;
        return scope;

    }
	static getIds(data) {
		let output = [];
		data.forEach(function (d) {
            if (output.indexOf(d.ID) === -1) {
                output.push(d.ID);
            }
        });
		return output;

	}
	static innerR(radius, d) {
		return radius * Math.sqrt(d.y) / 10;
	}
	static outerR(radius, d) {

		return radius * Math.sqrt(d.y + d.dy) / 10 - 20;
	}
	static getAncestors(node) {
		var path = [];
		var current = node;
		while (current.parent) {
			path.unshift(current);
			current = current.parent;
		}
		return path;
	}

	static getSummedAmountPerCategory(values) {
		_.forEach(values, (category) => {
			let totals =
				_.reduce(_.filter(category.values, (z: any) => { return z.TYPE === 'Total'; })
					, (sum = 0, z: any) => {
						return sum + Number(z.USD_AMOUNT);
					}, 0);
			category.aggregate = totals;
		});
	}

	static averageEntryByCategory(agg, entries) {
		_.forEach(entries, (entry)=> {
			entry.value = entry.USD_AMOUNT / agg;
		})
	}


    static sumAmounts(data) {
		_.forEach(data, (e) => {
			console.log(e);
			this.getSummedAmountPerCategory(e.values);
			_.forEach(e.values, (x) => {
				x.values = _.filter(x.values, (z: any) => { return z.TYPE === 'Total'; });
				this.averageEntryByCategory(x.aggregate, x.values);
			});
		});
		_.forEach(data, (e) => {
			e.COUNTRY_NAME = e.key
			let totalCategory = _.reduce(e.values, (sum, o: any) => {
				return sum += Number(o.aggregate);
			}, 0);
			_.forEach(e.values, (x) => {
				delete x.values;
				x.COUNTRY_NAME = e.key
				x.value = x.aggregate / totalCategory;
			});
			e.value = 1;
		});
		return data;
	}
}
