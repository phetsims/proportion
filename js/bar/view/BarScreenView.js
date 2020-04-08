// Copyright 2020, University of Colorado Boulder

/**
 * @author Michael Kauzmann
 */

import Range from '../../../../dot/js/Range.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import ProportionConstants from '../../common/ProportionConstants.js';
import ProportionMarkerInput from '../../common/view/ProportionMarkerInput.js';
import proportion from '../../proportion.js';
import DraggableBar from './DraggableBar.js';

class BarScreenView extends ScreenView {

  /**
   * @param {BarModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {

    super( {
      tandem: tandem
    } );

    ProportionMarkerInput.init( model );

    const leftBar = new DraggableBar( model.leftValueProperty, model.colorProperty, model.firstInteractionProperty );
    const rightBar = new DraggableBar( model.rightValueProperty, model.colorProperty, model.firstInteractionProperty );

    const toleranceNumberControl = new NumberControl( 'Tolerance', model.toleranceProperty, new Range( 0.01, .3 ), {
      delta: .01,
      numberDisplayOptions: {
        decimalPlaces: 2
      },
      sliderOptions: {
        keyboardStep: .05
      }
    } );

    const ratioAquaRadioButtonGroup = new VerticalAquaRadioButtonGroup( model.ratioProperty, [ {
      node: new RichText( 'Mystery 1' ),
      value: 1 / 2
    }, {
      node: new RichText( 'Mystery 2' ),
      value: 1 / 3
    }, {
      node: new RichText( 'Mystery 3' ),
      value: 1 / 8
    }, {
      node: new RichText( 'Mystery 4' ),
      value: 5 / 6
    } ] );


    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
      },
      tandem: tandem.createTandem( 'resetAllButton' )
    } );


    // layout
    leftBar.right = this.layoutBounds.centerX + -20;
    leftBar.y = this.layoutBounds.bottom - 20;
    rightBar.left = this.layoutBounds.centerX + 20;
    rightBar.y = this.layoutBounds.bottom - 20;
    resetAllButton.right = this.layoutBounds.maxX - ProportionConstants.SCREEN_VIEW_X_MARGIN;
    resetAllButton.bottom = this.layoutBounds.maxY - ProportionConstants.SCREEN_VIEW_Y_MARGIN;
    ratioAquaRadioButtonGroup.bottom = resetAllButton.top - 50;
    ratioAquaRadioButtonGroup.left = rightBar.right + 30;
    toleranceNumberControl.bottom = ratioAquaRadioButtonGroup.top - 20;
    toleranceNumberControl.left = ratioAquaRadioButtonGroup.left;

    // children
    this.children = [ leftBar, rightBar, toleranceNumberControl, ratioAquaRadioButtonGroup, resetAllButton ];
  }
}


proportion.register( 'BarScreenView', BarScreenView );
export default BarScreenView;