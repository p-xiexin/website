/**
 * Options for the TagCanvas library
 * @see https://www.goat1000.com/tagcanvas-options.php
 */
export interface IOptions {
    /**
     * Animation timing function for use with the jQuery animate function
     */
    animTiming?: string;
    /**
     * Time to complete animation in milliseconds
     */
    animationTime?: number;
    /**
     * Cursor to use when mouse is over a tag
     */
    activeCursor?: string;
    /**
     * Cursor to use when mouse is not over a tag
     */
    deactivateCursor?: string;
    /**
     * Cursor to use when mouse is over the canvas, but not over a tag
     */
    bgColour?: string;
    /**
     * Background color of the canvas
     */
    bgOutlineThickness?: number;
    /**
     * Thickness of the background outline
     */
    bgRadius?: number;
    /**
     * Radius of the background in pixels
     */
    centreFunc?: any;
    /**
     * Function to calculate the center of the canvas
     */
    centreImage?: any;
    /**
     * Image to display in the center of the cloud
     */
    clickToFront?: boolean | number;
    /**
     * Whether to bring clicked items to the front
     */
    depth?: number;
    /**
     * Depth of the cloud
     */
    dragControl?: boolean;
    /**
     * Whether to allow dragging the cloud
     */
    dragThreshold?: number;
    /**
     * Threshold for dragging in pixels
     */
    fadeIn?: number;
    /**
     * Time to fade in tags in milliseconds
     */
    freezeActive?: boolean;
    /**
     * Whether to freeze the cloud when a tag is active
     */
    freezeDecel?: boolean;
    /**
     * Whether to freeze the deceleration when a tag is active
     */
    frontSelect?: boolean;
    /**
     * Whether to select the front-most tag
     */
    hideTags?: boolean;
    /**
     * Whether to hide tags
     */
    imageAlign?: string;
    /**
     * Alignment of the image
     */
    imageMode?: string;
    /**
     * Mode of the image
     */
    imagePadding?: number;
    /**
     * Padding of the image in pixels
     */
    imagePosition?: string;
    /**
     * Position of the image
     */
    imageRadius?: number;
    /**
     * Radius of the image in pixels
     */
    imageScale?: number;
    /**
     * Scale of the image
     */
    imageVAlign?: string;
    /**
     * Vertical alignment of the image
     */
    initial?: number[];
    /**
     * Initial position of the cloud
     */
    interval?: number;
    /**
     * Interval between animation frames in milliseconds
     */
    lock?: string;
    /**
     * Axis to lock
     */
    maxBrightness?: number;
    /**
     * Maximum brightness of tags
     */
    maxSpeed?: number;
    /**
     * Maximum speed of the cloud
     */
    minBrightness?: number;
    /**
     * Minimum brightness of tags
     */
    minSpeed?: number;
    /**
     * Minimum speed of the cloud
     */
    minTags?: number;
    /**
     * Minimum number of tags to show
     */
    noMouse?: boolean;
    /**
     * Whether to disable mouse interaction
     */
    noSelect?: boolean;
    /**
     * Whether to disable text selection
     */
    noTagsMessage?: string;
    /**
     * Message to display when there are no tags
     */
    offsetX?: number;
    /**
     * X offset of the cloud
     */
    offsetY?: number;
    /**
     * Y offset of the cloud
     */
    outlineColour?: string;
    /**
     * Color of the outline
     */
    outlineDash?: number;
    /**
     * Length of the outline dash in pixels
     */
    outlineDashSpace?: number;
    /**
     * Length of the space between outline dashes in pixels
     */
    outlineDashSpeed?: number;
    /**
     * Speed of the outline dash animation
     */
    outlineIncrease?: number;
    /**
     * Increase in outline thickness on hover
     */
    outlineMethod?: string;
    /**
     * Method to use for the outline
     */
    outlineOffset?: number;
    /**
     * Offset of the outline in pixels
     */
    outlineRadius?: number;
    /**
     * Radius of the outline in pixels
     */
    outlineThickness?: number;
    /**
     * Thickness of the outline in pixels
     */
    padding?: number;
    /**
     * Padding of the cloud in pixels
     */
    pinchZoom?: boolean;
    /**
     * Whether to allow pinch zooming
     */
    pulsateTime?: number;
    /**
     * Time to pulsate in milliseconds
     */
    pulsateTo?: number;
    /**
     * Target opacity for pulsation
     */
    radiusX?: number;
    /**
     * X radius of the cloud
     */
    radiusY?: number;
    /**
     * Y radius of the cloud
     */
    radiusZ?: number;
    /**
     * Z radius of the cloud
     */
    repeatTagsTags?: number;
    /**
     * Number of times to repeat tags
     */
    reverse?: boolean;
    /**
     * Whether to reverse the direction of rotation
     */
    scrollPause?: number;
    /**
     * Time to pause scrolling in milliseconds
     */
    shadow?: string;
    /**
     * Shadow color
     */
    shadowBlur?: number;
    /**
     * Shadow blur in pixels
     */
    shadowOffset?: number[];
    /**
     * Shadow offset in pixels
     */
    shape?: string;
    /**
     * Shape of the cloud
     */
    shuffleTags?: boolean;
    /**
     * Whether to shuffle the tags
     */
    splitWidth?: number;
    /**
     * Width to split the cloud at
     */
    stretchX?: number;
    /**
     * X stretch factor
     */
    stretchY?: number;
    /**
     * Y stretch factor
     */
    textAlign?: string;
    /**
     * Text alignment
     */
    textColour?: string;
    /**
     * Text color
     */
    textFont?: string;
    /**
     * Text font
     */
    textHeight?: number;
    /**
     * Text height in pixels
     */
    textVAlign?: string;
    /**
     * Text vertical alignment
     */
    tooltip?: string | null;
    /**
     * Tooltip type
     */
    tooltipClass?: string;
    /**
     * Tooltip class
     */
    tooltipDelay?: number;
    /**
     * Tooltip delay in milliseconds
     */
    txtOpt?: boolean;
    /**
     * Whether to optimize text
     */
    txtScale?: number;
    /**
     * Text scale
     */
    weight?: boolean;
    /**
     * Whether to use weighted distribution
     */
    weightFrom?: string;
    /**
     * Attribute to use for weight
     */
    weightGradient?: any;
    /**
     * Weight gradient
     */
    weightMode?: string;
    /**
     * Weight mode
     */
    weightSize?: number;
    /**
     * Weight size
     */
    weightSizeMax?: number;
    /**
     * Maximum weight size
     */
    weightSizeMin?: number;
    /**
     * Minimum weight size
     */
    wheelZoom?: boolean;
    /**
     * Whether to allow wheel zooming
     */
    zoom?: number;
    /**
     * Zoom factor
     */
    zoomMax?: number;
    /**
     * Maximum zoom
     */
    zoomMin?: number;
    /**
     * Minimum zoom
     */
    zoomStep?: number;
}
