import $ from 'jquery';
import './index.scss';
import '../metaSlider/metaSlider';
import ControlPanel from './ts/ControlPanel';

$(() => {
  const controlPanel1 = new ControlPanel('#config-slider-1', '#slider-1');
  const controlPanel2 = new ControlPanel('#config-slider-2', '#slider-2');

  $('#slider-1').metaSlider({
    step: 10,
    minValue: 0,
    maxValue: 100,
    initValueFirst: 0,
    initValueSecond: 50,
    showError: true,
  });

  $('#slider-2').metaSlider({
    customValues: ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ'],
    initValueFirst: 1,
    initValueSecond: 2,
  });

  controlPanel1.init();
  controlPanel2.init();
});
