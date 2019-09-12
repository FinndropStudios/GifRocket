![GifRocket Logo][gifrocketlogo]
<br />
# GifRocket
<p>
<b><a href="#overview">Overview</a></b>
|
<b><a href="#usage">How to use</a></b>
|
<b><a href="#installation">Installation</a></b>
|
<b><a href="#team">Team</a></b>
|
<b><a href="#contributors">Contributors</a></b>
|
<b><a href="#license">Copyright & License</a></b>
</p>

## Overview <a name="overview"></a>
GifRocket is a slash-command which sends your given phrases to Giphy and returns any according gif or sticker.

## How to use <a name="usage"></a>

### Gifs
GifRocket reacts on a slash-command. For example entering `!gif test` shows a gif relating to the word `test`.<br />
Try to use `!gif random` as phrase and receive a random gif.

### Sticker
GifRocket reacts on a slash-command. For example entering `!sticker test` shows a sticker relating to the word `test`.<br />
Try to use `!sticker random` as phrase and receive a random sticker.

## Installation <a name="installation"></a>

### Download code
Download source using the button link at the top of this page.<br />
Unzip Sources.  
Alternatively, clone this repo using your favorite git client.

### Configure Rocket.Chat

#### Add user (optional)
This step is optional if you've already got a user which you want to use as post author you can skip this step.<br />
Otherwise add a new user who is posting the updates to your channel or who ist texting the user which is supposed to be informed.

#### Configure outgoing Webhook in Rocket.Chat
In your Rocket.Chat instance go to administration panel an click on "Integrations". To add an integration with BitRocket click on "NEW INTEGRATION".<br />
Next, choose "Outgoing WebHook".  
Now, on the webhook config screen, set the following values:

##### Event Trigger
Set this value to "Message Sent".

##### Enabled
Set this value to true/yes

##### Name (optional)
Enter the desired name for the integration (e.g. "GifRocket").

##### Channel
Self-explaining option. Insert the desired channel which should be listened.

##### Trigger Words
Set the trigger words on which the command should be fired. You have to set `!gif,!sticker` in here. Every time you write `!gif` or `!sticker`, everything after that string will be pushed zu Giphy.

##### URLs
In this field you *must* enter `https://api.giphy.com/v1/`

##### Impersonate User (optional)

If you want to use the above added user: set this value to true.

##### Post as
In this field you should define the user who sends the found gif. This is the user you defined earlier.

##### Script Enabled
This value must be true

##### Script
Now insert the complete code of the file [GifRocket.js](integration.prelegacy/GifRocket.js) into this field.

#### Save changes
Now click on "SAVE CHANGES" and you're done.

## Roadmap

[Roadmap][roadmap]

## Want to contribute? <a name="contribute"></a>
If you have any ideas on how to make this script way better, feel free to contact us. We would love to add more features. Let's improve this work together!

## Team <a name="team"></a>
* [Manuel Bachl](https://github.com/manuelbachl) (<m.bachl@finndrop.de>)<br />
* [Thies Schneider](https://github.com/thiesschneider) (<t.schneider@finndrop.de>)

## Contributors <a name="contributors"></a>
* [Bradley Hilton](https://github.com/graywolf336)

## Copyright & License <a name="license"></a>
![Finndrop Studios][finndroplogo]  

Copyright (c) since 2016 „[Finndrop Studios][finndrop]“  
Licensed under the [MIT license][license].

<!-- links -->
[rocketchat]: https://rocket.chat/ "Rocket.Chat"
[source]: https://git.finndrop-office.de/plugins/servlet/archive/projects/FDS/repos/gifrocket?at=refs%2Fheads%2Fmaster "Download GifRocket"
[finndrop]: https://www.finndrop.de "Finndrop Studios"
[roadmap]: https://github.com/FinndropStudios/GifRocket/projects/1 "Roadmap"
[license]: license/LICENSE-MIT.txt "MIT License"

<!-- images -->
[gifrocketlogo]: images/gifrocketlogo.png "GifRocket logo"
[finndroplogo]: images/finndroplogo.png "Finndrop Studios"

