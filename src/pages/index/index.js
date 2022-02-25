import $ from 'jquery';

import '../metaSlider/metaSlider';
import showMessageForIE from './utils/showMessageForIE';
import ControlPanel from './ts/ControlPanel';
import './index.scss';

$(() => {
  showMessageForIE();

  const $slider1 = $('#slider-1');
  const $slider2 = $('#slider-2');
  const $slider3 = $('#slider-3');
  const $slider4 = $('#slider-4');
  const controlPanel1 = new ControlPanel($('#config-slider-1'), $slider1);
  const controlPanel2 = new ControlPanel($('#config-slider-2'), $slider2);
  const controlPanel3 = new ControlPanel($('#config-slider-3'), $slider3);
  const controlPanel4 = new ControlPanel($('#config-slider-4'), $slider4);

  $slider1.metaSlider();

  $slider2.metaSlider({
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

  $slider3.metaSlider({
    mainColor: 'red',
    minValue: -50,
    maxValue: 50,
    step: 10,
    initValueFirst: -30,
    initValueSecond: 30,
    postFix: ' °C',
  });

  $slider4.metaSlider({
    mainColor: '#47a947',
    minValue: 0,
    maxValue: 1000,
    step: 100,
    initValueSecond: 500,
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
