import './index.scss';
import $ from 'jquery';
import '../metaSlider/metaSlider';
import ControlPanel from '../../components/control/ControlPanel';

$(() => {
  const slider1 = $('#slider-1');
  const slider2 = $('#slider-2');
  const controlPanel1 = new ControlPanel('#config-slider-1', '#slider-1');
  const controlPanel2 = new ControlPanel('#config-slider-2', '#slider-2');

  slider1.metaSlider({
    step: 10,
    minValue: -50,
    maxValue: 150,
    initValueFirst: 20,
    initValueSecond: 70,
    showError: true,
  });

  slider2.metaSlider({
    customValues: ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ'],
  });

  controlPanel1.init();
  controlPanel2.init();
});
