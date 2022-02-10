import getNameBrowser from './getNameBrowser';

function showMessageForIE() {
  const currentBrowser = getNameBrowser();

  if (currentBrowser === 'Internet Explorer 11' || currentBrowser === 'Internet Explorer') {
    document.body.innerHTML = 'Браузер Internet Explorer больше не поддерживается, пожалуйста, перейдите в более современный браузер!';
  }
}

export default showMessageForIE;
