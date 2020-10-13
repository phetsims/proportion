// Copyright 2020, University of Colorado Boulder

/**
 * Content for the keyboard help dialog in the discover screen
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import ComboBoxKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/ComboBoxKeyboardHelpSection.js';
import RAPKeyboardHelpContent from '../../common/view/RAPKeyboardHelpContent.js';
import ratioAndProportion from '../../ratioAndProportion.js';

class DiscoverScreenKeyboardHelpContent extends RAPKeyboardHelpContent {
  constructor() {
    super( new ComboBoxKeyboardHelpSection( 'Challenge', 'option', 'options' ) );
  }
}

ratioAndProportion.register( 'DiscoverScreenKeyboardHelpContent', DiscoverScreenKeyboardHelpContent );
export default DiscoverScreenKeyboardHelpContent;