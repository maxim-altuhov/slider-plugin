import $ from 'jquery';
import './index.scss';
import '../metaSlider/metaSlider';
import ControlPanel from './ts/ControlPanel';

$(() => {
  const controlPanel1 = new ControlPanel('#config-slider-1', '#slider-1');
  const controlPanel2 = new ControlPanel('#config-slider-2', '#slider-2');
  const controlPanel3 = new ControlPanel('#config-slider-3', '#slider-3');
  const controlPanel4 = new ControlPanel('#config-slider-4', '#slider-4');

  $('#slider-1').metaSlider({
    step: 5,
  });

  $('#slider-2').metaSlider({
    mainColor: '#ffb13c',
    secondColor: '#fbd3b0',
    colorForScale: '#814100',
    colorBorderForThumb: '#a9521e',
    colorBorderForMarker: '#a9521e',
    colorTextForMarker: '#000',
    customValues: ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ'],
    initValueFirst: 1,
    initValueSecond: 3,
  });

  $('#slider-3').metaSlider({
    mainColor: 'red',
    minValue: -50,
    maxValue: 50,
    step: 10,
    initValueFirst: -30,
    initValueSecond: 30,
    postFix: ' °C',
  });

  $('#slider-4').metaSlider({
    mainColor: '#47a947',
    minValue: 0,
    maxValue: 1000,
    step: 100,
    initValueSecond: 200,
    isRange: false,
    preFix: '$ ',
    isVertical: true,
    showBackground: false,
  });

  controlPanel1.init();
  controlPanel2.init();
  controlPanel3.init();
  controlPanel4.init();
});
