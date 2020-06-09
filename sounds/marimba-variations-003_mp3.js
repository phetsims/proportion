/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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';
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