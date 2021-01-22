/* eslint-disable */
import asyncLoader from '../../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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QDBeAB90AIhOVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWCBuywAQAAAODG1UmFnaDaP/SBRaLthQBiWVOy1QNLBU6S6ExBTUUzLjk5LjVVVVX/+xDEqAGCoAEHoARAMHyEGgQAsABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVOXaFTEFNRTMuOTkuNVVVVf/7EMS3AINUHNRAGUJAPgAesAAIBlVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy45OS41VVVV//sQxMsAQxgC56AMQCBPA5oUAwhMVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjk5LjVVVVX/+xDE3gBB7ADroIRCYE4H2eRxiJhVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuOTkuNVVVVf/7EMTkgEHIAQ3ABEAwOoLaJBAUBFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQxOeAQkQe1aCAQCBDgB00AAgGVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xDE14PAWAIADgAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EMTWA8AAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQxNYDwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xDE1gPAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = asyncLoader.createLock( soundURI );
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