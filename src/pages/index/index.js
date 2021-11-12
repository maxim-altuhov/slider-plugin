import './index.scss';

import $ from 'jquery';
import '../MetaSlider/MetaSlider';
import ControlPanel from '../../components/control/ts/ControlPanel';

$(() => {
  const slider1 = $('#slider-1');
  // const slider2 = $('#slider-2');
  const controlPanel1 = new ControlPanel('#config-slider-1', '#slider-1');
  // const controlPanel2 = new ControlPanel('#config-slider-2', '#slider-2');

  slider1.metaSlider({
    step: 20,
    initValueFirst: 20,
    initValueSecond: 80,
    minValue: -50,
    maxValue: 150,
    // customValues: ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ'],
  });

  // slider2.metaSlider({
  //   customValues: ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ'],
  // });

  controlPanel1.init();
  // controlPanel2.init();
});
