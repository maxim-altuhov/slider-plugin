import getNameBrowser from './getNameBrowser';

function showMessageForIE() {
  const currentBrowser = getNameBrowser();
  const thisIsIEBrowser = (currentBrowser === 'Internet Explorer 11') || (currentBrowser === 'Internet Explorer');

  if (thisIsIEBrowser) {
    document.body.innerHTML = 'Internet Explorer is no longer supported, please switch to a more modern browser!';
  }
}

export default showMessageForIE;
