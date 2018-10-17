const fs = require('fs')
const fileName = process.argv[2]

if (!fileName) {
  console.log('Error: Missing File')
  console.log('Usage: node compress.js <FileName>')
  return
}

// Open the file and read the data
fs.readFile(fileName, 'utf8', (err, data) => {
  // Convert the data into an array. Every line will be an element
  // in the array
  let lines = data.split('\n')

  if (lines[0] === '[cmp]') {
    lines.shift()
    decompress(lines)
  } else {
    compress(lines)
  }

})

function compress(lines) {
  // This will contain the compressed version of the content
  let compressed = ''

  // Loop through each line, and count the characters
  for (let i = 0; i < lines.length; i++) {
    // Set the count to be 1, since each line has at least 
    // 1 character
    let count = 1
    // Loop through each character in the line.
    for (let j = 0; j < lines[i].length; j++) {
      // Check if the current character matches the next character
      // If it does, then we increase the count and continue
      if (lines[i].charAt(j) === lines[i].charAt(j + 1)) {
        count++
      } else {
        // If we didn't match, that means the next character is a new
        // character. We can use our count to encode the character and
        // add it to our compressed output
        compressed += count + '|' + lines[i].charAt(j) + '&&'

        // Reset count back to 1
        count = 1
      }
    }
    // Add a new line character so that each line of our compressed output
    // is preserved, but don't need to add a new line at the end
    if (i < lines.length - 1) compressed += '\n'
  }

  // Add a tag to indicate that this file is compressed
  compressed = '[cmp]\n' + compressed

  // Write out the compressed file
  fs.writeFile(fileName + '.cmp', compressed, () => {
    console.log(fileName + ' compressed to ' + fileName + '.cmp')
  })
}

// Decompress the file
function decompress(lines) {

  let decompressed = ''

  // Loop through each line
  for (let i = 0; i < lines.length; i++) {
    // Split each line into the encoded characters. 
    // e.g) 3|x&&4|y&&5|z ===> xxxyyyyzzzzz
    let chars = lines[i].split('&&')
    for (let j = 0; j < chars.length; j++) {
      // get the number of times to repeat and the character to repeat
      const num = Number(chars[j].substring(0, chars[j].indexOf('|')))
      const char = chars[j].substring(chars[j].indexOf('|') + 1)
      // Add to our decompressed data
      decompressed += char.repeat(num)
    }
    // Preserve the lines
    if (i < lines.length - 1) decompressed += '\n'
  }

  // Write out to a file
  fs.writeFile(fileName + '.uncmp', decompressed, () => {
    console.log(fileName + ' uncompressed to ' + fileName + '.uncmp')
  })
}