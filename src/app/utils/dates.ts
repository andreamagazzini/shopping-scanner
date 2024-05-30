export const dateRegex = new RegExp(/(^|\s)(\d{1,2}[\/.-])?(\d{1,2})[\/.-](\d{4}|\d{2})(\s|$)/g);

export const formatDate = (date: Date) => {
  return date.toLocaleDateString()
}

export const identifyDates = (text: string) => {
  console.log(text)
  const dates = text.match(dateRegex) || []

  console.log(dates)
  return dates.map((dateText) => {
    const dateArray = dateText.split(/\D/).filter(Boolean)

    if (dateArray.length === 3) {
      return new Date(dateText)
    } else if (dateArray.length === 2) {
      return new Date(`01/${parseInt(dateArray[0]) + 1}/${dateArray[1]}`)
    }

    return
  })
}