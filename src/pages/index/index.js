import './index.scss';

import $ from 'jquery';
import ControlPanel from './js/ControlPanel';
import '../MetaSlider/jquery.MetaSlider';

$(() => {
  const slider1 = $('#slider-1');
  const slider2 = $('#slider-2');
  const controlPanel1 = new ControlPanel('#config-slider-1', slider1);
  const controlPanel2 = new ControlPanel('#config-slider-2', slider2);

  slider1.metaSlider({
    step: 1,
    initValueFirst: 150,
    // customValues: ['ПН', 'ВТ', 'СР'],
    // isVertical: true,
    // showTheScale: false,
    // showMinAndMax: true,
  });
  slider2.metaSlider({
    step: 10,
    initValueFirst: 10,
  });

  controlPanel1.init();
  controlPanel2.init();
});
