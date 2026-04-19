import { CONFIG } from './config.js'
import { showToast } from './toast.js'
import { burstParticles } from './particles.js'

const STORAGE_KEY      = 'rsvp_id'
const STORAGE_DATA_KEY = 'rsvp_data'

async function getSupabase() {
  const { url, anonKey } = CONFIG.supabase
  if (!url || !anonKey) return null
  const { createClient } = await import('@supabase/supabase-js')
  return createClient(url, anonKey)
}

export function initRsvp() {
  const form    = document.getElementById('rsvp-form')
  const success = document.getElementById('rsvp-success')
  const submit  = document.getElementById('rsvp-submit')
  const editBtn = document.getElementById('rsvp-edit-btn')

  if (!form) return

  form.querySelectorAll('.form-select').forEach(initCustomSelect)

  if (localStorage.getItem(STORAGE_KEY)) {
    showSuccess()
  }

  editBtn?.addEventListener('click', () => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_DATA_KEY) || '{}')
    prefillForm(form, saved)
    form.hidden = false
    if (success) success.hidden = true
  })

  form.addEventListener('submit', async e => {
    e.preventDefault()
    if (!validate(form)) return

    burstParticles(submit)
    submit.classList.add('btn--loading')
    submit.disabled = true

    const formData  = Object.fromEntries(new FormData(form))
    const payload   = { ...formData, headcount: parseInt(formData.headcount) || null }
    const savedId   = localStorage.getItem(STORAGE_KEY)

    try {
      const supabase = await getSupabase()

      if (supabase) {
        if (savedId && savedId !== 'dev-mode') {
          const { error } = await supabase.from('rsvp').update(payload).eq('id', savedId)
          if (error) throw error
        } else {
          const { data, error } = await supabase.from('rsvp').insert(payload).select('id').single()
          if (error) throw error
          localStorage.setItem(STORAGE_KEY, data.id)
        }
      } else {
        await new Promise(r => setTimeout(r, 800))
        if (!savedId) localStorage.setItem(STORAGE_KEY, 'dev-mode')
      }

      localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify(formData))
      submit.classList.remove('btn--loading')
      submit.disabled = false
      showSuccess()

    } catch {
      showToast('전송에 실패했습니다. 잠시 후 다시 시도해주세요.')
      submit.classList.remove('btn--loading')
      submit.disabled = false
    }
  })

  function showSuccess() {
    form.hidden = true
    if (success) success.hidden = false
  }
}

function prefillForm(form, data) {
  const nameEl = form.querySelector('#rsvp-name')
  if (nameEl && data.name) nameEl.value = data.name

  ;['side', 'attend', 'meal'].forEach(field => {
    if (!data[field]) return
    const radio = form.querySelector(`input[name="${field}"][value="${data[field]}"]`)
    if (radio) radio.checked = true
  })

  const select = form.querySelector('#rsvp-headcount')
  if (select && data.headcount) select.value = data.headcount
}

function initCustomSelect(selectEl) {
  const options = Array.from(selectEl.options)

  const wrapper = document.createElement('div')
  wrapper.className = 'custom-select-wrapper'
  selectEl.parentNode.insertBefore(wrapper, selectEl)
  wrapper.appendChild(selectEl)
  selectEl.hidden = true

  const trigger = document.createElement('div')
  trigger.className = 'custom-select__trigger'
  trigger.setAttribute('role', 'button')
  trigger.setAttribute('tabindex', '0')
  trigger.innerHTML = `
    <span class="custom-select__value">${options[selectEl.selectedIndex]?.text ?? options[0].text}</span>
    <svg class="custom-select__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>`

  const dropdown = document.createElement('ul')
  dropdown.className = 'custom-select__dropdown'
  dropdown.setAttribute('role', 'listbox')

  options.forEach(opt => {
    const li = document.createElement('li')
    li.className = 'custom-select__option' + (opt.selected ? ' is-selected' : '')
    li.setAttribute('role', 'option')
    li.textContent = opt.text
    li.dataset.value = opt.value

    li.addEventListener('click', () => {
      selectEl.value = opt.value
      wrapper.querySelector('.custom-select__value').textContent = opt.text
      dropdown.querySelectorAll('.custom-select__option').forEach(o => o.classList.remove('is-selected'))
      li.classList.add('is-selected')
      wrapper.classList.remove('is-open')
    })
    dropdown.appendChild(li)
  })

  const box = document.createElement('div')
  box.className = 'custom-select'
  box.appendChild(trigger)
  box.appendChild(dropdown)
  wrapper.appendChild(box)

  trigger.addEventListener('click', e => {
    e.stopPropagation()
    wrapper.classList.toggle('is-open')
  })
  trigger.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      wrapper.classList.toggle('is-open')
    }
  })
  document.addEventListener('click', () => wrapper.classList.remove('is-open'))
}

function validate(form) {
  const name   = form.querySelector('#rsvp-name')
  const attend = form.querySelector('input[name="attend"]:checked')

  if (!name?.value.trim()) {
    showToast('이름을 입력해주세요.')
    name?.focus()
    return false
  }
  if (!attend) {
    showToast('참석 여부를 선택해주세요.')
    return false
  }
  return true
}
