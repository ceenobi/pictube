import FileSaver from 'file-saver'

export async function downloadImage(_id, image) {
  FileSaver.saveAs(image, `download-${_id}.jpg`)
}
