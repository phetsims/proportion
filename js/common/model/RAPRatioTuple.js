// Copyright 2020, University of Colorado Boulder

/**
 * Data type that holds both terms of the ratio, with convenience functions
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import ratioAndProportion from '../../ratioAndProportion.js';

class RAPRatioTuple {

  /**
   * @param {number} antecedent
   * @param {number} consequent
   */
  constructor( antecedent, consequent ) {
    assert && assert( typeof antecedent === 'number' && !isNaN( antecedent ) );
    assert && assert( typeof consequent === 'number' && !isNaN( consequent ) );

    // @public {number}
    this.antecedent = antecedent;
    this.consequent = consequent;
  }

  /**
   * @param {number} antecedent
   * @returns {RAPRatioTuple}
   * @public
   */
  withAntecedent( antecedent ) {
    return new RAPRatioTuple( antecedent, this.consequent );
  }

  /**
   * @param {number} consequent
   * @returns {RAPRatioTuple}
   * @public
   */
  withConsequent( consequent ) {
    return new RAPRatioTuple( this.antecedent, consequent );
  }

  /**
   * @param {number} antecedentDelta
   * @returns {RAPRatioTuple}
   * @public
   */
  plusAntecedent( antecedentDelta ) {
    return new RAPRatioTuple( this.antecedent + antecedentDelta, this.consequent );
  }

  /**
   * @param {number} consequentDelta
   * @returns {RAPRatioTuple}
   * @public
   */
  plusConsequent( consequentDelta ) {
    return new RAPRatioTuple( this.antecedent, this.consequent + consequentDelta );
  }

  /**
   * Constrain both data fields to a provided range
   * @public
   * @param {Range} range
   */
  constrainFields( range ) {
    this.antecedent = range.constrainValue( this.antecedent );
    this.consequent = range.constrainValue( this.consequent );

    return this; // for chaining
  }

  /**
   * @public
   * @returns {number}
   */
  getRatio() {
    return this.consequent === 0 ? Number.POSITIVE_INFINITY : this.antecedent / this.consequent;
  }

  /**
   * Get the distance between the two numbers
   * @public
   * @returns {number} - greater than 0
   */
  getDistance() {
    return Math.abs( this.antecedent - this.consequent );
  }
}

ratioAndProportion.register( 'RAPRatioTuple', RAPRatioTuple );
export default RAPRatioTuple;
