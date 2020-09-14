/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';

const image = new Image();
const unlock = simLauncher.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANIAAADRCAYAAAC5DezsAAAACXBIWXMAABcRAAAXEQHKJvM/AAABg0lEQVR4nO3dYW3DMBSF0ZeqQAalBWAOY5JBKQcTCIRCKJQqDPbWK23NzgFgOXn+fiWSCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgF+3dDYwxrhU1cXYOLjbnPPRecRz833sEa1OEQe3VVUrpJMTAa8TEgQICQKEBAFCggAhQYCQIEBIECAkAAAAAAAAAAAAAAAAAAAAAAAAAAAA+PcAAAAAAAAAAP62pbO7McZXVa1mysFd55xb5xHdag4BQoIAIUGAkCBASBAgJAgQEgQICQKEBAHn5hKtr73wph4GBwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEDI0l1mjPFRVZ8GwMHd5pzfvku2exnzbg9pdYo4uK1zKfPJaYDXCQkChAQBQoIAIUGAkCBASBAgJAgQEgT85M+Ge1VdvXwO7m7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAb6Sqnm7pF2k1+BWUAAAAAElFTkSuQmCC';
export default image;