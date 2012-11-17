![Wordcloudify Logo](https://raw.github.com/robinmalburn/wordcloudify-chrome/master/cloud_off_48.png)

Wordcloudify 
============

Wordcloudify is a Google Chrome / Chromium extension that can create a word cloud from any element on a page.

Installation
============

Chrome Webstore
---------------
Coming soon! Probably...

Development / From Source
-------------------------
1. Download / clone source
2. Go to the Extensions page, e.g. go to Settings, then click the Extensions option in the side menu
3. Click "Load unpacked extension"
4. Navigate to and select the directory where you cloned / extracted the extension source code to.

Usage
=====
- Click the Wordcloudify icon in the toolbar (![Wordcloudify Icon](https://raw.github.com/robinmalburn/wordcloudify-chrome/master/cloud_off_19.png)) - you're now in selection mode.
- Hover over elements in the page - a green border will wrap around the highlighted element to help illustrate exactly what text is going to be captured.  
- Click within the bordered element to activate generate a word cloud, or click the Wordcloudify icon (![Wordcloudify Icon](https://raw.github.com/robinmalburn/wordcloudify-chrome/master/cloud_on_19.png)) again to exit selection mode and return to normal browsing.
- Once Wordlcoudify has generated a word cloud, it will be displayed in a lightbox; Click in the darkened area of the screen, or on the Wordcloudify icon (![Wordcloudify Icon](https://raw.github.com/robinmalburn/wordcloudify-chrome/master/cloud_on_19.png)) again, to dismiss the lightbox and return to normal browsing.

Roadmap
=======
### Options Page
Allow users to edit / expand the default stop word list, set min / max font sizes, set minimum word length and set the maximum number of words to return.
### Popup Selector
Allow the user to choose between "selection mode" or entering their own CSS / jQuery style selector to allow selections, allowing for word clouds that couldn't be generated via the simple click method
### Improved Selection Mode
The selection mode is very basic at this point, and some pages do fool it, making areas unclickable.  This definitely needs improving and making a bit more robust.


Thanks
======
Special thanks to Jennifer Lazo for creating the various icons.