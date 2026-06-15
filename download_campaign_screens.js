const fs = require('fs');
const path = require('path');
const https = require('https');

const outputDir = path.join(__dirname, 'campaign_screens');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const screens = [
  {
    id: 1,
    name: 'Campaigns Home',
    screenshotUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLuh97M5Eam5CwDT5Ava6957rIQ-c0mqkXdKyGn_h-_xysf_2rbMB2oUSElLqok0RMNzpGlm2InHSYJ9cTeQ1_c5p-jmGMFWa7L9zcEfhyJOwtWTTJ95apmLBS7adFo9bS0Xe2e5rP-qnz3gkEyspSUjZeN7lIIMyulJwedvPQoqOhX9vQC3iTUCnZIKhamXeVFbR5zOsvzBH-ZYuSDDoaKQfe9g11vLrcS8UGZ0_CKgOzUTrRIJiekdSI8',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NDRjNzYxZTIwOWQwNDRmNWY0YTZlMzUyOWYxEgsSBxDSjMHiyBIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMjQzMjY2Mjk4NzM4ODU2NDU5NQ&filename=&opi=89354086'
  },
  {
    id: 2,
    name: 'Create Campaign Step 1',
    screenshotUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLtttVEUKpBwUhd6SHqi06nU2jsyGwNjwFgKLjCVWlpCgVcg846CutKvBAr1DfAXWqbJsFsL33xhxbVVoMBEf92wrvQmwy1UEFGmjh0qwlttltpZCUq2wlT06gkMNPMAmZ-kkyIEHdWgaH7BeFJVBSfycuuVdKhQmQMf277GtR4GUD5SqTFTj60rsylw40r2KnXXuUsY7zAF92I_eQ69DA_yLWOS5wj1bQRa3sPkF7AJL7_LwN19LGt_Jfw',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NDRjNzU3Mjg0NTcwNDVhZGE1N2FlMmUyZDg5EgsSBxDSjMHiyBIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMjQzMjY2Mjk4NzM4ODU2NDU5NQ&filename=&opi=89354086'
  },
  {
    id: 3,
    name: 'Create Campaign Step 2',
    screenshotUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLvS_V9Vfpf7-mDtAqTnR-0sAgNVY39nPYsIq83xXRCFqE0tYL1cPzKoNK7jH1-GpQiR_ogpRbT3yJNqN_6gEsS52MMgaFYtkYaVXVER9-NH__ofkqbI1mAO0T0dkRkgWuCu8aPO5c3f7Pp5x9KKYqMrETOTsxCNxjoCuy1ldmPX93JhADIvAvK0QveM2OUENEHqJA4BY3dbOtcoALEaKaUifQLkSC5-FGvOIV7ok9C8SD2-R6c7Fd09GZeq',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NDRjNzY2MjNjY2QwNDRmNzkyMzk4MjFhMDE3EgsSBxDSjMHiyBIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMjQzMjY2Mjk4NzM4ODU2NDU5NQ&filename=&opi=89354086'
  },
  {
    id: 4,
    name: 'Create Campaign Step 3',
    screenshotUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLueaAWsv19q2f0hRM5Vq46AMg3XSPe64Gz8nmBgR2eQqc3Fxu7dvYcBL-T2cLRfp_8fH5syH9i_2_OgivMTMugllt9mwsLdDmTccmJj17torVv-AkHfD2NI9cr3G7ejZ_MuxQGbQYps3MyhDNSDiejtw6XtDdngCoJaoi1k7M8p0ljxPDDBCN7rYQQvSn8iZAAWWQcg35XICxawXUJEf5YjjDc7NzOvGfXWV6pJYlxEBVMwCBx3H_batrBU',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NDRjNzY0MTVkMzAwMjNiZWNkNjQwMTRmMDVkEgsSBxDSjMHiyBIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMjQzMjY2Mjk4NzM4ODU2NDU5NQ&filename=&opi=89354086'
  },
  {
    id: 5,
    name: 'Create Campaign Step 4',
    screenshotUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLvtkEoGAmnvwUQ_epEEBqXvsQx0wdolDw9ZsE_nU_O-j-la5yMkQW_RYAwrO5FJ6eGwefKL0KrsvUm3ZRPpGc8tCnx2KbFFkr1cFSJU_ei_Mbr-nC9k_FPpqQHTcLu0977Q2m-v65SuheSekiMqirsUBZp7buUnxB_8cAIRfLkRJYuFOFU-3sWv7j4kNQkPM4espEELgnq8XeaetlReMBF2GROIDiKAkEmOHwkd3lCM66bG_IbIzkc-ccA',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NDRjNzVjZGU1NzMwMjNiZGU4YWU0MzEyOWVkEgsSBxDSjMHiyBIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMjQzMjY2Mjk4NzM4ODU2NDU5NQ&filename=&opi=89354086'
  },
  {
    id: 6,
    name: 'Campaign Details Overview',
    screenshotUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLvwtujmkcPUI8Poy6bFu0r_XWG0QR_dOj75jkgiP-SmBmj4nmZnf40YkuK7UEqA7gnhQFkDHBXCBif27oh2P3Kw5dh3vCdhMGSS9Dsec1Cuwhz6-fqDyGJtAM3tSKQ68dbv_V5jb7SrrjgFYvRTMx0suMGHRuM95UxI_tT4DK6BduIRxOGfiHYO1KxQaB-Ie3W6Nsq9f5w0vgFMCTDg3AM9CyR8s5UeIRcOWkXrZ6gWPrIUI05KvvQ9ESQ',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NDRjNzkzZWIzOTMwMjNiZWMxNDUzMzU5ZjgxEgsSBxDSjMHiyBIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMjQzMjY2Mjk4NzM4ODU2NDU5NQ&filename=&opi=89354086'
  },
  {
    id: 7,
    name: 'Campaign Rules Tab',
    screenshotUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLtagknQJ4tcGEClCOELXrMNWnNw4d6r1uN6LlcrR8AktQNw6nyng3PwRiYsUI1zOQ8xXzxzNEGlrX-ZBSH9by6ryR9XyOGPPXKXiRmr4Kn-ScEXM5y_W-WJkb27ms7PK8qBJTUbsW3wFzl8Pvv3uu53vR0akewrJP6oVJ9plbFnyYObRGGXc4qXRbW7aDj4Y11vR7gb6zDnn3-V_lXZYqVzSQKzXjYyEGLnELRVYw_NWcGvbmmGcFT30Dk7',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NDRjNzhkYTRkZGQwMjI3YmZkMGZiMDMzMTIyEgsSBxDSjMHiyBIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMjQzMjY2Mjk4NzM4ODU2NDU5NQ&filename=&opi=89354086'
  },
  {
    id: 8,
    name: 'Campaign Rewards Tab',
    screenshotUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLs_IOtnnDA9Iyk-xQL6LFJRaenawcxGmcZXRjlJBikvXbafR_pUUK0-L_AMXONSLB9zoMC1XQBJCSzmWQhozvc4cq714HqcQRXhvmy6Iph7_NV95VjpbwNp23LDWyjUCRYwVGDVqCL2QNqKeUs0S8Rr3-vArnUmX4tOeZenzOgs9iMk6fyX1hkI-RspBq7Rfs0P99aN1ACp4h2hpXkjGiuIAG9K_c26DyyZs6Vk5iK4frOHZ2xbs-n9Qh-1',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NDRjNzlkNjc1YzAwNDRmNzkyMzk4MjFhMDE3EgsSBxDSjMHiyBIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMjQzMjY2Mjk4NzM4ODU2NDU5NQ&filename=&opi=89354086'
  },
  {
    id: 9,
    name: 'Campaign Performance Tab',
    screenshotUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLvqq7EvtHwGhPFn7HSZ-ZrvBvf45_bzwIY-njmtGhkUXmC_7s3wJQ8qX1FLgdvDiuH53UgX4nR0tO4AptLwVL6C6k251zrY_MYTK6za8jSi10UPOGk1KQDQI7SNfIwU-VI0KCUOFyU7LYuEjCwB3V2iUt2lxLTVXXmRlqIDQZi3R6BYxa8_Czme27AAL1ONWc9FKfPMWQ2TTvxbQRgpxg2vKnu5HVNznvxa5JWJUgZrfCMnRepMbgkOwk2G',
    htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NDRjNzhmOWMyNzcwMjNiZGJkMWYyMmFmYmU3EgsSBxDSjMHiyBIYAZIBJAoKcHJvamVjdF9pZBIWQhQxMjQzMjY2Mjk4NzM4ODU2NDU5NQ&filename=&opi=89354086'
  }
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function main() {
  for (const screen of screens) {
    const safeName = screen.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    console.log(`Downloading ${screen.name}...`);
    
    const screenshotPath = path.join(outputDir, `${screen.id}_${safeName}.png`);
    await downloadFile(screen.screenshotUrl, screenshotPath);
    
    const htmlPath = path.join(outputDir, `${screen.id}_${safeName}.html`);
    await downloadFile(screen.htmlUrl, htmlPath);
    
    console.log(`Finished ${screen.name}`);
  }
  console.log('All screens downloaded to stitch_campaign_screens/');
}

main().catch(console.error);
