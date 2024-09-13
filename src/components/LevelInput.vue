<script setup lang="ts">
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput
} from '@/components/ui/number-field'

defineEmits<{
  (e: 'setFieldValue', field: 'level', value: number | undefined, shouldValidate?: boolean): void
}>()
</script>

<template>
  <FormField v-slot="{ value }" name="level">
    <FormItem class="flex flex-col flex-1">
      <FormLabel>Level</FormLabel>
      <NumberField
        :min="1"
        :max="3"
        :model-value="value"
        @update:model-value="
          (v) =>
            v ? $emit('setFieldValue', 'level', v) : $emit('setFieldValue', 'level', undefined)
        "
      >
        <NumberFieldContent>
          <NumberFieldDecrement />
          <FormControl>
            <NumberFieldInput />
          </FormControl>
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
