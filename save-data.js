import puppeteer from "puppeteer"
import { promises as fs } from "fs"

const output_dir = "outputs"
const viewport = {
    width: 1920, // width of the viewport in pixels
    height: 2160, // height of the viewport in pixels
};


function findElements() {
    let data = [];
    document.querySelectorAll('.save').forEach(el => {
        const rect = el.getBoundingClientRect();
        data.push({
            type: el.dataset.type,
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height
        });
    });
    return data;
}
    
export async function saveData(numPages) {
    const browser = await puppeteer.launch({
        headless: 'new' // Opt-in to the new headless mode
        // ... include any other options you need
    });
    const page = await browser.newPage();

    // Set the viewport size
    await page.setViewport({ width: viewport.width, height: viewport.height });

    for (let index = 1; index <= numPages; index++) {
        console.log(`Processing page ${index}/${numPages}`)
        await page.goto("http://localhost");

        const screenshotPath = `${output_dir}/page_${index}.png`;
        await page.screenshot({ path: screenshotPath });
        const data = await page.evaluate(findElements)

        await fs.writeFile(`${output_dir}/page_${index}.elements.json`, JSON.stringify(data, null, 2));
    }
    console.log(`Process finished`)
    await browser.close();
}