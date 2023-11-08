import express from 'express'
import {RecaptchaV2 as Recaptcha} from 'express-recaptcha'
var options = { hl: 'en' , type: 'image'}
var recaptcha = new Recaptcha('6LfuT-UoAAAAAGK7rlMWNXAFxxqqax2zZQcMfFJh', '6LfuT-UoAAAAAJLymzHzZUD1zJENyr-n3rzoBLvt', options)


function selectFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const numForm = 5
function randomForm() {
    return `forms/form${Math.floor(Math.random() * numForm) + 1}`
    // return `forms/form${5}`
}

export function startServer() {
    const app = express()

    app.use(express.static('static'));
    //app.set('views', 'views');
    app.set('view engine', 'vash');

    app.get('/', recaptcha.middleware.render, async (req, res) => {
        const templates = [
            [
                { template: 'menu' },
                { template: 'image' , data: ['100', '200']},
                {
                    template: 'sidebar', data: ['menu', [
                        { template: randomForm() },
                        {
                            template: 'half', data: [
                                [ { template: 'image' , data: ['0', '1000']} ],
                                [ { template: randomForm() } ]
                            ]
                        }
                    ]]
                },
                { template: 'recaptcha', data: res.recaptcha },
            ],
            [
                { template: 'menu' },
                { template: 'image' , data: ['20', '100']},
                {
                    template: 'sidebar', data: ['menu', [
                        { template: randomForm() },
                        {
                            template: 'half', data: [
                                [ { template: 'image' , data: ['0', '1000']} ],
                                [ { template: randomForm() } ]
                            ]
                        }
                    ]]
                },
                { template: 'image' }
            ],
    
            [
                { template: 'image' },
                {
                    template: 'half', data: [
                        [ { template: 'recaptcha', data: res.recaptcha } ],
                        [ { template: randomForm() } ]
                    ]
                },
                { template: 'image' }
            ],

            [
                { template: 'image' },
                {
                    template: 'sidebar', data: ['menu', [{ template: randomForm() }]]
                },
                { template: 'recaptcha', data: res.recaptcha },
                { template: 'image' }
            ]
        ]

        res.status(200).render('index', {
            recaptcha: res.recaptcha,
            content: selectFrom(templates)
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
