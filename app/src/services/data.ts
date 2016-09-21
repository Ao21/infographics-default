import * as Promise from 'bluebird';
import * as d3 from 'd3';

export class DataService {
    constructor() {
    }

    loadData() {
        return new Promise((res, rej) => {
            var query: any = window['GRAPH_OPTIONS'];

            if (!query) {
                query = {
                    year: 2016,
                    country: 'denmark',
                    graph: 'chart'
                };
            }

            d3.json(`http://localhost:5000/api/infographics/${query.country}/${query.graph}`, (data) => {
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
