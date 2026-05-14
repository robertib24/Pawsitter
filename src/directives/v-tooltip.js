// Directivă personalizată: v-tooltip
// Afișează un tooltip la hover peste element
// Folosire: <button v-tooltip="'Text tooltip'">Buton</button>
//           <button v-tooltip:bottom="'Tooltip jos'">Buton</button>

// Demonstrează folosirea argumentelor și a valorii directivei
export const tooltipDirective = {
  // mounted — adăugăm event listener-i pentru mouse
  mounted(el, binding) {
    // binding.value conține valoarea directivei (textul tooltip-ului)
    // binding.arg conține argumentul (poziția: top, bottom, left, right)
    const text = binding.value
    const position = binding.arg || 'top'

    if (!text) return

    // Creăm elementul tooltip dinamic
    const tooltip = document.createElement('div')
    tooltip.className = `custom-tooltip tooltip-${position}`
    tooltip.textContent = text

    // Salvăm referința la tooltip în element pentru folosire în alte hook-uri
    el._tooltip = tooltip

    // Handler pentru afișarea tooltip-ului
    el._showTooltip = () => {
      document.body.appendChild(tooltip)
      const rect = el.getBoundingClientRect()

      // Calculăm poziția în funcție de argument
      if (position === 'top') {
        tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`
      } else if (position === 'bottom') {
        tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`
        tooltip.style.top = `${rect.bottom + 8}px`
      } else if (position === 'left') {
        tooltip.style.left = `${rect.left - tooltip.offsetWidth - 8}px`
        tooltip.style.top = `${rect.top + rect.height / 2 - tooltip.offsetHeight / 2}px`
      } else if (position === 'right') {
        tooltip.style.left = `${rect.right + 8}px`
        tooltip.style.top = `${rect.top + rect.height / 2 - tooltip.offsetHeight / 2}px`
      }

      tooltip.style.opacity = '1'
    }

    // Handler pentru ascunderea tooltip-ului
    el._hideTooltip = () => {
      tooltip.style.opacity = '0'
      setTimeout(() => {
        if (tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip)
        }
      }, 200)
    }

    el.addEventListener('mouseenter', el._showTooltip)
    el.addEventListener('mouseleave', el._hideTooltip)
  },

  // unmounted — curățăm resursele când elementul este eliminat
  // Foarte important pentru a preveni memory leaks
  unmounted(el) {
    if (el._showTooltip) {
      el.removeEventListener('mouseenter', el._showTooltip)
      el.removeEventListener('mouseleave', el._hideTooltip)
    }
    if (el._tooltip && el._tooltip.parentNode) {
      el._tooltip.parentNode.removeChild(el._tooltip)
    }
  }
}
