// Copyright 2020, University of Colorado Boulder

/**
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import NumberPicker from '../../../../scenery-phet/js/NumberPicker.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import ProportionConstants from '../../common/ProportionConstants.js';
import GridView from '../../common/view/GridView.js';
import RatioAndProportionScreenView from '../../common/view/RatioAndProportionScreenView.js';
import RatioHandNode from '../../common/view/RatioHandNode.js';
import ratioAndProportion from '../../ratioAndProportion.js';
import ratioAndProportionStrings from '../../ratioAndProportionStrings.js';

const FONT = ProportionConstants.FONT;


class ChallengeMakerScreenView extends RatioAndProportionScreenView {

  /**
   * @param {RatioAndProportionModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {

    const gridBaseUnitProperty = new NumberProperty( 10 );

    super( model, tandem, {
      gridBaseUnitProperty: gridBaseUnitProperty
    } );

    // Allow us to get the reduced fraction as the initial value of the custom "My Challenge"
    const initialRatioFration = new Fraction( model.leftValueProperty.value * 100, model.rightValueProperty.value * 100 );
    initialRatioFration.reduce();

    const numberatorProperty = new NumberProperty( initialRatioFration.numerator );
    const leftRatioSelector = new VBox( {
      align: 'center',
      spacing: 10,
      children: [
        RatioHandNode.createIcon( false, this.gridViewProperty, { scale: .8 } ),
        new NumberPicker( numberatorProperty, new Property( new Range( 1, 10 ) ), { scale: 1.2 } ) ]
    } );

    const denominatorProperty = new NumberProperty( initialRatioFration.denominator );
    const rightRatioSelector = new VBox( {
      align: 'center',
      spacing: 10,
      children: [
        RatioHandNode.createIcon( true, this.gridViewProperty, { scale: .8 } ),
        new NumberPicker( denominatorProperty, new Property( new Range( 1, 10 ) ), { scale: 1.2 } ) ]
    } );

    Property.multilink( [ numberatorProperty, denominatorProperty ], ( leftValue, rightValue ) => {
      model.ratioProperty.value = leftValue / rightValue;
    } );

    const myChallengeContent = new HBox( {
      spacing: 80,
      children: [ leftRatioSelector, rightRatioSelector ]
    } );
    const myChallengeAccordionBox = new AccordionBox( myChallengeContent, {
      titleNode: new RichText( ratioAndProportionStrings.myChallenge, { font: FONT } ),
      titleAlignX: 'left',
      contentXMargin: 60,
      contentYMargin: 15,
      contentYSpacing: 15,

      // Copied from NLCConstants.js, see https://github.com/phetsims/ratio-and-proportion/issues/58#issuecomment-646377333
      cornerRadius: 5,
      buttonXMargin: 8,
      buttonYMargin: 6,
      expandCollapseButtonOptions: {
        touchAreaXDilation: 15,
        touchAreaYDilation: 15,
        mouseAreaXDilation: 5,
        mouseAreaYDilation: 5
      }
    } );
    this.addChild( myChallengeAccordionBox );
    myChallengeAccordionBox.expandedProperty.value = false;

    const gridBaseUnitComboBoxParent = new Node();

    const gridBaseUnitComboBox = new ComboBox( [
      new ComboBoxItem( new RichText( ratioAndProportionStrings.zeroToTen, { font: FONT } ), 10, {
        a11yLabel: ratioAndProportionStrings.zeroToTen
      } ),
      new ComboBoxItem( new RichText( ratioAndProportionStrings.zeroToTwenty, { font: FONT } ), 20, {
        a11yLabel: ratioAndProportionStrings.zeroToTwenty
      } ),
      new ComboBoxItem( new RichText( ratioAndProportionStrings.zeroToThirty, { font: FONT } ), 30, {
        a11yLabel: ratioAndProportionStrings.zeroToThirty
      } )
    ], gridBaseUnitProperty, gridBaseUnitComboBoxParent, {
      labelNode: new RichText( ratioAndProportionStrings.range, { font: FONT } ),
      accessibleName: ratioAndProportionStrings.range
    } );

    // Hide the base unit selection unless you can see units in the grid.
    this.gridViewProperty.link( gridView => {
      gridBaseUnitComboBox.enabledProperty.value = gridView !== GridView.NONE;
    } );

    // children
    this.addChild( gridBaseUnitComboBox );
    this.addChild( gridBaseUnitComboBoxParent );

    // @private
    this.layoutChallengeMakerScreenView = () => {
      gridBaseUnitComboBox.left = myChallengeAccordionBox.left = this.gridViewRadioButtonGroup.left;
      this.resetAllButton.right = myChallengeAccordionBox.right;
      gridBaseUnitComboBox.top = this.gridViewRadioButtonGroup.bottom + 20;
      myChallengeAccordionBox.top = gridBaseUnitComboBox.bottom + 20;
      this.resetAllButton.top = myChallengeAccordionBox.bottom + 20;
    };

    // @private
    this.resetChallengeMakerScreenView = () => {
      numberatorProperty.reset();
      denominatorProperty.reset();
    };
  }

  /**
   * @param {number} width
   * @param {number} height
   * @override
   * @public
   */
  layout( width, height ) {
    super.layout( width, height );
    this.layoutChallengeMakerScreenView();
  }

  /**
   * @public
   * @override
   */
  reset() {
    this.resetChallengeMakerScreenView();
    super.reset();
  }
}

ratioAndProportion.register( 'ChallengeMakerScreenView', ChallengeMakerScreenView );
export default ChallengeMakerScreenView;