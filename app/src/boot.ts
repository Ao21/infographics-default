import * as d3 from 'd3';
import {Subject} from 'rxjs/Rx';

import {DataService} from './services/data';
import {SunburstHalo} from './component/sunburst_halo/sunburst_halo';
import {SunburstHaloSummed} from './component/sunburst_halo_summed/sunburst_halo_summed';
import {WorldProjection} from './component/projection/projection';
import {Styling} from './styling/styling';

export class Bootstrap {
  data: DataService = new DataService();
  sunburstHalo: SunburstHalo = new SunburstHalo();
  worldProjection: WorldProjection = new WorldProjection();
  sunburstHaloSummed: SunburstHaloSummed = new SunburstHaloSummed();
  styles: Styling = new Styling();

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
      // this.sunburstHaloSummed.init(next);
      this.sunburstHalo.init(next);
      //this.StackedBar.init(next);

      this.styles.setStyles(this.sunburstHalo.vis);
      window.onresize = (event) => {
        this.resizeEvent.next(true);
      };


    }).catch((err) => {
      console.log(err);
    });
  }
}

let app = new Bootstrap();