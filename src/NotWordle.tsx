import React, { FC, useEffect, useReducer } from 'react'
import { getWordleTester, PlaceResult } from './game'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

const words = new Set(['bear', 'leap', 'spler'])
export enum LetterBoxState {
  awaitingInput,
  inputStandby,
  inputSending,
  incorrectLetter,
  misplacedLetter,
  correctLetter
}

const stateMap: Record<LetterBoxState, string> = {
  [LetterBoxState.awaitingInput]: '#adc493',
  [LetterBoxState.inputStandby]: '#adc493',
  [LetterBoxState.inputSending]: '#adc493',
  [LetterBoxState.incorrectLetter]: '#adc493',
  [LetterBoxState.misplacedLetter]: '#adc493',
  [LetterBoxState.correctLetter]: '#adc493'
}
interface LetterBoxProps {
  value: string
  state: LetterBoxState
}

const LetterBox: FC<LetterBoxProps> = ({ value, state }) => {
  return (
    <Box
      sx={{
        p: 2,
        // justifyContent: 'center',
        bgcolor: stateMap[state],
        fontSize: 72,
        textAlign: 'center'
      }}
    >
      {value}
    </Box>
  )
}

interface AttemptState {
  entry: string
  previousAttempts: PlaceResult[][]
}

const WordleGrid: FC<{ letterCount: number; attempts: number }> = ({
  letterCount,
  attempts
}) => {
  // const [entry, setEntry] = useState('')
  // const [warning, setShowWarning] = useState(true)
  // const [previousAttempts, setPreviousAttempts] = useState([] as PlaceResult[][])
  const [gameState, setAttempt] = useReducer(
    (state: AttemptState, event: KeyboardEvent) => {
      console.log(state)
      const { entry } = state
      const wordleTester = getWordleTester(words, 'bear')
      if (
        'abcdefghijklmnopqrstuvwxyz'.includes(event.key) &&
        entry.length < letterCount
      ) {
        return {
          entry: entry.concat(event.key),
          previousAttempts: state.previousAttempts
        }
      }
      if (event.key === 'Enter') {
        return {
          entry: '',
          previousAttempts: [
            ...state.previousAttempts,
            wordleTester.guessDelta(state.entry)
          ]
        }
      }
      if (event.key === 'Backspace' && entry.length > 0) {
        return {
          entry: entry.slice(0, entry.length - 1),
          previousAttempts: state.previousAttempts
        }
      }
      return state
    },
    { entry: '', previousAttempts: [] }
  )
  useEffect(() => {
    window.addEventListener('keyup', setAttempt)
    console.log()
    return () => {
      window.removeEventListener('keyup', setAttempt)
    }
  }, [])
  console.log('i was here')
  // Get actual list of words in here at some point
  // {warning && 'Bad input'}
  return (
    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
      <Box sx={{ width: '60%' }}>
        <Grid container columns={letterCount} spacing={1}>
          {gameState.entry.split('').map((char, index) => (
            <Grid item key={`${char}${index}`} xs={1}>
              <LetterBox state={LetterBoxState.inputStandby} value={char} />
            </Grid>
          ))}
        </Grid>
        {gameState.previousAttempts.map((attempt, index) => (
          <Grid container key={index} columns={letterCount} spacing={1}>
            {attempt.map((letter: PlaceResult, innerIndex) => (
              <Grid item key={innerIndex} xs={1}>
                <LetterBox
                  state={LetterBoxState.inputStandby}
                  value={letter.letter}
                />
              </Grid>
            ))}
          </Grid>
        ))}
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
