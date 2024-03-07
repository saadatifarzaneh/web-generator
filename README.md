
# synthetic web-generator

This program tries to

* Generates random webpages
* Takes screenshots from each page
* Saves some element info in JSON files (`TODO`: needs to be saved in separate files)

## requirements

* install Node.js
* run `npm install`
* run the program `node main.js`

### Notes

* Copy your png/jpg logos (with arbitrary names) in `static/logos/*`.

* Copy your png/jpg alert template photos (with arbitrary names) in `static/alert_photos/*`.

## supported labels (so far)

label-name\
input-name\
label-email\
input-email\
input-phone\
label-phone\
label-username\
input-username\
label-password\
input-password\
label-address\
input-address\
label-search\
input-search\
button-login\
button-close\
button-submit\
button-search\
button-download\
button-signup\
checkbox\
recaptcha\
video\
logo\
popup\
alert

## important project files/directories

`main.js`\
`server.js`\
`save-date.js`

### vash files

`views/*.vash`\
`views/forms/*.vash`\
`alerts/*.vash` (auto-generated alerts)\
`alerts_by_photos/*.vash` (picture-based alerts; needs alert_photos)

### photo files

`alert_photos/*.[png|jpg]` (related to alerts_by_photos)\
`logos/*.[png|jpg]`

## random images

<https://source.unsplash.com/random/${width}x${height}>

<https://picsum.photos/${width}/${height}>

<https://picsum.photos/seed/@NUM/1920/1080>
