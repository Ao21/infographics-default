import * as Promise from 'bluebird';
import * as d3 from 'd3';

export class DataService {
    constructor() {
    }

    loadData() {
        return new Promise((res, rej) => {
            var query: any = window['GRAPH_OPTIONS'];

            if (!query) {
                query = { "country": "denmark", "graph": "sunburstProjection", "translations": { "totalContributions": "Totale bidrag til", "unhcr": "Totale bidrag til UNHCR", "contributions": "Sist opdateret", "comprises": "Udgør <span class=\"percentage\"></span> af", "total": "<span>Totale</span> bidrag til <span class=\"country_name\"></span>", "countryName": "Danmark" } }
            }

            d3.json(`/api/infographics/${query.country}/${query.graph}`, (data) => {
                res(data);
            });

            // d3.json(`/api/infographics/${query.country}/${query.graph}`, (data) => {
            //     if (data.length == 0) {
            //         return rej(new Error('There was no data'));
            //     }
            //     return res(data);
            // });
        });
    }
};
