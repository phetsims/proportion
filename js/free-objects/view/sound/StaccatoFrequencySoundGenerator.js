// Copyright 2020, University of Colorado Boulder

/**
 *
 * Marimba bonks that change frequency based on the fitness of the Proportion
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import Property from '../../../../../axon/js/Property.js';
import LinearFunction from '../../../../../dot/js/LinearFunction.js';
import merge from '../../../../../phet-core/js/merge.js';
import SoundClip from '../../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator from '../../../../../tambo/js/sound-generators/SoundGenerator.js';
import soundManager from '../../../../../tambo/js/soundManager.js';
import brightMarimbaSound from '../../../../../tambo/sounds/bright-marimba_mp3.js';
import pizzC3Sound from '../../../../sounds/pizz-C3_mp3.js';
import pizzC4Sound from '../../../../sounds/pizz-C4_mp3.js';
import designingProperties from '../../../common/designingProperties.js';
import RatioAndProportionQueryParameters from '../../../common/RatioAndProportionQueryParameters.js';
import ratioAndProportion from '../../../ratioAndProportion.js';
import SoundClipChord from './SoundClipChord.js';

// constants
const majorThirdPlaybackSpeed = Math.pow( 2, 4 / 12 );
const SOUND_CHOICES = [ null, null, null, null, null, brightMarimbaSound, pizzC3Sound, pizzC4Sound ];

class StaccatoFrequencySoundGenerator extends SoundGenerator {

  /**
   * @param {Property.<number>} fitnessProperty
   * @param {Range} fitnessRange
   * @param {Object} [options]
   */
  constructor( fitnessProperty, fitnessRange, options ) {
    options = merge( {
      initialOutputLevel: 0.7
    }, options );
    super( options );

    // @private
    this.tonicSoundClip = null;
    this.thirdSoundClip = null;
    this.singleSuccessSoundClip = null;
    this.singleSuccess7Chord = null;
    this.singleSuccessMajorChord = null;
    this.singleArpeggiatedChord = null;

    // @private - possibly temporary, for making single success note sound more airy, and then being able to set the
    // reverb back to its original state before this type changed it.
    this.defaultReverb = soundManager.reverbLevel;

    // this is to handle the case where proportionFitnessSoundSelectorProperty isn't a staccato sound on startup
    this.wireUpSoundClips( brightMarimbaSound );

    designingProperties.proportionFitnessSoundSelectorProperty.link( selection => {

      const sound = SOUND_CHOICES[ selection ];

      if ( sound ) {
        this.wireUpSoundClips( sound );
      }
    } );

    // @private
    this.fitnessProperty = fitnessProperty;
    this.fitnessRange = fitnessRange;

    // @private
    this.timeLinearFunction = new LinearFunction( fitnessRange.min, fitnessRange.max, 500,
      RatioAndProportionQueryParameters.staccatoMaxFrequency, true );

    // @private {number} - in ms
    this.timeSinceLastPlay = 0;
    this.playCount = 0; // number of times the staccato tone has played
  }

  /**
   * TODO: this is just to support multiple sound options, and won't need to be this complicated once things settle, see https://github.com/phetsims/ratio-and-proportion/issues/9
   * @private
   * @param {WrappedAudioBuffer} sound
   */
  wireUpSoundClips( sound ) {

    // dispose previous ones
    if ( this.tonicSoundClip ) {
      this.tonicSoundClip.dispose();
      this.thirdSoundClip.dispose();
      this.singleSuccessSoundClip.dispose();
      this.singleSuccess7Chord.dispose();
      this.singleSuccessMajorChord.dispose();
      this.singleArpeggiatedChord.dispose();
    }

    this.tonicSoundClip = new SoundClip( sound );
    this.thirdSoundClip = new SoundClip( sound, {
      initialPlaybackRate: majorThirdPlaybackSpeed
    } );
    this.singleSuccessSoundClip = new SoundClip( sound, {
      initialPlaybackRate: 2
    } );
    this.singleSuccess7Chord = new SoundClipChord( sound, {
      chordPlaybackRates: [ 1, Math.pow( 2, 4 / 12 ), Math.pow( 2, 7 / 12 ), Math.pow( 2, 11 / 12 ) ]
    } );
    this.singleSuccessMajorChord = new SoundClipChord( sound, {
      chordPlaybackRates: [ 1, Math.pow( 2, 4 / 12 ), Math.pow( 2, 7 / 12 ), 2 ]
    } );
    this.singleArpeggiatedChord = new SoundClipChord( sound, {
      chordPlaybackRates: [ 1, Math.pow( 2, 4 / 12 ), Math.pow( 2, 7 / 12 ), Math.pow( 2, 11 / 12 ) ],
      arpeggiate: true
    } );

    this.tonicSoundClip.connect( this.masterGainNode );
    this.thirdSoundClip.connect( this.masterGainNode );
    this.singleSuccessSoundClip.connect( this.masterGainNode );
    this.singleSuccess7Chord.connect( this.masterGainNode );
    this.singleSuccessMajorChord.connect( this.masterGainNode );
    this.singleArpeggiatedChord.connect( this.masterGainNode );
  }

  /**
   * Step this sound generator, used for fading out the sound in the absence change.
   * @param {number} dt
   * @public
   */
  step( dt ) {
    this.timeSinceLastPlay += dt * 1000;

    this.remainingFadeTime = Math.max( this.remainingFadeTime - dt, 0 );

    const normalizedFitness = ( this.fitnessProperty.value - this.fitnessRange.min ) / this.fitnessRange.getLength();

    if ( this.timeSinceLastPlay > this.timeLinearFunction( normalizedFitness ) ) {

      // success condition
      if ( 1 - normalizedFitness < .05 ) {
        if ( designingProperties.staccatoSuccessSoundSelectorProperty.value === 0 ) {
          let soundClip = this.tonicSoundClip;
          if ( this.playCount % 2 === 0 ) {
            soundClip = this.thirdSoundClip;
          }
          soundClip.play();
          this.timeSinceLastPlay = 0;
          this.playCount++;
        }
        else if ( !this.ratioSuccess ) {
          this.defaultReverb = soundManager.reverbLevel;
          soundManager.reverbLevel = .8;
          if ( designingProperties.staccatoSuccessSoundSelectorProperty.value === 1 ) {
            this.playAndSetReverbBack( this.singleSuccessSoundClip );
          }
          else if ( designingProperties.staccatoSuccessSoundSelectorProperty.value === 2 ) {
            this.playAndSetReverbBack( this.singleSuccess7Chord );
          }
          else if ( designingProperties.staccatoSuccessSoundSelectorProperty.value === 3 ) {
            this.playAndSetReverbBack( this.singleSuccessMajorChord );
          }
          else if ( designingProperties.staccatoSuccessSoundSelectorProperty.value === 4 ) {
            soundManager.reverbLevel = .5;
            this.playAndSetReverbBack( this.singleArpeggiatedChord );
          }
          this.ratioSuccess = true;
        }
      }
      else {

        // This handles the case when the fitness changes out of success before the sound has completed
        if ( this.ratioSuccess ) {
          soundManager.reverbLevel = this.defaultReverb;
        }
        this.ratioSuccess = false;
        this.tonicSoundClip.play();
        this.timeSinceLastPlay = 0;
      }
    }
  }

  /**
   * @param {Playable} playable - must also have `isPlayingProperty`
   * @private
   */
  playAndSetReverbBack( playable ) {
    playable.play();
    this.setReverbBackWhenDonePlaying( playable.isPlayingProperty );
  }

  /**
   * Set a listener that will restore master reverb when isPlayingProperty is set back to false.
   * @param {Property.<boolean>} isPlayingProperty
   */
  setReverbBackWhenDonePlaying( isPlayingProperty ) {
    assert && assert( isPlayingProperty instanceof Property );
    const isPlayingListener = isPlaying => {
      soundManager.reverbLevel = this.defaultReverb;
      isPlayingProperty.unlink( isPlayingListener );
    };
    isPlayingProperty.lazyLink( isPlayingListener );
  }

  /**
   * stop any in-progress sound generation
   * @public
   */
  reset() {
    this.tonicSoundClip.stop( 0 );
    this.thirdSoundClip.stop( 0 );
    this.timeSinceLastPlay = 0;
    this.playCount = 0;
  }
}

ratioAndProportion.register( 'StaccatoFrequencySoundGenerator', StaccatoFrequencySoundGenerator );

export default StaccatoFrequencySoundGenerator;