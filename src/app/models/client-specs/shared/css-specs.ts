import { COLOR_LIST, SIZE_LIST } from '../../constants/css-constants'

export type ButtonColor = 'default' | 'primary' | 'clear'

export type CssSize = typeof SIZE_LIST[number]

export type CssColor = typeof COLOR_LIST[number]

export type FontWeight = 200 | 400 | 700
