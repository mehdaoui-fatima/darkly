
import got from 'got';
import * as cheerio from 'cheerio';
import { writeFile } from 'fs/promises';

async function traverseDirectory(baseUrl) {
    const htmlPage = await got(baseUrl).text(); // Corrected to await
    const $ = cheerio.load(htmlPage);

    const linksToDirsToTraverse = [];

    // Extract links to subdirectories
    $('a').each((index, element) => {
        const href = $(element).attr('href');

        if (!href.startsWith('..') && href !== 'README') {
            linksToDirsToTraverse.push(href);
        }
    });

    // Fetch the current directory's README
    const currentDirReadme = await got('README', { prefixUrl: baseUrl }).text();

    // Initialize an array to hold all results
    const allReadmes = [currentDirReadme];
    console.log(currentDirReadme)

    // Process subdirectories
    for (const dirToTraverse of linksToDirsToTraverse) {
        const subdirectoryReadmes = await traverseDirectory(baseUrl + dirToTraverse); // Recursively fetch subdirectory READMEs
        // console.log(subdirectoryReadmes);
        allReadmes.push(...subdirectoryReadmes); // Add subdirectory READMEs to the results
    }

    return allReadmes;
}

// Example usage
(async () => {
   const baseUrl = 'http://192.168.64.2/.hidden/';

    try {
        const allReadmes = await traverseDirectory(baseUrl);
        console.log('All README files:', allReadmes);
        await writeFile('./results.txt', allReadmes)
    } catch (error) {
        console.error('Failed to traverse directories:', error.message);
    }
})();
