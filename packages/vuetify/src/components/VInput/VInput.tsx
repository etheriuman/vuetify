import './VInput.sass'

// Components
import { VIcon } from '@/components/VIcon'

// Composables
import { makeDensityProps, useDensity } from '@/composables/density'
import { useProxiedModel } from '@/composables/proxiedModel'

// Utilities
import { computed, watchEffect } from 'vue'
import { defineComponent, getUid } from '@/util'

// Types
import type { PropType } from 'vue'

export const VInput = defineComponent({
  name: 'VInput',

  props: {
    id: String,
    active: Boolean,
    disabled: Boolean,
    focused: Boolean,
    dirty: Boolean,
    appendIcon: String,
    prependIcon: String,
    hideDetails: [Boolean, String] as PropType<boolean | 'auto'>,
    direction: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'horizontal',
      validator: (v: any) => ['horizontal', 'vertical'].includes(v),
    },

    ...makeDensityProps(),
  },

  emits: {
    'click:prepend': (e: MouseEvent) => true,
    'click:append': (e: MouseEvent) => true,
    'update:focused': (v: Boolean) => true,
    'update:active': (v: Boolean) => true,
  },

  setup (props, { slots, emit }) {
    const isActive = useProxiedModel(props, 'active')
    const isFocused = useProxiedModel(props, 'focused')
    const { densityClasses } = useDensity(props, 'v-input')

    const uid = getUid()
    const id = computed(() => props.id || `input-${uid}`)

    watchEffect(() => isActive.value = isFocused.value || props.dirty)

    return () => {
      const hasPrepend = (slots.prepend || props.prependIcon)
      const hasAppend = (slots.append || props.appendIcon)

      return (
        <div class={[
          'v-input',
          {
            'v-input--active': isActive.value,
            'v-input--dirty': props.dirty,
            'v-input--disabled': props.disabled,
            'v-input--focused': isFocused.value,
          },
          `v-input--${props.direction}`,
          densityClasses.value,
        ]}
        >
          { hasPrepend && (
            <div
              class="v-input__prepend"
              onClick={ e => emit('click:prepend', e) }
            >
              { slots.prepend
                ? slots.prepend()
                : (<VIcon icon={ props.prependIcon } />)
              }
            </div>
          )}

          <div class="v-input__control">
            { slots.default?.({
              id: id.value,
              isActive: isActive.value,
              isFocused: isFocused.value,
              isDirty: props.dirty,
              focus: () => isFocused.value = true,
              blur: () => isFocused.value = false,
            }) }
          </div>

          { hasAppend && (
            <div
              class="v-input__append"
              onClick={ e => emit('click:append', e) }
            >
              { slots.append
                ? slots.append()
                : (<VIcon icon={ props.appendIcon } />)
              }
            </div>
          )}

          { slots.details && (
            <div class="v-input__details">
              { slots.details() }
            </div>
          )}
        </div>
      )
    }
  },
})

/* eslint-disable-next-line @typescript-eslint/no-redeclare */
export type VInput = InstanceType<typeof VInput>
