import './index.scss';

import $ from 'jquery';
import ControlPanel from './js/ControlPanel';
import '../MetaSlider/jquery.MetaSlider';

$(() => {
  const slider1 = $('#slider-1');
  const controlPanel1 = new ControlPanel('#config-slider-1', slider1);

  slider1.metaSlider({
    step: 1,
    initValueFirst: 50,
    // showMarkers: false,
    // customValues: ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ'],
    // isVertical: true,
    showTheScale: false,
    showMinAndMax: true,
  });
  controlPanel1.init();
});
