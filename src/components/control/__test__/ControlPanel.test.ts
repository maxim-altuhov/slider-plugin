/* eslint-disable @typescript-eslint/dot-notation */
import ControlPanel from '../ControlPanel';

document.body.innerHTML = '';
document.body.innerHTML = `<div class="fake-selector"></div> 
<div class="fake-control-panel">
  <input type="text" name="mainColor">
</div>`;

const fakeSliderSelector = '.fake-selector';
const fakeControlPanel = '.fake-control-panel';
const controlPanel = new ControlPanel(fakeControlPanel, fakeSliderSelector);
controlPanel['_$sliderSelector'].metaSlider = jest.fn();

controlPanel.init();

describe('Checking the "ControlPanel" component', () => {
  test('test', () => {});
});
