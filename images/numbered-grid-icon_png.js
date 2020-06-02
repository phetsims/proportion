/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
const image = new Image();
const unlock = simLauncher.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;