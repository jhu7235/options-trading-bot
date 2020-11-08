
export class Parser {
  /**
   * Convert YYYY.MM.DD to Date object
   */
  static parseDate(dirtyDate: string): Date {
    // 
    const dotDate = dirtyDate.replace('Published', '').trim()
    const [date, month, year] = dotDate.split('.')
    return new Date(Number(year), Number(month) - 1, Number(date));
  }

  static parse(content: string) {
    const data = content.split('<br/>')
    const dirtyPublishDate = data.shift() as string;
    const publishedDate = this.parseDate(dirtyPublishDate);
    return { publishedDate, description: data.join('<br/>').trim() }
  }
}

