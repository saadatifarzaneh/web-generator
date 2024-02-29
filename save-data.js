import puppeteer from "puppeteer"
import { promises as fs } from "fs"

const output_dir = "outputs"
const viewport = {
    width: 1920, // width of the viewport in pixels
    height: 1080, // height of the viewport in pixels
};

function findElements() {
    let annotations = [];
    document.querySelectorAll('.save').forEach(el => {
        const rect = el.getBoundingClientRect();
        annotations.push({
            type: "rectanglelabels",
            value: {
                id: 'XXXXXXXXXX',
                x: rect.left,
                y: rect.top,
                width: rect.width,
                height: rect.height,
                type: el.dataset.type,
                "rectanglelabels": [
                    el.dataset.type
                ],
            }
        });
    });

    document.querySelectorAll('iframe[title="reCAPTCHA"]').forEach(el => {
        const rect = el.getBoundingClientRect();
        annotations.push({
            type: "rectanglelabels",
            value: {
                id: 'XXXXXXXXXX',
                x: rect.left,
                y: rect.top,
                width: rect.width,
                height: rect.height,
                type: 'recaptcha',
                "rectanglelabels": [
                    'recaptcha'
                ],
            }
        });
    });
    
    return annotations;
}
    
export async function saveData(numPages) {
    const browser = await puppeteer.launch({
        headless: 'new' // Opt-in to the new headless mode
        // ... include any other options you need
    });
    const page = await browser.newPage();

    // Set the viewport size
    await page.setViewport({ width: viewport.width, height: viewport.height });
    let shift_ids = 0
    let final_json = [];
    for (let index = 1; index <= numPages; index++) {
        console.log(`Processing page ${index}/${numPages}`)
        await page.goto("http://localhost");

        const screenshotPath = `${output_dir}/page_${index}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: false });
        const page_annotations = await page.evaluate(findElements)
        let page_id = index + shift_ids
        final_json.push({
            id: page_id,
            annotations: [{
                id: page_id,
                result: page_annotations
            }],
            file_upload: `page_${index}.png`,
            data: {image: screenshotPath},
        });

        await fs.writeFile(`${output_dir}/page_${index}.elements.json`, JSON.stringify(page_annotations, null, 4));
    }
    await fs.writeFile(`${output_dir}/all_elements.json`, JSON.stringify(final_json, null, 4));
    
    console.log(`Process finished`)
    await browser.close();
}