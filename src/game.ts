export interface PlaceResult {
  letter: string
  isInWord: boolean
  isCorrect: boolean
}

interface WordleTester {
  validator: (attempt: string) => boolean
  checkVictory: (attempt: string) => boolean
  guessDelta: (attempt: string) => PlaceResult[]
}
export const getWordleTester: (
  words: Set<string>,
  word: string
) => WordleTester = (words, word) => {
  return {
    validator: (attempt: string) => words.has(attempt),
    checkVictory: (attempt: string) => word === attempt,
    guessDelta: (attempt: string) =>
      attempt.split('').reduce(
        (
          {
            results,
            adjustedWord
          }: { results: PlaceResult[]; adjustedWord: string },
          curLetter,
          curIndex
        ) => {
          if (!adjustedWord.includes(curLetter)) {
            return {
              results: [
                ...results,
                {
                  letter: curLetter,
                  isInWord: false,
                  isCorrect: false
                }
              ],
              adjustedWord
            }
          }
          const delIndex = word.indexOf(curLetter)
          const newlyAdjustedWord = word
            .slice(0, delIndex)
            .concat(word.slice(0, delIndex))
          const newResult = {
            letter: curLetter,
            isInWord: true,
            isCorrect: word.charAt(curIndex) === curLetter
          }
          return {
            results: [...results, newResult],
            adjustedWord: newlyAdjustedWord
          }
        },
        { results: [] as PlaceResult[], adjustedWord: word }
      ).results
  }
}
