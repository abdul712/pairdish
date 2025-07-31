// CSV Parser for PairDish data import
export interface CSVRow {
  keyword: string
  mainDish: string
  sideDishes: string[]
}

export function parseCSV(csvContent: string): CSVRow[] {
  const lines = csvContent.split('\n').filter(line => line.trim())
  const headers = lines[0].split(',').map(h => h.trim())
  
  const rows: CSVRow[] = []
  
  for (let i = 1; i < lines.length; i++) {
    // Handle multi-line cells with quotes
    let currentRow = lines[i]
    let inQuotes = false
    let quoteCount = (currentRow.match(/"/g) || []).length
    
    // If odd number of quotes, we're in a multi-line cell
    while (quoteCount % 2 !== 0 && i < lines.length - 1) {
      i++
      currentRow += '\n' + lines[i]
      quoteCount = (currentRow.match(/"/g) || []).length
    }
    
    const cells = parseCSVLine(currentRow)
    
    if (cells.length >= 3) {
      const row: CSVRow = {
        keyword: cells[0].trim(),
        mainDish: cells[1].trim(),
        sideDishes: []
      }
      
      // Collect all side dishes (columns 2 through 16)
      for (let j = 2; j < cells.length && j < 17; j++) {
        const sideDish = cells[j].trim()
        if (sideDish) {
          row.sideDishes.push(sideDish)
        }
      }
      
      rows.push(row)
    }
  }
  
  return rows
}

function parseCSVLine(line: string): string[] {
  const cells: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      cells.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  // Add the last cell
  if (current || cells.length > 0) {
    cells.push(current.trim())
  }
  
  return cells
}