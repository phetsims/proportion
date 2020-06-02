// Copyright 2020, University of Colorado Boulder

/**
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RadioButtonGroup from '../../../../sun/js/buttons/RadioButtonGroup.js';
import FontAwesomeNode from '../../../../sun/js/FontAwesomeNode.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import gridIconImage from '../../../images/grid-icon_png.js';
import numberedGridIconImage from '../../../images/numbered-grid-icon_png.js';
import ratioAndProportion from '../../ratioAndProportion.js';
import ratioAndProportionStrings from '../../ratioAndProportionStrings.js';
import ProportionConstants from '../ProportionConstants.js';
import GridDescriber from './GridDescriber.js';
import GridView from './GridView.js';
import ProportionMarkerInput from './ProportionMarkerInput.js';
import RAPGridLabelsNode from './RAPGridLabelsNode.js';
import RatioAndProportionScreenSummaryNode from './RatioAndProportionScreenSummaryNode.js';
import RatioDescriber from './RatioDescriber.js';
import RatioHalf from './RatioHalf.js';
import RatioInteractionListener from './RatioInteractionListener.js';
import ProportionFitnessSoundGenerator from './sound/ProportionFitnessSoundGenerator.js';

// constants
const LAYOUT_BOUNDS = ScreenView.DEFAULT_LAYOUT_BOUNDS;
const MAX_RATIO_HEIGHT = LAYOUT_BOUNDS.width * 2; // relatively arbitrary, but good to set a max so it can't get too skinny
const ONE_QUARTER_LAYOUT_WIDTH = LAYOUT_BOUNDS.width * .25;
const RATIO_HALF_WIDTH = ONE_QUARTER_LAYOUT_WIDTH;
const RATIO_HALF_SPACING = 10;
const CONTROL_PANEL_WIDTH = 200;


class RatioRatioAndProportionScreenView extends ScreenView {

  /**
   * @param {RatioAndProportionModel} model
   * @param {Tandem} tandem
   * @param options
   */
  constructor( model, tandem, options ) {

    options = merge( {

      // What is the unit value of the grid. Value reads as "1/x of the view height." This type is responsible for
      // resetting this on reset all.
      gridBaseUnitProperty: new NumberProperty( 10 )
    }, options );

    const gridDescriber = new GridDescriber( model.valueRange, options.gridBaseUnitProperty );
    const ratioDescriber = new RatioDescriber( model, gridDescriber );

    const gridViewProperty = new EnumerationProperty( GridView, GridView.NONE, {
      tandem: tandem.createTandem( 'gridViewProperty' )
    } );

    super( {
      tandem: tandem,
      layoutBounds: LAYOUT_BOUNDS,
      screenSummaryContent: new RatioAndProportionScreenSummaryNode(
        model.proportionFitnessProperty,
        model.leftValueProperty,
        model.rightValueProperty,
        gridViewProperty,
        ratioDescriber
      )
    } );

    // @private
    this.gridViewProperty = gridViewProperty;

    const defaultRatioHalfBounds = Bounds2.rect( 0, 0, RATIO_HALF_WIDTH, LAYOUT_BOUNDS.height );

    // @private {RatioHalf}
    this.leftRatioHalf = new RatioHalf(
      model.leftPositionProperty,
      model.leftValueProperty,
      model.valueRange,
      model.firstInteractionProperty,
      defaultRatioHalfBounds,
      gridViewProperty,
      options.gridBaseUnitProperty,
      ratioDescriber,
      gridDescriber, {
        labelContent: ratioAndProportionStrings.a11y.leftHand,
        isRight: false // this way we get a left hand
      }
    );

    // @private {RatioHalf}
    this.rightRatioHalf = new RatioHalf(
      model.rightPositionProperty,
      model.rightValueProperty,
      model.valueRange,
      model.firstInteractionProperty,
      defaultRatioHalfBounds,
      gridViewProperty,
      options.gridBaseUnitProperty,
      ratioDescriber,
      gridDescriber, {
        labelContent: ratioAndProportionStrings.a11y.rightHand
      } );

    const a11yRatioContainer = new Node( {
      tagName: 'div',
      role: 'application',
      focusable: true,
      labelContent: 'Ratio:',
      children: [
        this.leftRatioHalf,
        this.rightRatioHalf
      ]
    } );
    const ratioInteractionListener = new RatioInteractionListener( a11yRatioContainer, model.leftValueProperty,
      model.rightValueProperty, model.valueRange, model.firstInteractionProperty );
    a11yRatioContainer.addInputListener( ratioInteractionListener );

    // @private
    this.markerInput = new ProportionMarkerInput( model );

    // @private
    this.proportionFitnessSoundGenerator = new ProportionFitnessSoundGenerator(
      model.proportionFitnessProperty,
      model.fitnessRange,
      DerivedProperty.or( [
        this.leftRatioHalf.isBeingInteractedWithProperty,
        this.rightRatioHalf.isBeingInteractedWithProperty,
        this.markerInput.isBeingInteractedWithProperty,
        ratioInteractionListener.isBeingInteractedWithProperty
      ] ),
      model.leftVelocityProperty,
      model.rightVelocityProperty );
    soundManager.addSoundGenerator( this.proportionFitnessSoundGenerator );

    // these dimensions are just temporary, and will be recomputed below in the layout function
    const labelsNode = new RAPGridLabelsNode( gridViewProperty, options.gridBaseUnitProperty, 1000 );

    const backgroundNode = Rectangle.bounds( this.layoutBounds, {
      fill: 'black'
    } );
    model.colorProperty.link( color => {
      backgroundNode.setFill( color );
    } );


    // @protected
    this.resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        options.gridBaseUnitProperty.reset();
        this.reset();
      },
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    // @protected - subtype is responsible for layout
    this.gridViewRadioButtonGroup = new RadioButtonGroup( gridViewProperty, [ {
      node: new FontAwesomeNode( 'eye_close', { scale: 0.8 } ),
      value: GridView.NONE,
      labelContent: ratioAndProportionStrings.a11y.grid.showNo
    }, {
      node: new Image( gridIconImage, { scale: .2 } ),
      value: GridView.HORIZONTAL,
      labelContent: ratioAndProportionStrings.a11y.grid.show
    }, {
      node: new Image( numberedGridIconImage, { scale: .2 } ),
      value: GridView.HORIZONTAL_UNITS,
      labelContent: ratioAndProportionStrings.a11y.grid.showNumbered
    } ], {
      orientation: 'horizontal',
      baseColor: 'white',
      labelContent: ratioAndProportionStrings.a11y.grid.heading
    } );

    // children
    this.children = [
      backgroundNode,
      labelsNode,

      // UI
      this.gridViewRadioButtonGroup,
      this.resetAllButton,

      // Main ratio on top
      a11yRatioContainer
    ];

    // accessible order (markers first in nav order)
    this.pdomPlayAreaNode.accessibleOrder = [
      this.leftRatioHalf,
      this.rightRatioHalf,
      a11yRatioContainer,
      null ];

    this.resetAllButton.right = this.layoutBounds.maxX - ProportionConstants.SCREEN_VIEW_X_MARGIN;
    this.resetAllButton.bottom = this.layoutBounds.maxY - ProportionConstants.SCREEN_VIEW_Y_MARGIN;

    // @private - dynamic layout based on the current ScreenView coordinates
    this.layoutFreeObjectsScreenView = newRatioHalfBounds => {

      this.leftRatioHalf.layout( newRatioHalfBounds );
      this.rightRatioHalf.layout( newRatioHalfBounds );
      backgroundNode.rectBounds = this.visibleBoundsProperty.value;
      backgroundNode.bottom = this.layoutBounds.bottom;

      // subtract the top and bottom rectangles from the grid height
      labelsNode.layout( newRatioHalfBounds.height - ( 2 * RatioHalf.FRAMING_RECTANGLE_HEIGHT ) );

      const ratioWidth = this.leftRatioHalf.width + this.rightRatioHalf.width + ( 2 * RATIO_HALF_SPACING ) + labelsNode.width;

      // combo box is a proxy for the width of the controls
      this.leftRatioHalf.left = ( this.layoutBounds.width - CONTROL_PANEL_WIDTH - ratioWidth ) / 2;
      labelsNode.left = this.leftRatioHalf.right + RATIO_HALF_SPACING;
      this.rightRatioHalf.left = labelsNode.right + RATIO_HALF_SPACING;
      this.leftRatioHalf.bottom = this.rightRatioHalf.bottom = this.layoutBounds.bottom;

      labelsNode.bottom = this.layoutBounds.bottom - RatioHalf.FRAMING_RECTANGLE_HEIGHT + labelsNode.labelHeight / 2;
    };
    this.layoutFreeObjectsScreenView( defaultRatioHalfBounds );
  }

  /**
   * Layout Nodes part of ethe screen viw. To accomplish, much of this was copied from ScreenView.layout, with
   * minor tweaks for this specific case. Also note Projectile Motion uses almost the exact same algorithm.
   *
   * @param {number} width
   * @param {number} height
   * @override
   * @public
   */
  layout( width, height ) {
    this.resetTransform();

    const scale = this.getLayoutScale( width, height );
    this.setScaleMagnitude( scale );

    let dx = 0;
    let dy = 0;

    // Move to bottom vertically
    if ( scale === width / this.layoutBounds.width ) {
      dy = ( height / scale - this.layoutBounds.height );
    }

    // Center horizontally
    else if ( scale === height / this.layoutBounds.height ) {
      dx = ( width / scale - this.layoutBounds.width ) / 2;
    }
    this.translate( dx, dy );

    // set visible bounds, which are different from layout bounds
    this.visibleBoundsProperty.set( new Bounds2( -dx, -dy, width / scale - dx, height / scale - dy ) );

    // new bounds for each ratio half
    this.layoutFreeObjectsScreenView( new Bounds2( 0, 0, ONE_QUARTER_LAYOUT_WIDTH, Math.min( height / scale, MAX_RATIO_HEIGHT ) ) );
  }

  /**
   * @public
   * @override
   */
  reset() {
    this.gridViewProperty.reset();

    this.leftRatioHalf.reset();
    this.rightRatioHalf.reset();
  }

  /**
   * @override
   * @public
   * @param {number} dt
   */
  step( dt ) {
    this.markerInput.step( dt );
    this.proportionFitnessSoundGenerator.step( dt );
  }
}

ratioAndProportion.register( 'RatioRatioAndProportionScreenView', RatioRatioAndProportionScreenView );
export default RatioRatioAndProportionScreenView;