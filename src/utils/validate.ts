export const isValidUsername = (str: string) => /^[0-9]*$/.test(str)

export const isExternal = (path: string) => /^(https?:|mailto:|tel:)/.test(path)
