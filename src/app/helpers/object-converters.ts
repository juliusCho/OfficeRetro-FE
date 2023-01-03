export const convertToColumnizedArray = <T>(arr: T[], columnCount: number) => {
  const result: Array<T[]> = []

  let stack: T[] = []
  let columnIdx = 0
  arr.forEach((item) => {
    if (columnIdx + 1 === columnCount) {
      columnIdx = 0
      stack.push(item)
      result.push(stack)
      stack = []
    } else {
      columnIdx += 1
      stack.push(item)
    }
  })

  if (stack.length > 0) {
    result.push(stack)
  }

  return result
}
