import express from 'express'
import {RecaptchaV2 as Recaptcha} from 'express-recaptcha'
var options = { hl: 'en' , type: 'image'}
var recaptcha = new Recaptcha('6LfuT-UoAAAAAGK7rlMWNXAFxxqqax2zZQcMfFJh', '6LfuT-UoAAAAAJLymzHzZUD1zJENyr-n3rzoBLvt', options)

function selectFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
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
                        { template: 'form2' },
                        { template: 'half', data: ['image', 'form1'] }
                    ]]
                },
                {
                    template: 'sidebar', data: ['menu', [{ template: 'form2' }]]
                },
                { template: 'recaptcha', data: res.recaptcha },
                { template: 'half', data: ['form1', 'form1'] }
            ],
            [
                { template: 'menu' },
                { template: 'image' , date: ['0', '100']},
                {
                    template: 'sidebar', data: ['menu', [
                        { template: 'form2' },
                        { template: 'half', data: ['image', 'form1'] }
                    ]]
                },
                { template: 'image' }
            ],
    
            [
                { template: 'image' },
                { template: 'half', data: ['image', 'form2'] },
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
            if (backGroundType < .55)
                return `background-image: url('https://picsum.photos/seed/${Math.random().toString(36).substring(7)}/1920/1080'); background-size: cover;`;
            if (backGroundType < .85)
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
            background: ${sideColor}
        }
    `);
    })


    return app.listen(80);
}
