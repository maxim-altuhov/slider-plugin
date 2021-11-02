import './index.scss';

import $ from 'jquery';
import '../MetaSlider/MetaSlider';
import ControlPanel from '../../components/control/ts/ControlPanel';

$(() => {
  const slider1 = $('#slider-1');
  const controlPanel1 = new ControlPanel('#config-slider-1', '#slider-1');

  slider1.metaSlider({
    step: 10,
    initValueFirst: 0,
    initValueSecond: 80,
    showScale: true,
    minValue: -10,
    // customValues: ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ'],
  });

  controlPanel1.init();
});
