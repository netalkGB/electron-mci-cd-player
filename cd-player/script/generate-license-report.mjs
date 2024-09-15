import checker from 'license-checker'
import fs from 'fs/promises'
import path from 'path'

checker.init({
  start: './'
}, async function (err, packages) {
  if (err) {
    return
  }
  const keys = Object.keys(packages)
  let report = ''
  for (const key of keys) {
    const { licenses, repository, publisher, url, licenseFile } = packages[key]
    report += `${key}\n`
    if (licenses) report += `License: ${licenses}\n`
    if (repository) report += `Repository: ${repository}\n`
    if (publisher) report += `Publisher: ${publisher}\n`
    if (url) report += `URL: ${url}\n`
    if (licenseFile) {
      const fileName = path.basename(licenseFile)
      if (fileName.match(/LICENSE/i)) {
        try {
          const data = await fs.readFile(licenseFile, 'utf8')
          report += `License:\n${data}\n`
        } catch (err) {
          console.error(err)
        }
      }
    }
    report += '\n--------------------------------------\n'
  }
  await fs.writeFile(path.join('dist', 'license.txt'), report, 'utf8')
})
