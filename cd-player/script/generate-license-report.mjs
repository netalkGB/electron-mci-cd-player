import * as checker from 'license-checker-rseidelsohn'
import fs from 'fs/promises'
import path from 'path'

checker.init({
  start: './',
  production: true,
  excludePrivatePackages: true
}, async function (err, packages) {
  if (err) {
    return
  }
  const keys = Object.keys(packages)
  let report = 'Third-Party Software Licenses\n This software uses the following third-party packages:\n'
  let licenseSet = new Set()
  for (const key of keys) {
    report += '--------------------------------------\n'
    const { licenses, repository, publisher, url, licenseFile } = packages[key]
    report += `${key}\n`
    if (licenses) report += `License: ${licenses}\n`
    if (repository) report += `Repository: ${repository}\n`
    if (publisher) report += `Publisher: ${publisher}\n`
    if (url) report += `URL: ${url}\n`

    const filePath = packages[key].path
    if (licenses.includes(' OR')) {
      const licenseFiles = await fs.readdir(filePath)
      const licenseFilePaths = licenseFiles.filter(file => file.match(/LICENSE/i))
      if (licenseFilePaths.length > 0) {
        for (const licenseFilePath of licenseFilePaths) {
          try {
            const data = await fs.readFile(path.join(filePath, licenseFilePath), 'utf8')
            report += `License:\n${data}\n`
          } catch (err) {
            console.error(`Error reading license file for ${key}:`, err)
            process.exit(1)
          }
        }
      } else {
        console.error(`No license file found for ${key}`)
        process.exit(1)
      }
    } else if (licenseFile) {
      const fileName = path.basename(licenseFile)
      if (fileName.match(/LICENSE/i)) {
        try {
          const data = await fs.readFile(licenseFile, 'utf8')
          report += `License:\n${data}\n`
        } catch (err) {
          console.error(`Error reading license file for ${key}:`, err)
          process.exit(1)
        }
      } else {
        console.error(`No license file found for ${key}`)
        process.exit(1)
      }
    } else {
      console.error(`No license file found for ${key}`)
      process.exit(1)
    }
    licenseSet.add(licenses)
  }
  // console.log('Licenses:', licenseSet)
  await fs.writeFile(path.join('dist', 'license.txt'), report, 'utf8')
})
