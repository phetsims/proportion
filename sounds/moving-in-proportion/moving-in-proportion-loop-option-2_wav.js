/* eslint-disable */
import simLauncher from '../../../joist/js/simLauncher.js';
import base64SoundToByteArray from '../../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../../tambo/js/phetAudioContext.js';

const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = simLauncher.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();
const onDecodeSuccess = decodedAudio => {
  wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
  unlock();
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBufferProperty.set( phetAudioContext.createBuffer( 1, 0, phetAudioContext.sampleRate ) );
  unlock();
};
phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
export default wrappedAudioBuffer;