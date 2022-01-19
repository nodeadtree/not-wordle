import React, { FC, useEffect, useReducer } from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

import { getWordleTester, PlaceResult } from './game'
import { LetterBox, LetterBoxState, LetterBoxProps } from './LetterBox'
const words = new Set(['bear', 'leap', 'sper'])

// Throw this in the utils folder at some point?
// sorry
const getEmptyLetterBoxes = (letterCount: number) =>
  new Array<LetterBoxProps>(letterCount).fill({
    value: ' ',
    state: LetterBoxState.vacant
  })
const getEmptyGridRows = (rows: number, letterCount: number) =>
  new Array<LetterBoxProps[]>(rows).fill(getEmptyLetterBoxes(letterCount))

const placeResultToProps = (position: PlaceResult) => ({
  value: position.letter,
  state: position.isCorrect
    ? LetterBoxState.correctLetter
    : position.isInWord
    ? LetterBoxState.misplacedLetter
    : LetterBoxState.incorrectLetter
})

const getTopGrid = (
  entryRow: LetterBoxProps[],
  previousAttempts: PlaceResult[][]
): LetterBoxProps[][] => {
  return [
    ...previousAttempts.map(attempt => attempt.map(placeResultToProps)),
    entryRow
  ]
}

const getEntryProps = (positions: number) => (entry: string) =>
  [
    ...entry.split('').map((letter: string) => ({
      value: letter,
      state: LetterBoxState.inputStandby
    })),
    ...(entry.length < positions
      ? [
          {
            value: ' ',
            state: LetterBoxState.thirstyForInput
          }
        ]
      : []),
    ...(entry.length < positions - 1
      ? getEmptyLetterBoxes(positions - entry.length - 1)
      : [])
  ]

interface AttemptState {
  entry: string
  previousAttempts: PlaceResult[][]
}

const WordleGrid: FC<{ letterCount: number; attempts: number }> = ({
  letterCount,
  attempts
}) => {
  const [gameState, setAttempt] = useReducer(
    (state: AttemptState, event: KeyboardEvent) => {
      const wordleTester = getWordleTester(words, 'bear')
      const { entry, previousAttempts } = state
      // get more words, randomize, blah blah blah
      const currentAttempts =
        event.key === 'Enter' && wordleTester.validator(entry)
          ? [...previousAttempts, wordleTester.guessDelta(entry)]
          : previousAttempts
      const newEntry =
        'abcdefghijklmnopqrstuvwxyz'.includes(event.key) &&
        entry.length < letterCount
          ? entry.concat(event.key)
          : event.key === 'Backspace' && entry.length > 0
          ? entry.slice(0, entry.length - 1)
          : event.key === 'Enter' && wordleTester.validator(entry)
          ? ''
          : entry
      return {
        entry: newEntry,
        previousAttempts: currentAttempts
      }
    },
    {
      entry: '',
      previousAttempts: []
    }
  )
  useEffect(() => {
    window.addEventListener('keyup', setAttempt)
    return () => {
      window.removeEventListener('keyup', setAttempt)
    }
  }, [])

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
        justifyContent: 'center'
      }}
    >
      <Box sx={{ width: '60%', height: '80%' }}>
        <Grid
          container
          sx={{ height: '100%' }}
          columns={letterCount}
          spacing={1}
        >
          {[
            ...getTopGrid(
              getEntryProps(letterCount)(gameState.entry),
              gameState.previousAttempts
            ),
            ...getEmptyGridRows(attempts, letterCount)
          ].map(row =>
            row.map(({ value, state }: LetterBoxProps, index: number) => (
              <LetterBox
                key={`${value}${index}-inputrow`}
                state={state}
                value={value}
                attempts={attempts}
              />
            ))
          )}
        </Grid>
      </Box>
    </Box>
  )
}

const NotWordle: FC = () => {
  return <WordleGrid letterCount={4} attempts={4} />
}
export default NotWordle
