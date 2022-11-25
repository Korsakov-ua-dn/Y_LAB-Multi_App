// export default {

//   open: (name: string) => {
//     return {type: 'modal/open', payload: {name}} as const;
//   },

//   close: () => {
//     return {type: 'modal/close'}
//   }

// }

// actions
export const open = (name: string) => ({type: 'modal/open', payload: {name}} as const)
export const close = (name: string) => ({type: 'modal/close'} as const)

// types
export type ModalsActionType = ReturnType<typeof open> | ReturnType<typeof close>
