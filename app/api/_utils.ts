export const required = (name: string, v: string | undefined) => {
  if (!v) throw new Error(`Missing env: ${name}`)
  return v
}
