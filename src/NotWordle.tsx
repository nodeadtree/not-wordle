import React, { FC, useEffect, useReducer } from 'react'
import { getWordleTester, PlaceResult } from './game'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

const words = new Set(['bear', 'leap', 'sper'])
export enum LetterBoxState {
  vacant,
  awaitingInput,
  thirstyForInput,
  inputStandby,
  inputSending,
  incorrectLetter,
  misplacedLetter,
  correctLetter
}
// Throw this in the utils folder at some point?
// sorry
const getEntryProps2 = (positions: number) => (entry: string) =>
  (entry.length < positions ? [...entry.split('')] : entry.split('')).map(
    (letter: string) => ({
      value: letter,
      state: LetterBoxState.inputStandby
    })
  )
const getEmptyLetterBoxRow = (letterCount: number) =>
  new Array<LetterBoxProps>(letterCount).fill({
    value: ' ',
    state: LetterBoxState.vacant
  })
const getEmptyGridRows = (rows: number, letterCount: number) =>
  new Array<LetterBoxProps[]>(rows).fill(getEmptyLetterBoxRow(letterCount))

const placeResultToProps = (position: PlaceResult) => ({
  value: position.letter,
  state: position.isCorrect
    ? LetterBoxState.correctLetter
    : position.isInWord
    ? LetterBoxState.misplacedLetter
    : LetterBoxState.incorrectLetter
})

const getTopGrid =
  (letterCount: number, attempts: number) =>
  (
    entryRow: LetterBoxProps[],
    previousAttempts: PlaceResult[][]
  ): LetterBoxProps[][] => {
    return [
      ...previousAttempts.map(attempt => attempt.map(placeResultToProps)),
      entryRow
      // remaining rows
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
      ? getEmptyLetterBoxRow(positions - entry.length - 1)
      : [])
  ]

const stateMap: Record<LetterBoxState, string> = {
  [LetterBoxState.awaitingInput]: '#adc493',
  [LetterBoxState.thirstyForInput]: '#adc493',
  [LetterBoxState.inputStandby]: '#adc493',
  [LetterBoxState.inputSending]: '#adc493',
  [LetterBoxState.incorrectLetter]: '#adc493',
  [LetterBoxState.misplacedLetter]: '#adc493',
  [LetterBoxState.correctLetter]: '#adc493',
  [LetterBoxState.vacant]: '#adc493'
}

interface LetterBoxProps {
  value: string
  state: LetterBoxState
  attempts?: number
}

const LetterBox: FC<LetterBoxProps> = ({ value, state, attempts }) => {
  return (
    <Grid
      item
      xs={1}
      sx={{ ...(attempts ? { height: `${100 / attempts}%` } : {}) }}
    >
      <Box
        sx={{
          p: 2,
          // justifyContent: 'center',
          bgcolor: stateMap[state],
          fontSize: 72,
          textAlign: 'center'
        }}
      >
        {`${value}`}
      </Box>
    </Grid>
  )
}

interface AttemptState {
  entry: string
  previousAttempts: PlaceResult[][]
}
/*
* get the empty rows i need
      ...(getEmptyGridRows(
        previousAttempts.length + 1 < attempts
          ? attempts - previousAttempts.length - 1
          : 0,
        letterCount
      ) || [])
      */

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
      // Remove these from the game state reducer
      //const newEntryRow = getEntryProps(letterCount)(newEntry)
      //const grid = getGrid(letterCount, attempts)(newEntryRow, currentAttempts)
      // Return rounds
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
            ...getTopGrid(letterCount, attempts)(
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
// Need a grid component
// Need a letter square component
//  - needs 4 states:
//    - Unused
//    - Wrong letter
//    - Right letter, wrong position
//    - right letter, right position
//    - win
const NotWordle: FC = () => {
  return <WordleGrid letterCount={4} attempts={4} />
}
export default NotWordle
