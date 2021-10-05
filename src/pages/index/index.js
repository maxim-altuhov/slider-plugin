import './index.scss';

import $ from 'jquery';
import '../MetaSlider/jquery.MetaSlider';

$(() => {
  const slider = $('#slider');
  const slider2 = $('#slider2');

  slider.metaSlider({
    step: 5,
    initValueFirst: 50,
    // showTheScale: false,
    // showMinAndMax: true,
  });
  slider2.metaSlider({
    step: 10,
    initValueFirst: 10,
  });

  slider.metaSlider('setProp', 'mainColor', '#000');
});
