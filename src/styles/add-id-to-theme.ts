import themes from './theme-list.json'
import fs from 'fs'

const updated = themes.map((theme, idx) => {
  return {
    ...theme,
    id: idx + 1,
  }
})

fs.writeFileSync('./theme-list.json', JSON.stringify(updated, null, 2))
