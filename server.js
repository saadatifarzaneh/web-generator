import express from 'express'
import { readdirSync } from 'fs';
import { basename } from 'path';

import { RecaptchaV2 as Recaptcha } from 'express-recaptcha'
var options = { hl: 'en' , type: 'image'}
var recaptcha = new Recaptcha('6LfuT-UoAAAAAGK7rlMWNXAFxxqqax2zZQcMfFJh', '6LfuT-UoAAAAAJLymzHzZUD1zJENyr-n3rzoBLvt', options)

function selectFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const getFormsFilenames = (formsDir) => {
    try {  
        const files = readdirSync(formsDir);
        return files
            .filter(file => file.endsWith('.vash'))
            .map(file => basename(file, '.vash'));
    } catch (err) {
        console.error('Error reading forms directory:', err);
        return [];
    }
};

const getPhotosFilenames = (PhotosDir) => {
    try {  
        const files = readdirSync(PhotosDir);
        return files
            .filter(file => file.endsWith('.jpg') || file.endsWith('.png'));
    } catch (err) {
        console.error('Error reading photos directory:', err);
        return [];
    }
};


const formsDir = './views/forms/';
const formsFilenames = getFormsFilenames(formsDir);
function randomForm() {
    // return `forms/form-simple1`;
    return `forms/${selectFrom(formsFilenames)}`;
}

const alertsDir = './views/alerts/';
const alertsFilenames = getFormsFilenames(alertsDir);
function randomAlert() {
    // return `alerts/alert_bottom`;
    return `alerts/${selectFrom(alertsFilenames)}`;
}

const alertsByPhotosDir = './views/alerts_by_photos/';
const alertsByPhotosFilenames = getFormsFilenames(alertsByPhotosDir);
function randomAlertByPhotos() {
    // return `alerts_by_photos/alert_3photos_top_right`;
    return `alerts_by_photos/${selectFrom(alertsByPhotosFilenames)}`;
}

const logosDir = './static/logos/';
const logosFilenames = getPhotosFilenames(logosDir);
function randomLogo() {
    return `logos/${selectFrom(logosFilenames)}`;
}

const alertPhotosDir = './static/alert_photos/';
const alertPhotosFilenames = getPhotosFilenames(alertPhotosDir);
function randomAlertPhoto() {
    return `alert_photos/${selectFrom(alertPhotosFilenames)}`;
}


export function startServer() {
    const app = express()
    app.use(express.static('static'));
    //app.set('views', 'views');
    app.set('view engine', 'vash');

    app.get('/', recaptcha.middleware.render, async (req, res) => {
        const templates = [
            //0
            [
                { template: 'popup' , data:['25']},
                { template: 'logo-image', data: [randomLogo(), '125'] },
                { template: 'image', data: ['200', '100'] },
                {
                    template: 'sidebar', data: ['menu', [
                        { template: randomForm(), data: res.recaptcha },
                        {
                            template: 'half', data: [
                                [{ template: 'video', data: ['0', '1000'] }],
                                [{ template: randomForm(), data: res.recaptcha }]
                            ]
                        }
                    ]]
                },
            ],

            //1
            [
                {
                    template: randomAlertByPhotos(),
                    data: [randomAlertPhoto(), randomAlertPhoto(), randomAlertPhoto()]
                },
                { template: 'menu' },
                { template: 'image', data: ['100', '20'] },
                {
                    template: 'sidebar', data: ['menu', [
                        { template: randomForm(), data: res.recaptcha },
                        {
                            template: 'half', data: [
                                [{ template: 'image', data: ['1000', '0'] }],
                                [{ template: 'image', data: ['1000', '0'] }]
                            ]
                        }
                    ]]
                },
                { template: 'image' }
            ],
            
            //2
            [
                { template: 'popup' , data:['50']},
                { template: 'logo-menu', data: [randomLogo(), '125', { template: 'menu', data: ['4', '3']}] },
                {
                    template: 'half', data: [
                        [{ template: 'video' }],
                        [{ template: 'video' }]
                    ]
                },
                { template: 'image' },
            ],

            //3
            [
                {
                    template: randomAlertByPhotos(),
                    data: [randomAlertPhoto(), randomAlertPhoto(), randomAlertPhoto()]
                },
                { template: 'popup' , data:['50']},
                { template: 'logo-image', data: [randomLogo(), '150'] },
                { template: 'menu' },
                { template: randomForm(), data: res.recaptcha },
                { template: 'image' }
            ],

            //4
            [
                {
                    template: 'alert',
                    data: [randomAlert()],
                },
                {
                    template: 'sidebar', data: ['menu', [
                        { template: 'image' },
                        {
                            template: 'half', data: [
                                [{ template: 'image', data: ['1000', '0'] }],
                                [{ template: 'recaptcha', data: res.recaptcha }]
                            ]
                        }
                    ]]
                }
            ]
        ]

        res.status(200).render('index', {
            recaptcha: res.recaptcha,
            content: selectFrom(templates),
            // content: templates[3],
        });
    });

    app.get('/random.css', (req, res) => {
        const font = selectFrom(['Barlow', 'Inter', 'Merriweather', "'Open Sans'"]);
        const fontSize = Math.floor(Math.random() * 16) + 16;
        const sideColor = selectFrom(['#d54', '#393', '#000']);

        const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        const randomBackground = () => {
            const backGroundType = Math.random();
            if (backGroundType < .30)
                return `background-image: url('https://picsum.photos/seed/${Math.random().toString(36).substring(7)}/1920/1080'); background-size: cover;`;
            if (backGroundType < .75)
                return `background-color: ${randomColor()};`;
            return '';
        }

        res.status(200).send(`
        body, input, select {
            font-family: ${font};
            font-size: ${fontSize}px;
        }

        body {
            ${randomBackground()};
        }

        .side {
            background: ${sideColor} !important;
        }
    `);
    })


    return app.listen(80);
}
