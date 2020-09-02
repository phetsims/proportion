// Copyright 2020, University of Colorado Boulder

/**
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import ratioAndProportion from '../../ratioAndProportion.js';
import ratioAndProportionStrings from '../../ratioAndProportionStrings.js';

// constants
const RELATIVE_POSITION_STRINGS = [
  ratioAndProportionStrings.a11y.tickMark.relative.on,
  ratioAndProportionStrings.a11y.tickMark.relative.justAbove,
  ratioAndProportionStrings.a11y.tickMark.relative.above,
  ratioAndProportionStrings.a11y.tickMark.relative.halfwayPast,
  ratioAndProportionStrings.a11y.tickMark.relative.below,
  ratioAndProportionStrings.a11y.tickMark.relative.justBelow
];

const ORDINAL_TICK_MARKS = [
  null,
  ratioAndProportionStrings.a11y.tickMark.ordinal.first,
  ratioAndProportionStrings.a11y.tickMark.ordinal.second,
  ratioAndProportionStrings.a11y.tickMark.ordinal.third,
  ratioAndProportionStrings.a11y.tickMark.ordinal.fourth,
  ratioAndProportionStrings.a11y.tickMark.ordinal.fifth,
  ratioAndProportionStrings.a11y.tickMark.ordinal.sixth,
  ratioAndProportionStrings.a11y.tickMark.ordinal.seventh,
  ratioAndProportionStrings.a11y.tickMark.ordinal.eighth,
  ratioAndProportionStrings.a11y.tickMark.ordinal.ninth
];
const BIGGER_THAN_MIDDLE_THRESHOLD = .6;

class TickMarkDescriber {

  /**
   * @param {Range} valueRange
   * @param {Property.<number>} tickMarkRangeProperty
   */
  constructor( valueRange, tickMarkRangeProperty ) {

    // @private
    this.valueRange = valueRange;
    this.tickMarkRangeProperty = tickMarkRangeProperty;
  }

  /**
   * @public
   * @param {Property.<number>} property
   * @returns {{tickMarkPosition: number, relativePosition: string}}
   */
  getRelativePositionAndTickMarkNumberForProperty( property ) {
    assert && assert( this.valueRange.contains( property.value ) );

    const numberOfTickMarks = this.tickMarkRangeProperty.value;

    // account for javascript rounding error
    const expandedValue = Utils.toFixedNumber( property.value * numberOfTickMarks, 6 );

    // account for javascript rounding error
    const remainder = Utils.toFixedNumber( expandedValue % 1, 6 );
    assert && assert( remainder < 1 && remainder >= 0 );

    const relativePosition = this.getRelativePosition( remainder );

    const tickMarkNumber = remainder >= BIGGER_THAN_MIDDLE_THRESHOLD ? Math.ceil( expandedValue ) : Math.floor( expandedValue );

    assert && assert( relativePosition );
    return {
      tickMarkPosition: tickMarkNumber,
      relativePosition: relativePosition,
      ordinalPosition: ORDINAL_TICK_MARKS[ tickMarkNumber ] || null
    };
  }

  /**
   * @private
   * @param {number} value - must be in range [0,1) (not including 1). Basically this is the "remainder" position in
   * between two tick marks
   * @returns {string} the relative position given the position from a tick mark.
   */
  getRelativePosition( value ) {
    assert && assert( RELATIVE_POSITION_STRINGS.length === 6, '6 regions expected' );
    assert && assert( value < 1 && value >= 0, 'value not in range' );

    let index = null;
    if ( value === this.valueRange.min ) {
      index = 0;
    }
    else if ( value <= .2 ) {
      index = 1;
    }
    else if ( value <= .4 ) {
      index = 2;
    }
    else if ( value < BIGGER_THAN_MIDDLE_THRESHOLD ) {
      index = 3;
    }
    else if ( value < .8 ) {

      // Use the constant "BIGGER_THAN_MIDDLE_THRESHOLD" to make sure that "in the middle of" refers to the tick mark
      // below, and everything higher refers to the next tick mark up.
      assert && assert( RELATIVE_POSITION_STRINGS[ 3 ].toLowerCase().includes( 'halfway' ), 'this middle position should be the previous' );
      index = 4;
    }
    else if ( value < 1 ) {
      index = 5;
    }
    assert && assert( typeof index === 'number' );
    return RELATIVE_POSITION_STRINGS[ index ];
  }
}

ratioAndProportion.register( 'TickMarkDescriber', TickMarkDescriber );
export default TickMarkDescriber;