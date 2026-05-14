// Directivă personalizată: v-focus
// Pune automat focus pe element când acesta este montat în DOM
// Folosire: <input v-focus />

export const focusDirective = {
  // mounted — se execută imediat după ce elementul a fost inserat în DOM
  mounted(el) {
    el.focus()
  }
}
