import './index.scss';

import $ from 'jquery';
import ControlPanel from './components/control/ts/ControlPanel';
import '../MetaSlider/MetaSlider';

$(() => {
  const slider1 = $('#slider-1');
  const controlPanel1 = new ControlPanel('#config-slider-1', slider1);

  slider1.metaSlider({
    step: 10,
    initValueFirst: 10,
    initValueSecond: 80,
    showScale: true,
    // customValues: ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ'],
  });

  controlPanel1.init();
});
