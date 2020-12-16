// Copyright 2020, University of Colorado Boulder

/**
 * This file adds mechamarkers as an input controller to Ratio and Proportion
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import MarkerInput from '../../../../tangible/js/MarkerInput.js';
import ratioAndProportion from '../../ratioAndProportion.js';
import RAPQueryParameters from '../RAPQueryParameters.js';

// constants
const BASE_MARKER = 1;
const RATIO_MARKER_LEFT = 2;
const RATIO_MARKER_RIGHT = 3;

// "one" here refers to the max value of each ratio half. Their range is from 0 to 1
const HEIGHT_OF_ONE = RAPQueryParameters.heightInPixels;

class ProportionMarkerInput extends MarkerInput {

  /**
   * @param {NumberProperty} antecedentProperty
   * @param {NumberProperty} consequentProperty
   * @param {BooleanProperty} firstInteractionProperty - TODO: support this for cue arrows, https://github.com/phetsims/ratio-and-proportion/issues/89
   */
  constructor( antecedentProperty, consequentProperty, firstInteractionProperty ) {
    super();

    // @public (read-only)
    this.isBeingInteractedWithProperty = new BooleanProperty( false );


    // TODO: support this for cue arrows, https://github.com/phetsims/ratio-and-proportion/issues/89
    // this.isBeingInteractedWithProperty.lazyLink( interactedWith => {
    //   interactedWith && firstInteractionProperty.set( false );
    // } );

    // @private
    this.antecedentProperty = antecedentProperty;
    this.consequentProperty = consequentProperty;
  }

  /**
   * @public
   */
  step() {

    // This controller needs all three markers
    this.isBeingInteractedWithProperty.value = this.Mechamarkers.getMarker( RATIO_MARKER_LEFT ).present &&
                                               this.Mechamarkers.getMarker( BASE_MARKER ).present &&
                                               this.Mechamarkers.getMarker( RATIO_MARKER_RIGHT ).present;

    if ( this.isBeingInteractedWithProperty.value ) {

      const baseMarker = this.Mechamarkers.getMarker( BASE_MARKER );
      const leftMarker = this.Mechamarkers.getMarker( RATIO_MARKER_LEFT );
      const rightMarker = this.Mechamarkers.getMarker( RATIO_MARKER_RIGHT );

      assert && assert( leftMarker.present && baseMarker.present && rightMarker.present, 'all markers must be present' );

      this.antecedentProperty.value = Utils.clamp( Math.abs( baseMarker.center.y - leftMarker.center.y ) / HEIGHT_OF_ONE, 0, 1 );
      this.consequentProperty.value = Utils.clamp( Math.abs( baseMarker.center.y - rightMarker.center.y ) / HEIGHT_OF_ONE, 0, 1 );
    }
  }
}

ratioAndProportion.register( 'ProportionMarkerInput', ProportionMarkerInput );
export default ProportionMarkerInput;