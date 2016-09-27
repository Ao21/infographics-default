import * as _ from 'lodash';
import * as recursive from 'lodash-recursive';
import { Utils } from './../../common/utils';
import * as $ from 'jquery';

let entryId = 0;


export class SunburstHaloUtils {

	constructor() {

	}

	static defs() {
		let scope: any = {};
		scope.id = 'SUNBURST_HALO';
		let windowSize = Utils.getPageSize();

		let w = document.getElementById('graph').offsetWidth;
		scope.size = {
			width: w,
			height: w
		};

		scope.duration = 500;
		scope.padAngle = 1;
		scope.margin = {
			"top": "0%",
			"bottom": "7%",
			"left": "0%",
			"right": "0%"
		};
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
	static outerR(radius, d, size) {
		let r = 20;
		if (Utils.getPageSize().width <= 786) {
			r = 5;
		}
		return radius * Math.sqrt(d.y + d.dy) / 10 - r;
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

	static addHiddenChildTotals(values, localMode?, localTranslations?) {
		let modeType = localMode ? 'AMOUNT' : 'USD_AMOUNT';
		let childValues = values;
		// Add the Totals Together
		let childEntryTotalAgg =
			_.reduce(_.filter(childValues, (z: any) => { return z.TYPE === 'Total'; })
				, (sum = 0, z: any) => {
					return sum + Number(z[modeType]);
				}, 0);
		// Get the Sub Category child entires
		values = _.filter(childValues, (z: any) => { return z.TYPE !== 'Total'; });
		if (values.length == 0) {
			// No Deducated Entries
			values = childValues;
		} else {
			// Get the SubCategory child entry Values that aren't totals
			let subValueTotals = _.reduce(_.filter(childValues, (z: any) => { return z.TYPE != 'Total'; })
				, (sum = 0, z: any) => {
					return sum + Number(z[modeType]);
				}, 0);
			// If The Subcategory Entry Values dont add up to the Subcategory Total Value
			// Insert a hidden arc on the circle
			if (subValueTotals !== childEntryTotalAgg) {
				values.push({
					AMOUNT: childEntryTotalAgg - subValueTotals,
					CATEGORY: "Flexible Earmark",
					FUNDING_CATEGORY: "Emergency Reserve",
					TYPE: 'Hidden'
				})
			}
		}
		return values;
	}

	static hasChildren(node) {
		let children = _.find(node.values, e => {
			return e['values'];
		})
		return children ? true : false;
	}

	static findProp(obj, propName) {
		let a;
		_.forEach(obj, (e) => {
			if (e.values) {
				_.forEach(e.values, (x) => {
					if (x[propName]) {
						a = x[propName];
					} else {
						a = this.findProp(x.values, propName);
					}
				});
			} else if (e[propName]){
				a = e[propName];
			}
		});
		return a;
	}


	static sumAmounts(data, localMode?, localTranslations?) {
		var curr = this.findProp(data, 'CURRENCY');
		$('.currency_selector button[data-type="local"]').text(curr);
		
		entryId = 0;
		let d = _.cloneDeep(data);
		_.forEach(d, (e) => {
			e.id = entryId++;
			let obj = {};
			_.forEach(e.values, (x) => {
				if (x.key) {
					
					e.CATEGORY_REF = x.values[0].CATEGORY_REF;
					e.CURRENCY = x.values[0].CURRENCY;
					// Add the Hidden Child Value Totals
					e.CURRENCY = x.values[0].CURRENCY;
					x.values = this.addHiddenChildTotals(x.values, localMode);
					// Set the Sub Category to the same category as its child entries
					x.CATEGORY = e.key + ': ' + x.values[0].FUNDING_CATEGORY;
					x.CATEGORY_REF = x.values[0].FUNDING_CATEGORY_REF;
				} else {
					e.CATEGORY_REF = x.CATEGORY_REF;
				}
			});

			if (!this.hasChildren(e)) {
				e.values = this.addHiddenChildTotals(e.values, localMode);
			}

			// e.value = _.reduce(e.values, (sum, o: any) => {
			// 	return sum += Number(o.AMOUNT) ? Number(o.AMOUNT) : Number(o.value);
			// }, 0);

		});
		recursive.map(d, (node, recursive, map) => {
			if (node.values) {
				recursive(node.values);
			}
			return map(node);
		}, (node) => {
			if (node.USD_AMOUNT || node.AMOUNT) {
				node.value = localMode ? node.AMOUNT : node.USD_AMOUNT;
			}
			if (!node.key) {
				node.key = node.LEGEND_NAME;
			}
			node.CURRENCY = curr;
			node.id = entryId++;

			return node;
			});
		return d;
	}
}