const fs = require('fs')

fs.readFile('quote.txt', 'utf8', (err, data) => {
  let words = data.split(' ')
  for(let i=0; i<words.length; i++) {
    if(words[i].toUpperCase().charAt(0) === 'B') {
      words[i] = 'BrainStation'
    }
  }

  data = words.join(' ')

  fs.writeFile('quote2.txt', data, () => {
    console.log('done')
  })
})