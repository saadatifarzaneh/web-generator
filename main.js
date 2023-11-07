
import express from 'express'

function selectFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}


const app = express()

app.use(express.static('static'));
//app.set('views', 'views');
app.set('view engine', 'vash');


app.get('/', async (req, res) => {
    res.status(200).render('index', {
        content: [
            { template: 'menu' },
            { template: 'image' },
            {
                template: 'sidebar', data: ['menu', [
                    { template: 'form2' },
                    { template: 'half', data: ['image', 'form'] }
                ]]
            },
            {
                template: 'sidebar', data: ['menu', [ { template: 'form2' } ]]
            },
            { template: 'form' },
            { template: 'half', data: ['image', 'form2'] },
            { template: 'half', data: ['image', 'image'] },
            { template: 'half', data: ['form', 'form'] }
        ]
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


app.listen(80);
