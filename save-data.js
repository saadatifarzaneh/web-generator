import puppeteer from "puppeteer"
import { promises as fs } from "fs"

const output_dir = "outputs"
const viewport = {
    width: 1920, // width of the viewport in pixels
    height: 1080, // height of the viewport in pixels
};
  
function findElements() {
    function doRectanglesIntersect(r1, r2) {
        const horizontalOverlap = r1.x1 < r2.x2 && r1.x2 > r2.x1;
        const verticalOverlap = r1.y1 < r2.y2 && r1.y2 > r2.y1;
        return horizontalOverlap && verticalOverlap;
    }
    
    const annotation_dict = {
        "checkbox": "Checkbox",
        "input-name": "Name Input Box",
        "label-name": "Name",
        "input-phone": "Phone Input Box",
        "label-phone": "Phone Number",
        "logo": "Logo",
        "recaptcha": "Click Captcha",
        "video": "Video",
        "popup": "Popup",
        "alert": "Alert Notification",
        "button-signup": "Login Button",
        "button-download": "Download Button",
        "button-submit": "Submit Button",
        "button-login": "Login Button",
        "button-search": "Search Button",
        "input-search": "Search Input Box",
        "button-close": "Close Button",
        // "label-search": ""
        "label-email": "Email Address",
        "input-email": "Email Input Box",
        // "label-username": 
        // "input-username":
        "label-password": "Password",
        "input-password": "Password Input Box",
        "label-address": "Address",
        "input-address": "Address Input Box",
    };

    function makeId(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }

    let popups_boundaries = [];
    document.querySelectorAll('.save').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (el.dataset.type == "popup")
            popups_boundaries.push({
                    x1: rect.left,
                    y1: rect.top,
                    x2: rect.left + rect.width,
                    y2: rect.top + rect.height,
                }
            )
    });

    let annotations = [];
    let generator_annotations = [];
    document.querySelectorAll('.save').forEach(el => {
        const rect = el.getBoundingClientRect();

        let boundaries = {
            x1: rect.left,
            y1: rect.top,
            x2: rect.left + rect.width,
            y2: rect.top + rect.height
        }

        for (let pb in popups_boundaries)
            if (doRectanglesIntersect(pb, boundaries))
                return;

        let new_type = "";
        if (el.dataset.type in annotation_dict)
            new_type = annotation_dict[el.dataset.type];
        else
            new_type = "Other";

        annotations.push({
            type: "rectanglelabels",
            value: {
                id: makeId(10),
                x: rect.left,
                y: rect.top,
                width: rect.width,
                height: rect.height,
                "rectanglelabels": [
                    new_type
                ],
            }
        });

        generator_annotations.push({
            type: el.dataset.type,
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
        });
    });

    document.querySelectorAll('iframe[title="reCAPTCHA"]').forEach(el => {
        const rect = el.getBoundingClientRect();

        let boundaries = {
            x1: rect.left,
            y1: rect.top,
            x2: rect.left + rect.width,
            y2: rect.top + rect.height
        }

        for (let pb in popups_boundaries)
            if (doRectanglesIntersect(pb, boundaries))
                return;

        annotations.push({
            type: "rectanglelabels",
            value: {
                id: makeId(10),
                x: rect.left,
                y: rect.top,
                width: rect.width,
                height: rect.height,
                "rectanglelabels": [
                    annotation_dict['recaptcha']
                ],
            }
        });

        generator_annotations.push({
            type: "recaptcha",
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
        });
    });

    return [annotations, generator_annotations];
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
        const [page_annotations, page_annotations_generator] = await page.evaluate(findElements)
        
        let page_id = index + shift_ids
        let single_json = {
            id: page_id,
            annotations: [{
                id: page_id,
                result: page_annotations
            }],
            file_upload: `page_${index}.png`,
            data: { image: screenshotPath },
            // // old annotations
            // annotations_generator: page_annotations_generator,
        }
        final_json.push(single_json);

        // // old json format:
        // let single_json_generator = {
        //     id: page_id,
        //     file: `page_${index}.png`,
        //     full_path: screenshotPath,
        //     annotations: page_annotations_generator,
        // }
        // await fs.writeFile(`${output_dir}/page_${index}.elements_generator.json`, JSON.stringify(single_json_generator, null, 4));

        // new json format:
        await fs.writeFile(`${output_dir}/page_${index}.elements.json`, JSON.stringify(single_json, null, 4));
    }
    await fs.writeFile(`${output_dir}/all_elements.json`, JSON.stringify(final_json, null, 4));

    console.log(`Process finished`)
    await browser.close();
}