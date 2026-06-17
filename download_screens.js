const fs = require('fs');
const path = require('path');
const https = require('https');

const outputDir = path.join(__dirname, 'stitch_screens');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const screens = [
  {
    id: 1,
    name: 'Plan Selection',
    screenshotUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLu9zrHMTPo-OeuhZdUYu5tFVcwNk1Sd92rYBGBgOufUEK6Ghrzjw95Z5DuNbVUK4NdlV3Gy3imXS6B7pSD9gj54ywZY97k4wLQ8jXWlIhULFh6cpQ3xJyb5NTaPwaBs39q1rYR6QhJAHFrtPkCPldWn-NOXZkMujo9C4bGM-A1A19pnYBjbwbRk2BTYpj4GiP42Q7bSDydIrVV_XVx6yA-IDuzOox_OzXBDmTWh-OIKKkwXrvWiSVl4A-V_',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NDRjNDViMjRkNzYwMjNiZWNkNjQwMTRmMDVkEgsSBxDSjMHiyBIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMjQzMjY2Mjk4NzM4ODU2NDU5NQ&filename=&opi=89354086'
  },
  {
    id: 2,
    name: 'Subscription Confirmation',
    screenshotUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLtB2h20s665VE87A8IsG5uHMQKcbnIb42ES5Q-6FtFsBeiTOpbaXP6iNTsrc7FEMHV4kF6QbGg8lvfOuKAKHLf5OWcPzB6a7Sg7x0FG5pmxj51kbqLWaJWMm9v9f6y_i3woTAEbC0wdUJmR2561-kLDkwin4gs3JblOwT00QxpImQWpS3LDFA3GVfdnKV3R8IiMfY7h1hNDnFT46FegKYDlV4_Fc8VL6gYuJSSjagB5FZfdamIHUYZdj_29',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NDRjNDUzYjkwYjYwMzU2Y2U0YjVmMWM1YWFhEgsSBxDSjMHiyBIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMjQzMjY2Mjk4NzM4ODU2NDU5NQ&filename=&opi=89354086'
  },
  {
    id: 3,
    name: 'Business Information',
    screenshotUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLt896YG70m5D5NfHXKRmDjNlrF4lxk7PVkjRcN4q9MCc0fXU374sNa0AJ5a4n8p8t_db1HM7VkQdGMB-osx1mHfngYvqzExsRGyZr2-YJDayhKcdl_4pBmlL_vQLw9RuGjTaPIgDKw2s4cJ1xx_ZuerUrgEGVNZ_rroGxXIanBJY2AYFLolXzK_tx47vP0N7GmKiZVYunwW1phUn-asH8T031s83kI_jZDnqcE5z_-S0fLkDXmAg5lsHoFT',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NDRjNDRlMmJlYzcwMjNiZWMxNDUzMzU5ZjgxEgsSBxDSjMHiyBIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMjQzMjY2Mjk4NzM4ODU2NDU5NQ&filename=&opi=89354086'
  },
  {
    id: 4,
    name: 'Payment Method',
    screenshotUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLu2tL5d8Sb1iWhbNizRJKCleFOs6vBBQbwdjqVAt6_cIo_CQJjCQQtWtFDuEgxha0Cf2MKY77FmfdvPbFHUvBGV_-GP2Cu8mRCU1F5vL6qxUygs42No_DDHBH1SZxloYlbh3GFoND1PGUGv_hj_TW5FR2IdQUIkN8A6Lyxt6WBy1zKP0-E2YfzNtEtwmrHc4ueMTuJDWy04VSgiK0M6zIYcMv9Z-ZscYmg0UiaxAdWTAAIoH2qkdGsXSdoX',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NDRjNDU1NjhhY2MwNGE0NzUxMGE4MjA1NjFhEgsSBxDSjMHiyBIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMjQzMjY2Mjk4NzM4ODU2NDU5NQ&filename=&opi=89354086'
  },
  {
    id: 5,
    name: 'Branding Setup',
    screenshotUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLu6jkQNVOx2CY_-x7vXAMwfyWT23VBy4ZdYT1-Y-2VeVbf01Q1hNBuUKjg3aBxGEUT-bXChTguMLDC2_xL5-EpGiwEu9NGLoAECQmL7C3S8CWpj8SlsUvE4NufrAr-Ihkoa_IG1bQ3JW0s10lkhHpPmWdYleVo1JVukbmEow6vqeO140DHeTRtAKdSOzCluDFcRlUyROAPRFTWha2XmM6OI7SUThkjT-UbZqTVz2gmKyIN9JKPISHu1M6Nx',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NDRjNDUwMjBlNjYwMjNiZWNkNjQwMTRmMDVkEgsSBxDSjMHiyBIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMjQzMjY2Mjk4NzM4ODU2NDU5NQ&filename=&opi=89354086'
  },
  {
    id: 6,
    name: 'Location Setup',
    screenshotUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLu-kigLzKi7Fj5cBxoaO0yaSE_v8YMzR44QBBaYWn41JLkcGSzH4ZlzuDjaydTXwojD1hmt8SAMvSBtcZ3W69cXCtWxdGcEQ8dme7VarKPQvjhRE-40jx-wMwjd3tPwy_WQd9deCfstVCrZw2kwxRPKzK7-RwQsOHukCJIUlw1AzjyzSv2P7215lh1sqZh3Kf8TRtmZKNyRRqwJgY7oF2X0MLFhlMiwx8h1Tbzv-_4Lwy933AD5cl-9pQ2i',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NDRjNDUyMWZlZDQwOTY4ODUwZTM5MjM1M2NjEgsSBxDSjMHiyBIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMjQzMjY2Mjk4NzM4ODU2NDU5NQ&filename=&opi=89354086'
  },
  {
    id: 7,
    name: 'Billing Frequency',
    screenshotUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLtkOY6qGFQBBXVta18O_scbZZLi3AjrC0qz5cNrf2IOIPKQmsD8WqQZo2ZSJPOfkMzuYlu6-W2B_VQo-4GnRyD7ID55xaPoVZM7QJx9gvFIIajw0qcEoVJXP8EN8E2yXF_xUmGTbFW5JiXI31pnRe3oPmsN0HTLedWI9bSgoQ3aQ9PXbx-N2mnv0HNCI_k-3DCwFORTj2oDWm47qtXICLiKksozbzG6BfdvrZeO9JpM9oa9er2Y3VMDa1g',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NDRjNDNlYjE2MWIwMjNiZWMxNDUzMzU5ZjgxEgsSBxDSjMHiyBIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMjQzMjY2Mjk4NzM4ODU2NDU5NQ&filename=&opi=89354086'
  },
  {
    id: 8,
    name: 'Onboarding Review',
    screenshotUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLvbLbnO9bHaRdymTaCY1zKhLfbS1EdowWZXlMrbuabzF1pCzph6YYeFmGvQKsa9darm_WOnlHTRYfCbR1k2tXyDi4xc-L9BHkjtE6SFEY23kfVdugarxS45TYTD24Rb2yRMHhYAwxsXKBy-rs31-Yy-JHranmkgoR5TT0wkkUTAmbpwwUXwM_DZCGxrpB9Y_t2Qwgr0Ye4qe9zxAgUn2wxLKky6dZhs-qwPtnH0GIic8lIJNTXUW04K9eT3',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NDRjNDU5Mzc0N2YwNDRmNWY0YTZlMzUyOWYxEgsSBxDSjMHiyBIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMjQzMjY2Mjk4NzM4ODU2NDU5NQ&filename=&opi=89354086'
  },
  {
    id: 9,
    name: 'Onboarding Complete',
    screenshotUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLtXqoA359CETyJ08-xzYobT5D2EpXudNbpFFRVF4uZWvYRD6-ei9PF7gLe23Tob0Ccq_FEsYKmRpZ7w-YjxBS7QDzJQNShwZ9TkFGegq5u-SZNJa0HoszTngTwEej2jhu0bzglg7IX0U7z6OmUFisFNdO6IKfGBTDVCfPzLcN-UxozNPzAqHcpihVhmeLDIjle023qehWJ8nUi59lXEjns5Zyo3DVt4_2znkTcjb-3Wjccb7dYjHWPw_48',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NDRjNDRhNTMzMTcwM2ZiMzg1MzdjMTI2NjAwEgsSBxDSjMHiyBIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMjQzMjY2Mjk4NzM4ODU2NDU5NQ&filename=&opi=89354086'
  },
  {
    id: 10,
    name: 'Subscription Success',
    screenshotUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLvNG0rbOHQnjv3BCQ9XNZwzYVJExD1yYAnep00bJp2gnUO1ovHV8FqtjhqOgi54TBoDFANqoSqjrIYSXdrNj3bwwb_7ICn3dxnouiyEqMvJ0ldig3ZhKTOPes9TPp7Bk6oLCQQ1kA-uID7X8YHr1KCDmddQwebCFLoFok_SUQNFLp3qTbk3XrF5hQqaZKxWWkyMKgFJsRNx9k5VwiVDehw2mn_Ns0-MpKdFDjiVNbTQi--XN9zMCydLaytn',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NDRjNDQxNTY1OGIwMjNiZjkwNTcwM2E4ZWNjEgsSBxDSjMHiyBIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMjQzMjY2Mjk4NzM4ODU2NDU5NQ&filename=&opi=89354086'
  }
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        // Handle redirect
        downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      const file = fs.createWriteStream(destPath);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function run() {
  for (const screen of screens) {
    const safeName = screen.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const imagePath = path.join(outputDir, `${screen.id}_${safeName}.png`);
    const htmlPath = path.join(outputDir, `${screen.id}_${safeName}.html`);
    
    console.log(`Downloading ${screen.name} screenshot...`);
    try {
      await downloadFile(screen.screenshotUrl, imagePath);
      console.log(`Saved screenshot to ${imagePath}`);
    } catch (e) {
      console.error(`Failed to download ${screen.name} screenshot:`, e.message);
    }
    
    console.log(`Downloading ${screen.name} HTML code...`);
    try {
      await downloadFile(screen.htmlUrl, htmlPath);
      console.log(`Saved HTML to ${htmlPath}`);
    } catch (e) {
      console.error(`Failed to download ${screen.name} HTML:`, e.message);
    }
  }
  console.log('Finished downloading all screens!');
}

run();
