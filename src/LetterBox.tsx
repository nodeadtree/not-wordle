import React, { FC } from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

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

export interface LetterBoxProps {
  value: string
  state: LetterBoxState
  attempts?: number
}

export const LetterBox: FC<LetterBoxProps> = ({ value, state, attempts }) => {
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
