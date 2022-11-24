interface Settings {
  hoist: boolean
  newFieldDefaults: Record<string, unknown>
}

export const settings: Settings = {
  hoist: true,
  newFieldDefaults: {},
}
