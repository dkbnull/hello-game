export async function saveAsImage(element, filename = 'result.png') {
    if (!element) return

    try {
        const {default: html2canvas} = await import('html2canvas')
        const canvas = await html2canvas(element, {
            backgroundColor: '#ffffff',
            scale: 2,
            useCORS: true,
            logging: false,
        })
        const link = document.createElement('a')
        link.download = filename
        link.href = canvas.toDataURL('image/png')
        link.click()
    } catch {
        fallbackSaveAsImage(element, filename)
    }
}

function fallbackSaveAsImage(element, filename) {
    const canvas = document.createElement('canvas')
    const rect = element.getBoundingClientRect()
    const scale = 2
    canvas.width = rect.width * scale
    canvas.height = rect.height * scale
    const ctx = canvas.getContext('2d')
    ctx.scale(scale, scale)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, rect.width, rect.height)

    const svgData = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${rect.width}" height="${rect.height}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: sans-serif;">
          ${element.innerHTML}
        </div>
      </foreignObject>
    </svg>
  `

    const img = new Image()
    img.onload = () => {
        ctx.drawImage(img, 0, 0)
        const link = document.createElement('a')
        link.download = filename
        link.href = canvas.toDataURL('image/png')
        link.click()
    }
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData)
}
