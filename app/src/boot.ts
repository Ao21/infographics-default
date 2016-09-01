import * as d3 from 'd3';
import {Subject} from 'rxjs/Rx';

import {DataService} from './services/data';
import {SunburstHalo} from './component/sunburst_halo/sunburst_halo';
import {WorldProjection} from './component/projection/projection';

export class Bootstrap {
  data: DataService = new DataService();
  sunburstHalo: SunburstHalo = new SunburstHalo();
  worldProjection: WorldProjection = new WorldProjection();

  resizeEvent: Subject<any> = new Subject();

  constructor() {

    this.init();
    this.resizeEvent.debounceTime(500).subscribe(next => {
      d3.select('#graph').selectAll("*").remove();
      this.init();
    });

  }

  init() {
    this.data.loadData().then((next) => {
      this.sunburstHalo.init(next);

      window.onresize = (event) => {
        this.resizeEvent.next(true);
      };

    }).catch((err) => {
      console.log(err);
    });
  }
}

let app = new Bootstrap();