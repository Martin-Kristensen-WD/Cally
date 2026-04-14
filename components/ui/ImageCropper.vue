<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div class="bg-white rounded-[24px] p-6 w-full max-w-sm shadow-2xl space-y-5">
        <h3 class="font-display text-[20px] font-semibold text-charcoal-800 tracking-tight">Beskær billede</h3>

        <!-- Crop frame -->
        <div
          ref="frameRef"
          class="relative overflow-hidden rounded-[14px] bg-cream-100 cursor-grab active:cursor-grabbing select-none"
          style="aspect-ratio: 4 / 3; touch-action: none"
          @mousedown.prevent="onMouseDown"
          @touchstart.prevent="onTouchStart"
        >
          <img
            ref="imgRef"
            :src="src"
            class="absolute pointer-events-none"
            :style="imgStyle"
            draggable="false"
            @load="onLoad"
          />
        </div>

        <!-- Zoom slider -->
        <div class="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-charcoal-700/40 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6" />
          </svg>
          <input
            type="range"
            :min="minScale"
            :max="minScale * 3"
            :step="0.001"
            :value="scale"
            class="flex-1 accent-charcoal-800"
            @input="onZoom"
          />
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-charcoal-700/40 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
          </svg>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <button type="button" class="btn-primary flex-1" @click="confirm">Beskær & brug billede</button>
          <button type="button" class="btn-ghost" @click="$emit('cancel')">Annuller</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{ src: string }>()
const emit = defineEmits<{
  crop: [file: File]
  cancel: []
}>()

const frameRef = ref<HTMLElement | null>(null)
const imgRef = ref<HTMLImageElement | null>(null)

const panX = ref(0)
const panY = ref(0)
const scale = ref(1)
const minScale = ref(1)
const natW = ref(0)
const natH = ref(0)

const imgStyle = computed(() => ({
  left: panX.value + 'px',
  top: panY.value + 'px',
  width: (natW.value * scale.value) + 'px',
  height: (natH.value * scale.value) + 'px',
}))

const constrain = () => {
  const frame = frameRef.value
  if (!frame) return
  const fW = frame.clientWidth
  const fH = frame.clientHeight
  const dW = natW.value * scale.value
  const dH = natH.value * scale.value
  // If image is smaller than frame in a dimension, center it; otherwise clamp to edges
  panX.value = dW < fW ? (fW - dW) / 2 : Math.min(0, Math.max(fW - dW, panX.value))
  panY.value = dH < fH ? (fH - dH) / 2 : Math.min(0, Math.max(fH - dH, panY.value))
}

const initCropper = () => {
  const img = imgRef.value
  const frame = frameRef.value
  if (!img || !frame) return
  const fW = frame.clientWidth
  const fH = frame.clientHeight
  // Frame not laid out yet — retry next frame
  if (!fW || !fH) { requestAnimationFrame(initCropper); return }
  natW.value = img.naturalWidth
  natH.value = img.naturalHeight
  const ms = Math.max(fW / natW.value, fH / natH.value)
  minScale.value = ms
  scale.value = ms
  panX.value = (fW - natW.value * ms) / 2
  panY.value = (fH - natH.value * ms) / 2
}

const onLoad = () => nextTick(initCropper)

onMounted(() => nextTick(() => {
  if (imgRef.value?.complete) initCropper()
}))

const onZoom = (e: Event) => {
  const newScale = parseFloat((e.target as HTMLInputElement).value)
  const frame = frameRef.value
  if (!frame) { scale.value = newScale; constrain(); return }
  const cx = frame.clientWidth / 2
  const cy = frame.clientHeight / 2
  // Keep the image point under the centre pinned
  const imgX = (cx - panX.value) / scale.value
  const imgY = (cy - panY.value) / scale.value
  scale.value = newScale
  panX.value = cx - imgX * newScale
  panY.value = cy - imgY * newScale
  constrain()
}

// ── Drag ──────────────────────────────────────────────
let sx = 0, sy = 0, spx = 0, spy = 0

const onMouseDown = (e: MouseEvent) => {
  sx = e.clientX; sy = e.clientY; spx = panX.value; spy = panY.value
  const move = (e: MouseEvent) => {
    panX.value = spx + e.clientX - sx
    panY.value = spy + e.clientY - sy
    constrain()
  }
  const up = () => {
    document.removeEventListener('mousemove', move)
    document.removeEventListener('mouseup', up)
  }
  document.addEventListener('mousemove', move)
  document.addEventListener('mouseup', up)
}

const onTouchStart = (e: TouchEvent) => {
  if (e.touches.length !== 1) return
  const t = e.touches[0]
  sx = t.clientX; sy = t.clientY; spx = panX.value; spy = panY.value
  const move = (e: TouchEvent) => {
    if (e.touches.length !== 1) return
    const t = e.touches[0]
    panX.value = spx + t.clientX - sx
    panY.value = spy + t.clientY - sy
    constrain()
  }
  const end = () => {
    document.removeEventListener('touchmove', move)
    document.removeEventListener('touchend', end)
  }
  document.addEventListener('touchmove', move, { passive: true })
  document.addEventListener('touchend', end)
}

// ── Crop ──────────────────────────────────────────────
const confirm = () => {
  const frame = frameRef.value
  const img = imgRef.value
  if (!frame || !img) return
  const fW = frame.clientWidth
  const fH = frame.clientHeight
  const s = scale.value
  const srcX = Math.max(0, -panX.value / s)
  const srcY = Math.max(0, -panY.value / s)
  const srcW = Math.min(natW.value - srcX, fW / s)
  const srcH = Math.min(natH.value - srcY, fH / s)
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 900
  canvas.getContext('2d')!.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, 1200, 900)
  canvas.toBlob(
    blob => { if (blob) emit('crop', new File([blob], 'cropped.jpg', { type: 'image/jpeg' })) },
    'image/jpeg', 0.9,
  )
}
</script>
