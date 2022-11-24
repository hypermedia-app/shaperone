export interface NewFieldDefaults extends Record<string, unknown> {
  open: boolean
}

interface Settings {
  hoist: boolean
  newFieldDefaults: NewFieldDefaults
}

export const settings: Settings = {
  hoist: true,
  newFieldDefaults: {
    open: true,
  },
}
