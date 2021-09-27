import './index.scss';

import $ from 'jquery';
import '../MetaSlider/MetaSlider';

$(() => {
  $('#slider').metaSlider({
    step: 5,
  });
});
