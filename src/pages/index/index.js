import './index.scss';

import $ from 'jquery';
import ControlPanel from './components/control/js/ControlPanel';
import '../MetaSlider/jquery.MetaSlider';

$(() => {
  const slider1 = $('#slider-1');
  const controlPanel1 = new ControlPanel('#config-slider-1', slider1);

  slider1.metaSlider({
    step: 1,
    initValueFirst: 12,
    minValue: 10,
    maxValue: 20,
    showScale: true,
    // customValues: ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ'],
  });
  controlPanel1.init();
});
