// Copyright 2020, University of Colorado Boulder

//REVIEW: This is a pretty central class in the sim and should probably have a description.
/**
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import ratioAndProportion from '../../ratioAndProportion.js';
import RAPConstants from '../RAPConstants.js';
import RAPRatio from './RAPRatio.js';
import RatioTerm from './RatioTerm.js';

// constant to help achieve feedback in 40% of the visual screen height (2 default tick marks).
const FITNESS_TOLERANCE_FACTOR = 0.5;

const TOTAL_RANGE = RAPConstants.TOTAL_RATIO_TERM_VALUE_RANGE;

class RAPModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    // @public - The desired ratio of the antecedent as compared to the consequent. As in 1:2 (initial value).
    this.targetRatioProperty = new NumberProperty( .5 );

    // @public - the current state of the ratio (value of terms, if its locked, etc)
    this.ratio = new RAPRatio();

    // @public (read-only) - the Range that the ratioFitnessProperty can be.
    this.fitnessRange = new Range( 0, 1 );

    // @public {DerivedProperty.<number>}
    // How "correct" the proportion currently is. Max is this.fitnessRange.max, but the min can be arbitrarily negative,
    // depending how far away the current ratio is from the targetRatio
    this.unclampedFitnessProperty = new DerivedProperty( [
      this.ratio.tupleProperty,
      this.targetRatioProperty
    ], ( ratioTuple, ratio ) => {

      const antecedent = ratioTuple.antecedent;
      const consequent = ratioTuple.consequent;

      let unclampedFitness = this.calculateFitness( antecedent, consequent, ratio );

      // If either value is small enough, then we don't allow an "in proportion" fitness level, so make it just below that threshold.
      if ( this.inProportion( unclampedFitness ) && this.valuesTooSmallForInProportion() ) {
        unclampedFitness = this.fitnessRange.max - this.getInProportionThreshold() - .01;
      }

      phet.log && phet.log( `
left: ${antecedent}, 
right: ${consequent}, 
distance: ${Math.abs( consequent - antecedent )}, 
current ratio: ${this.ratio.currentRatio}, 
target ratio: ${this.targetRatioProperty.value},
unclampedFitness: ${unclampedFitness}\n` );

      return unclampedFitness;
    }, {
      isValidValue: value => value <= this.fitnessRange.max
    } );

    // @public {DerivedProperty.<number>}
    // How "correct" the proportion currently is. clamped within this.fitnessRange. If at max (1), the proportion of
    // the two values is exactly the value of the targetRatioProperty. If min (0), it is outside the tolerance
    // allowed for the proportion to give many feedbacks.
    this.ratioFitnessProperty = new DerivedProperty( [ this.unclampedFitnessProperty ],
      unclampedFitness => Utils.clamp( unclampedFitness, this.fitnessRange.min, this.fitnessRange.max ), {
        isValidValue: value => this.fitnessRange.contains( value )
      } );

    // This must be done here, because of the reentrant nature of how fitness changes when the ratio is locked
    this.targetRatioProperty.link( () => {
      this.ratio.lockedProperty.value = false;
    } );

    // snap to target ratio when the ratio is locked.
    this.ratio.lockedProperty.link( locked => locked && this.ratio.setRatioToTarget( this.targetRatioProperty.value ) );
  }

  /**
   * fitness according to treating the consequent as "correct" in relation to the target ratio
   * @param {number} antecedent
   * @param {number} consequentOptimal
   * @param {number} targetRatio
   * @returns {number}
   * @private
   */
  fitnessBasedOnAntecedent( antecedent, consequentOptimal, targetRatio ) {
    return this.fitnessRange.max - FITNESS_TOLERANCE_FACTOR * Math.abs( antecedent - targetRatio * consequentOptimal );
  }

  /**
   * fitness according to treating the antecedent as "correct" in relation to the target ratio
   * @param {number} antecedentOptimal
   * @param {number} consequent
   * @param {number} targetRatio
   * @returns {number}
   * @private
   */
  fitnessBasedOnConsequent( antecedentOptimal, consequent, targetRatio ) {
    return this.fitnessRange.max - FITNESS_TOLERANCE_FACTOR * Math.abs( consequent - antecedentOptimal / targetRatio );
  }

  /**
   * @param {number} antecedent
   * @param {number} consequent
   * @param {number} targetRatio
   * @returns {number}
   * @private
   */
  calculateFitness( antecedent, consequent, targetRatio ) {

    // multiply because the model values only span from 0-1
    const a = antecedent * 10;
    const b = consequent * 10;

    // By taking the min of either value, we "smooth" out the fitness algorithm in cases where you change both ratio
    // terms at the same time (or alternating).
    return Math.min( this.fitnessBasedOnAntecedent( a, b, targetRatio ), this.fitnessBasedOnConsequent( a, b, targetRatio ) );
  }

  /**
   * Get the minimum fitness value (unclamped) for the provided target ratio, based on the range of the ratio terms.
   * @public
   * @param {number} ratio
   * @returns {number}
   */
  getMinFitness( ratio = this.targetRatioProperty.value ) {
    const minRatioFitness = this.calculateFitness( TOTAL_RANGE.min, TOTAL_RANGE.max, ratio );
    const maxRatioFitness = this.calculateFitness( TOTAL_RANGE.max, TOTAL_RANGE.min, ratio );
    return Math.min( minRatioFitness, maxRatioFitness );
  }

  /**
   * If either value is smaller than a threshold, then the fitness cannot be at its max, "in-proportion" state. This function
   * will return true when the model is in that state. When true, one or both value is too small to allow for a success state.
   * @public
   * @returns {boolean}
   */
  valuesTooSmallForInProportion() {
    return this.ratio.antecedentProperty.value <= RAPConstants.NO_SUCCUSS_VALUE_THRESHOLD ||
           this.ratio.consequentProperty.value <= RAPConstants.NO_SUCCUSS_VALUE_THRESHOLD;
  }

  /**
   * @public
   * @returns {number}
   */
  getInProportionThreshold() {
    let threshold = RAPConstants.IN_PROPORTION_FITNESS_THRESHOLD;
    if ( this.ratio.movingInDirection() ) {
      threshold = RAPConstants.MOVING_IN_PROPORTION_FITNESS_THRESHOLD;
    }
    return threshold;
  }

  /**
   * This is the sim's definition of if the ratio is in the "success" metric, what we call "in proportion." This changes
   * based on if moving in proportion (bimodal interaction), or not.
   * @public
   * @param {number} [fitness] - if provided, calculate if this fitness is in proportion
   * @returns {boolean}
   */
  inProportion( fitness = this.ratioFitnessProperty.value ) {
    return fitness > this.fitnessRange.max - this.getInProportionThreshold();
  }

  /**
   * @public
   * @override
   */
  step() {
    this.ratio.step();
  }

  /**
   * Given a ratio component (antecedent or consequent), determine what it should be to make the current ratio equal to
   * the target ratio.
   * @param {RatioTerm} ratioTerm
   * @returns {number}
   * @public
   */
  getIdealValueForTerm( ratioTerm ) {
    if ( ratioTerm === RatioTerm.ANTECEDENT ) {
      return this.targetRatioProperty.value * this.ratio.tupleProperty.value.consequent;
    }
    if ( ratioTerm === RatioTerm.CONSEQUENT ) {
      return this.ratio.tupleProperty.value.antecedent / this.targetRatioProperty.value;
    }
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.ratio.reset(); // do this first

    this.targetRatioProperty.reset();
  }
}

ratioAndProportion.register( 'RAPModel', RAPModel );
export default RAPModel;